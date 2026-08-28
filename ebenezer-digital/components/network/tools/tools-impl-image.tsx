"use client";

import { useState } from "react";
import { trackNetworkEvent } from "@/lib/network/analytics";
import {
  CopyButton,
  ErrorMsg,
  Field,
  GhostBtn,
  ImagePicker,
  Panel,
  PrimaryBtn,
  Result,
  Toolbar,
  downloadDataUrl,
  useImageFile,
} from "./tool-ui";

/**
 * Compact QR Code generator (byte mode, ECC-M, versions 1–6).
 * Adapted from Kazuhiko Arase's MIT-licensed qrcode-generator (simplified).
 */
function generateQrMatrix(text: string): boolean[][] {
  const QR = (() => {
    const PAD0 = 0xec;
    const PAD1 = 0x11;
    const EXP: number[] = [];
    const LOG: number[] = [];
    (() => {
      for (let i = 0; i < 256; i++) {
        EXP[i] = i < 8 ? 1 << i : EXP[i - 4] ^ EXP[i - 5] ^ EXP[i - 6] ^ EXP[i - 8];
        LOG[EXP[i]] = i;
      }
      for (let i = 256; i < 512; i++) EXP[i] = EXP[i - 255];
    })();
    const gmul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

    // [version][eccM] = [totalDataCodewords, ecPerBlock, blocks]
    const RS: Record<number, [number, number, number]> = {
      1: [16, 10, 1],
      2: [28, 16, 1],
      3: [44, 26, 1],
      4: [64, 36, 2],
      5: [86, 48, 2],
      6: [108, 64, 4],
    };

    function rsPoly(n: number) {
      let p = [1];
      for (let i = 0; i < n; i++) {
        const next = new Array(p.length + 1).fill(0);
        for (let j = 0; j < p.length; j++) {
          next[j] ^= p[j];
          next[j + 1] ^= gmul(p[j], EXP[i]);
        }
        p = next;
      }
      return p;
    }

    function rsEncode(data: number[], ecLen: number) {
      const gen = rsPoly(ecLen);
      const msg = data.concat(new Array(ecLen).fill(0));
      for (let i = 0; i < data.length; i++) {
        const coef = msg[i];
        if (!coef) continue;
        for (let j = 0; j < gen.length; j++) msg[i + j] ^= gmul(gen[j], coef);
      }
      return msg.slice(data.length);
    }

    function chooseVersion(byteLen: number) {
      for (let v = 1; v <= 6; v++) {
        const [dataCW] = RS[v];
        // mode(4) + len(8) + data + pad
        const need = Math.ceil((4 + 8 + byteLen * 8) / 8);
        if (need <= dataCW) return v;
      }
      throw new Error("That text is too long for this QR tool. Try a shorter URL or message (about 100 characters).");
    }

    function make(v: number, bytes: number[]) {
      const size = v * 4 + 17;
      const [dataCW, ecLen, blocks] = RS[v];
      const bits: number[] = [];
      const put = (val: number, len: number) => {
        for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
      };
      put(0b0100, 4);
      put(bytes.length, 8);
      bytes.forEach((b) => put(b, 8));
      const maxBits = dataCW * 8;
      const term = Math.min(4, maxBits - bits.length);
      for (let i = 0; i < term; i++) bits.push(0);
      while (bits.length % 8) bits.push(0);
      let p = 0;
      while (bits.length < maxBits) {
        put(p % 2 === 0 ? PAD0 : PAD1, 8);
        p++;
      }
      const data: number[] = [];
      for (let i = 0; i < bits.length; i += 8) {
        let b = 0;
        for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
        data.push(b);
      }

      // split into blocks (equal size approx)
      const blockDataLen = Math.floor(dataCW / blocks);
      const shortBlocks = blocks - (dataCW % blocks);
      const dcBlocks: number[][] = [];
      let offset = 0;
      for (let i = 0; i < blocks; i++) {
        const len = blockDataLen + (i < shortBlocks ? 0 : 1);
        // for M level versions 1-3 shortBlocks handling: dataCW % blocks often 0
        const actual = i < dataCW % blocks ? blockDataLen + 1 : blockDataLen;
        const slice = data.slice(offset, offset + (dataCW % blocks === 0 ? blockDataLen : actual));
        // simplify: equal split when divisible
        void len;
        offset += slice.length;
        dcBlocks.push(slice.length ? slice : data.slice(0, 0));
      }
      // rebuild cleaner equal split
      dcBlocks.length = 0;
      offset = 0;
      const base = Math.floor(dataCW / blocks);
      const extra = dataCW % blocks;
      for (let i = 0; i < blocks; i++) {
        const len = base + (i >= blocks - extra ? 1 : 0);
        dcBlocks.push(data.slice(offset, offset + len));
        offset += len;
      }
      const ecBlocks = dcBlocks.map((b) => rsEncode(b, ecLen));

      // interleave
      const maxDC = Math.max(...dcBlocks.map((b) => b.length));
      const interleaved: number[] = [];
      for (let i = 0; i < maxDC; i++) {
        for (const b of dcBlocks) if (i < b.length) interleaved.push(b[i]);
      }
      for (let i = 0; i < ecLen; i++) {
        for (const b of ecBlocks) interleaved.push(b[i]);
      }

      const mod: (0 | 1 | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
      const isEmpty = (r: number, c: number) => mod[r]?.[c] === null;
      const set = (r: number, c: number, v: 0 | 1) => {
        if (r >= 0 && c >= 0 && r < size && c < size) mod[r][c] = v;
      };

      const finder = (r0: number, c0: number) => {
        for (let r = -1; r <= 7; r++) {
          for (let c = -1; c <= 7; c++) {
            const rr = r0 + r;
            const cc = c0 + c;
            if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
            const inFinder = r >= 0 && r <= 6 && c >= 0 && c <= 6;
            const on =
              inFinder &&
              (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
            set(rr, cc, on ? 1 : 0);
          }
        }
      };
      finder(0, 0);
      finder(0, size - 7);
      finder(size - 7, 0);

      for (let i = 8; i < size - 8; i++) {
        if (isEmpty(6, i)) set(6, i, i % 2 === 0 ? 1 : 0);
        if (isEmpty(i, 6)) set(i, 6, i % 2 === 0 ? 1 : 0);
      }
      set(size - 8, 8, 1);

      // alignment patterns (versions 2+)
      if (v >= 2) {
        const pos = v === 2 ? [6, 18] : v === 3 ? [6, 22] : v === 4 ? [6, 26] : v === 5 ? [6, 30] : [6, 34];
        for (const r of pos) {
          for (const c of pos) {
            if ((r < 9 && c < 9) || (r < 9 && c > size - 10) || (r > size - 10 && c < 9)) continue;
            for (let dr = -2; dr <= 2; dr++) {
              for (let dc = -2; dc <= 2; dc++) {
                const dist = Math.max(Math.abs(dr), Math.abs(dc));
                set(r + dr, c + dc, dist === 0 || dist === 2 ? 1 : 0);
              }
            }
          }
        }
      }

      // reserve format
      for (let i = 0; i < 9; i++) {
        if (isEmpty(8, i)) set(8, i, 0);
        if (isEmpty(i, 8)) set(i, 8, 0);
      }
      for (let i = 0; i < 8; i++) {
        if (isEmpty(8, size - 1 - i)) set(8, size - 1 - i, 0);
        if (isEmpty(size - 1 - i, 8)) set(size - 1 - i, 8, 0);
      }

      // data placement mask 0: (r+c)%2==0
      const totalBits = interleaved.length * 8;
      let bi = 0;
      for (let right = size - 1; right > 0; right -= 2) {
        if (right === 6) right = 5;
        for (let vert = 0; vert < size; vert++) {
          for (let j = 0; j < 2; j++) {
            const c = right - j;
            const upward = Math.floor(right / 2) % 2 === 0;
            const r = upward ? size - 1 - vert : vert;
            if (!isEmpty(r, c)) continue;
            let bit = 0;
            if (bi < totalBits) {
              bit = (interleaved[bi >> 3] >>> (7 - (bi & 7))) & 1;
              bi++;
            }
            const mask = (r + c) % 2 === 0;
            set(r, c, (bit ^ (mask ? 1 : 0)) as 0 | 1);
          }
        }
      }

      // Format info: ECC M (01) + mask 0 (000) → BCH encoded
      // Precomputed format bits for mask0 / M: 0x5412
      const fmt = 0x5412;
      const coordsA: [number, number][] = [
        [8, 0],
        [8, 1],
        [8, 2],
        [8, 3],
        [8, 4],
        [8, 5],
        [8, 7],
        [8, 8],
        [7, 8],
        [5, 8],
        [4, 8],
        [3, 8],
        [2, 8],
        [1, 8],
        [0, 8],
      ];
      const coordsB: [number, number][] = [
        [size - 1, 8],
        [size - 2, 8],
        [size - 3, 8],
        [size - 4, 8],
        [size - 5, 8],
        [size - 6, 8],
        [size - 7, 8],
        [8, size - 8],
        [8, size - 7],
        [8, size - 6],
        [8, size - 5],
        [8, size - 4],
        [8, size - 3],
        [8, size - 2],
        [8, size - 1],
      ];
      for (let i = 0; i < 15; i++) {
        const bit = ((fmt >> (14 - i)) & 1) as 0 | 1;
        set(coordsA[i][0], coordsA[i][1], bit);
        set(coordsB[i][0], coordsB[i][1], bit);
      }

      return mod.map((row) => row.map((c) => c === 1));
    }

    return { chooseVersion, make };
  })();

  const bytes = Array.from(new TextEncoder().encode(text));
  const v = QR.chooseVersion(bytes.length);
  return QR.make(v, bytes);
}

function matrixToDataUrl(matrix: boolean[][], scale = 6, margin = 2): string {
  const n = matrix.length;
  const dim = (n + margin * 2) * scale;
  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
  if (canvas) {
    canvas.width = dim;
    canvas.height = dim;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, dim, dim);
      ctx.fillStyle = "#0b1220";
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (matrix[r][c]) ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
        }
      }
      return canvas.toDataURL("image/png");
    }
  }
  let rects = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) {
        rects += `<rect x="${(c + margin) * scale}" y="${(r + margin) * scale}" width="${scale}" height="${scale}" fill="#0b1220"/>`;
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/>${rects}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function QrCodeGenerator({ slug }: { slug: string }) {
  const [text, setText] = useState("https://ebenezerdigital.com");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  const generate = () => {
    if (!text.trim()) {
      setError("Enter text or a URL.");
      setDataUrl("");
      return;
    }
    try {
      const matrix = generateQrMatrix(text.trim());
      setDataUrl(matrixToDataUrl(matrix));
      setError("");
      trackNetworkEvent("tool_complete", { tool: slug, action: "generate" });
    } catch (e) {
      setDataUrl("");
      setError(e instanceof Error ? e.message : "QR generation failed");
    }
  };

  return (
    <Panel>
      <Field label="Text / URL">
        <textarea className="nx-textarea" style={{ minHeight: 100 }} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={generate}>Generate</PrimaryBtn>
        <GhostBtn
          disabled={!dataUrl}
          onClick={() => {
            downloadDataUrl("qrcode.png", dataUrl);
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
        <CopyButton text={text} slug={slug} label="Copy text" />
      </Toolbar>
      <ErrorMsg>{error}</ErrorMsg>
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dataUrl} alt="QR code" style={{ marginTop: 12, maxWidth: 280, borderRadius: 8, background: "#fff" }} />
      ) : null}
    </Panel>
  );
}

function loadToCanvas(
  img: HTMLImageElement,
  opts: { maxW?: number; maxH?: number; width?: number; height?: number; quality?: number; mime?: string }
): string {
  const canvas = document.createElement("canvas");
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (opts.width && opts.height) {
    w = opts.width;
    h = opts.height;
  } else if (opts.maxW || opts.maxH) {
    const mw = opts.maxW || w;
    const mh = opts.maxH || h;
    const scale = Math.min(1, mw / w, mh / h);
    w = Math.max(1, Math.round(w * scale));
    h = Math.max(1, Math.round(h * scale));
  }
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(img, 0, 0, w, h);
  const mime = opts.mime || "image/jpeg";
  return canvas.toDataURL(mime, opts.quality ?? 0.8);
}

export function ImageCompressor({ slug }: { slug: string }) {
  const { preview, error, img, file, onFile } = useImageFile(slug);
  const [quality, setQuality] = useState(0.75);
  const [out, setOut] = useState("");
  const [meta, setMeta] = useState<{
    originalKb: number;
    compressedKb: number;
    savings: number;
    width: number;
    height: number;
    format: string;
  } | null>(null);
  const [runError, setRunError] = useState("");

  const run = () => {
    if (!img || !file) return;
    trackNetworkEvent("tool_started", { tool: slug });
    try {
      const mime = file.type === "image/png" && quality > 0.9 ? "image/png" : "image/jpeg";
      const data = loadToCanvas(img, {
        quality,
        mime,
        maxW: 2560,
        maxH: 2560,
      });
      setOut(data);
      const compressedBytes = Math.round((data.length * 3) / 4);
      const originalKb = Math.round(file.size / 1024);
      const compressedKb = Math.max(1, Math.round(compressedBytes / 1024));
      const savings = Math.max(0, Math.round((1 - compressedBytes / file.size) * 100));
      setMeta({
        originalKb,
        compressedKb,
        savings,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type.replace("image/", "").toUpperCase(),
      });
      setRunError("");
      trackNetworkEvent("tool_complete", { tool: slug, action: "compress" });
    } catch {
      setRunError("We couldn't process this image. Please make sure it is a valid JPG, PNG or WebP and try again.");
      setOut("");
      setMeta(null);
    }
  };

  const recommended = file && file.size > 1_500_000 ? 0.65 : 0.75;

  return (
    <Panel>
      <ImagePicker onFile={onFile} error={error} preview={preview} />
      {img && file ? (
        <Result>
          Detected: {file.type.replace("image/", "").toUpperCase()} · {img.naturalWidth}×{img.naturalHeight}px ·{" "}
          {Math.round(file.size / 1024)} KB
          {file.size > 800_000 ? ` · Suggested quality ~${Math.round(recommended * 100)}%` : ""}
        </Result>
      ) : null}
      <Field label={`Compression quality (${Math.round(quality * 100)}%)`}>
        <input
          className="nx-input"
          type="range"
          min={0.1}
          max={0.95}
          step={0.05}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          aria-valuemin={10}
          aria-valuemax={95}
          aria-valuenow={Math.round(quality * 100)}
        />
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={run} disabled={!img}>
          Compress
        </PrimaryBtn>
        <GhostBtn
          disabled={!out}
          onClick={() => {
            downloadDataUrl("compressed.jpg", out);
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <ErrorMsg>{runError}</ErrorMsg>
      {meta ? (
        <Result>
          Original {meta.originalKb} KB → Compressed {meta.compressedKb} KB
          {meta.savings > 0 ? ` · Saved ${meta.savings}%` : " · Similar size (try lower quality)"} · {meta.width}×
          {meta.height}px
        </Result>
      ) : null}
      {out ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={out} alt="Compressed preview" style={{ maxWidth: "100%", marginTop: 12, borderRadius: 12 }} />
      ) : null}
    </Panel>
  );
}

export function ImageResizer({ slug }: { slug: string }) {
  const { preview, error, img, onFile } = useImageFile(slug);
  const [w, setW] = useState("800");
  const [h, setH] = useState("600");
  const [keep, setKeep] = useState(true);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  const run = () => {
    if (!img) return;
    let width = Number(w);
    let height = Number(h);
    if (!Number.isFinite(width) || width < 1) {
      setErr("Invalid width.");
      return;
    }
    if (keep) {
      height = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * width));
      setH(String(height));
    } else if (!Number.isFinite(height) || height < 1) {
      setErr("Invalid height.");
      return;
    }
    try {
      setOut(loadToCanvas(img, { width, height, mime: "image/png", quality: 0.92 }));
      setErr("");
      trackNetworkEvent("tool_complete", { tool: slug, action: "resize" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Resize failed");
    }
  };

  return (
    <Panel>
      <ImagePicker onFile={onFile} error={error} preview={preview} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Field label="Width (px)">
          <input className="nx-input" value={w} onChange={(e) => setW(e.target.value)} />
        </Field>
        <Field label="Height (px)">
          <input className="nx-input" value={h} onChange={(e) => setH(e.target.value)} disabled={keep} />
        </Field>
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, fontSize: "0.9rem" }}>
        <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} />
        Keep aspect ratio
      </label>
      <Toolbar>
        <PrimaryBtn onClick={run} disabled={!img}>
          Resize
        </PrimaryBtn>
        <GhostBtn
          disabled={!out}
          onClick={() => {
            downloadDataUrl("resized.png", out);
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <ErrorMsg>{err}</ErrorMsg>
      {out ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={out} alt="Resized" style={{ maxWidth: "100%", marginTop: 12, borderRadius: 12 }} />
      ) : null}
    </Panel>
  );
}

export function ImageConverter({ slug }: { slug: string }) {
  const { preview, error, img, onFile } = useImageFile(slug);
  const [fmt, setFmt] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  const run = () => {
    if (!img) return;
    try {
      const data = loadToCanvas(img, { mime: fmt, quality: 0.92 });
      setOut(data);
      setErr("");
      trackNetworkEvent("tool_complete", { tool: slug, action: "convert", format: fmt });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Conversion failed (format may be unsupported).");
      setOut("");
    }
  };

  const ext = fmt === "image/png" ? "png" : fmt === "image/webp" ? "webp" : "jpg";

  return (
    <Panel>
      <ImagePicker onFile={onFile} error={error} preview={preview} />
      <Field label="Output format">
        <select className="nx-select" value={fmt} onChange={(e) => setFmt(e.target.value as typeof fmt)}>
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
        </select>
      </Field>
      <Toolbar>
        <PrimaryBtn onClick={run} disabled={!img}>
          Convert
        </PrimaryBtn>
        <GhostBtn
          disabled={!out}
          onClick={() => {
            downloadDataUrl(`converted.${ext}`, out);
            trackNetworkEvent("download", { tool: slug });
          }}
        >
          Download
        </GhostBtn>
      </Toolbar>
      <ErrorMsg>{err}</ErrorMsg>
      {out ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={out} alt="Converted" style={{ maxWidth: "100%", marginTop: 12, borderRadius: 12 }} />
      ) : null}
    </Panel>
  );
}

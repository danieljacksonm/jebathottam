import { readFile } from "fs/promises";
import path from "path";

export async function localImageSize(publicPath: string) {
  if (!publicPath.startsWith("/")) return null;
  const file = path.join(process.cwd(), "public", publicPath.replace(/^\/+/, ""));
  const buf = await readFile(file);
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      const size = buf.readUInt16BE(offset + 2);
      if (marker === 0xc0 || marker === 0xc2) {
        return {
          height: buf.readUInt16BE(offset + 5),
          width: buf.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + size;
    }
  }
  return null;
}

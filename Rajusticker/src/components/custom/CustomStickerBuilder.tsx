"use client";

import { useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { addToCart } from "@/lib/cart-store";
import { customStickerSchema } from "@/lib/validation";

const COLORS = [
  { id: "white", label: "White", hex: "#ffffff" },
  { id: "black", label: "Black", hex: "#111111" },
  { id: "red", label: "Racing Red", hex: "#e10600" },
  { id: "gold", label: "Chrome Gold", hex: "#d4af37" },
  { id: "blue", label: "Metallic Blue", hex: "#2f6fed" },
];

const SIZES = [
  { id: "small", label: "Small (15cm)", price: 299 },
  { id: "medium", label: "Medium (30cm)", price: 499 },
  { id: "large", label: "Large (50cm)", price: 799 },
] as const;

export function CustomStickerBuilder() {
  const [text, setText] = useState("DRIVE DIFFERENT");
  const [color, setColor] = useState("red");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const selectedColor = COLORS.find((c) => c.id === color) || COLORS[2];
  const selectedSize = SIZES.find((s) => s.id === size) || SIZES[1];
  const previewSize = size === "small" ? "1.4rem" : size === "large" ? "2.6rem" : "2rem";

  const lineTotal = useMemo(
    () => selectedSize.price * quantity,
    [selectedSize.price, quantity],
  );

  function onAdd() {
    setError("");
    setOk("");
    const parsed = customStickerSchema.safeParse({
      text,
      color,
      size,
      quantity,
      notes,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid custom sticker");
      return;
    }

    addToCart({
      productId: "custom-sticker",
      slug: "custom-stickers",
      name: `Custom Sticker: "${parsed.data.text}"`,
      image: "/products/gloss-white.jpg",
      price: selectedSize.price,
      sizeId: `${size}-${color}`,
      sizeLabel: `${selectedSize.label} · ${selectedColor.label}`,
      quantity: parsed.data.quantity,
    });

    // Persist notes into cart via event for checkout notes suggestion
    if (parsed.data.notes) {
      window.sessionStorage.setItem(
        "raj-custom-notes",
        `Custom sticker notes: ${parsed.data.notes}`,
      );
    }

    setOk("Custom sticker added to cart.");
    window.dispatchEvent(new CustomEvent("raj:open-cart"));
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="card-surface p-5 sm:p-6 space-y-4">
        <div>
          <label htmlFor="custom-text" className="text-sm text-[var(--text-muted)]">
            Sticker text
          </label>
          <input
            id="custom-text"
            className="input mt-1"
            value={text}
            maxLength={48}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <fieldset>
          <legend className="text-sm text-[var(--text-muted)] mb-2">Colour</legend>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                className={`px-3 py-2 text-xs border rounded-[var(--radius-sm)] ${
                  color === c.id ? "border-[var(--accent)]" : "border-[var(--border)]"
                }`}
                aria-pressed={color === c.id}
              >
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2 align-middle border border-white/20"
                  style={{ background: c.hex }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm text-[var(--text-muted)] mb-2">Size</legend>
          <div className="space-y-2">
            {SIZES.map((s) => (
              <label
                key={s.id}
                className={`flex justify-between items-center border rounded px-3 py-3 text-sm cursor-pointer ${
                  size === s.id ? "border-[var(--accent)] bg-[var(--accent-muted)]" : "border-[var(--border)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="custom-size"
                    checked={size === s.id}
                    onChange={() => setSize(s.id)}
                  />
                  {s.label}
                </span>
                <span className="price">₹{s.price}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="custom-qty" className="text-sm text-[var(--text-muted)]">
            Quantity
          </label>
          <input
            id="custom-qty"
            type="number"
            min={1}
            max={50}
            className="input mt-1 max-w-32"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
          />
        </div>

        <div>
          <label htmlFor="custom-notes" className="text-sm text-[var(--text-muted)]">
            Optional notes
          </label>
          <textarea
            id="custom-notes"
            className="textarea mt-1"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Font preference, placement, vehicle colour..."
          />
        </div>

        <p className="text-sm">
          Total: <span className="price">₹{lineTotal.toLocaleString("en-IN")}</span>
        </p>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
        {ok && <p className="text-sm text-[var(--success)]">{ok}</p>}

        <button type="button" className="btn btn-primary w-full" onClick={onAdd}>
          Create Your Sticker
        </button>
      </div>

      <div className="card-surface p-6 min-h-[320px] flex flex-col">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-subtle)] mb-4">
          Preview
        </p>
        <div className="flex-1 flex items-center justify-center bg-[var(--bg-muted)] rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] p-6">
          <p
            className="font-display text-center break-words max-w-full"
            style={{ color: selectedColor.hex, fontSize: previewSize, letterSpacing: "0.08em" }}
          >
            {text || "YOUR TEXT"}
          </p>
        </div>
        <p className="text-xs text-[var(--text-subtle)] mt-4">
          Preview is approximate. Final cut vinyl may vary slightly by font and material.
        </p>
      </div>
    </div>
  );
}

export default function CustomStickersPageClient() {
  return (
    <div className="container-x py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Custom Stickers" },
        ]}
      />
      <h1 className="section-title mb-2">Custom Stickers</h1>
      <p className="section-sub mb-8">
        Simple custom text vinyl. Choose colour, size, and quantity — then add to cart.
      </p>
      <CustomStickerBuilder />
    </div>
  );
}

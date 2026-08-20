import type { CatalogCategoryId } from "@/app/catalog/types";

/** Category-specific filter schema for UI (browser-safe — no Node fs). */
export function filtersForCategory(categoryId: CatalogCategoryId | string) {
  if (categoryId === "laptops") {
    return [
      { key: "brand", label: "Brand", type: "enum" as const },
      { key: "ram_gb", label: "Min RAM (GB)", type: "min" as const },
      { key: "storage_gb", label: "Min storage (GB)", type: "min" as const },
      { key: "display_inches", label: "Screen size", type: "enum" as const },
      { key: "refresh_hz", label: "Min refresh (Hz)", type: "min" as const },
      { key: "os", label: "OS", type: "enum" as const },
      { key: "price_max", label: "Max price", type: "price_max" as const },
    ];
  }
  if (categoryId === "ram") {
    return [
      { key: "capacity_gb", label: "Min capacity (GB)", type: "min" as const },
      { key: "ddr_gen", label: "DDR generation", type: "enum" as const },
      { key: "speed_mt", label: "Min speed", type: "min" as const },
      { key: "form_factor", label: "Form factor", type: "enum" as const },
      { key: "price_max", label: "Max price", type: "price_max" as const },
    ];
  }
  if (categoryId === "ssd") {
    return [
      { key: "capacity_gb", label: "Min capacity (GB)", type: "min" as const },
      { key: "interface", label: "Interface", type: "enum" as const },
      { key: "form_factor", label: "Form factor", type: "enum" as const },
      { key: "read_mbps", label: "Min read MB/s", type: "min" as const },
      { key: "price_max", label: "Max price", type: "price_max" as const },
    ];
  }
  if (categoryId === "monitors") {
    return [
      { key: "size_inches", label: "Size", type: "enum" as const },
      { key: "refresh_hz", label: "Min refresh", type: "min" as const },
      { key: "panel", label: "Panel", type: "enum" as const },
      { key: "price_max", label: "Max price", type: "price_max" as const },
    ];
  }
  if (categoryId === "gpu") {
    return [
      { key: "vram_gb", label: "Min VRAM", type: "min" as const },
      { key: "brand", label: "Brand", type: "enum" as const },
      { key: "price_max", label: "Max price", type: "price_max" as const },
    ];
  }
  return [
    { key: "brand", label: "Brand", type: "enum" as const },
    { key: "price_max", label: "Max price", type: "price_max" as const },
  ];
}

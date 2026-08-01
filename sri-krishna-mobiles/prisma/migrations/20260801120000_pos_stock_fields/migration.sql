-- Add POS / inventory fields to Product
ALTER TABLE "Product" ADD COLUMN "wholesalePrice" REAL;
ALTER TABLE "Product" ADD COLUMN "sku" TEXT;
ALTER TABLE "Product" ADD COLUMN "barcode" TEXT;
ALTER TABLE "Product" ADD COLUMN "stockQty" INTEGER NOT NULL DEFAULT 0;

-- Give existing in-stock products a starting quantity so POS can sell immediately
UPDATE "Product" SET "stockQty" = 50 WHERE "inStock" = 1 AND "stockQty" = 0;

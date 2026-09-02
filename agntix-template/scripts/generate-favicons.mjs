import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const source = "public/brand/canaan-logo.jpeg";
const outDir = "src/app";

await mkdir(outDir, { recursive: true });

const base = sharp(source).resize(512, 512, {
  fit: "cover",
  position: "centre",
});

await base.clone().resize(32, 32).png().toFile(path.join(outDir, "icon.png"));
await base
  .clone()
  .resize(180, 180)
  .png()
  .toFile(path.join(outDir, "apple-icon.png"));
await base
  .clone()
  .resize(48, 48)
  .toFormat("png")
  .toBuffer()
  .then((buf) =>
    sharp(buf).resize(32, 32).toFile(path.join(outDir, "favicon.ico")),
  );

console.log("Generated src/app/favicon.ico, icon.png, apple-icon.png");

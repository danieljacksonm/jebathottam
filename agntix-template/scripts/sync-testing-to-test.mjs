import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const src = "D:/Daniel/testing/agntix-template";
const dst = "D:/Daniel/test/agntix-template";

const paths = [
  "prisma",
  "scripts",
  "src",
  "public",
  "messages",
  "content",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "Dockerfile",
  "README.md",
  ".gitignore",
  ".env.example",
  "tsconfig.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
];

for (const rel of paths) {
  const from = join(src, rel);
  const to = join(dst, rel);
  if (!existsSync(from)) {
    console.log("skip missing", rel);
    continue;
  }
  mkdirSync(join(to, ".."), { recursive: true });
  cpSync(from, to, { recursive: true, force: true });
  console.log("copied", rel);
}

console.log("Done. Commit and push from D:/Daniel/test (jebathottam repo).");

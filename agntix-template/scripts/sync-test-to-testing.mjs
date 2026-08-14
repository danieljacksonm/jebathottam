import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const src = "D:/Daniel/test/agntix-template";
const dst = "D:/Daniel/testing/agntix-template";

const paths = [
  "content",
  "messages",
  "scripts",
  "src/app/[locale]",
  "src/components",
  "src/data",
  "src/lib",
  "src/i18n",
  "src/middleware.ts",
  "src/app/globals.css",
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/api",
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "Dockerfile",
  "README.md",
  ".gitignore",
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

console.log("done");

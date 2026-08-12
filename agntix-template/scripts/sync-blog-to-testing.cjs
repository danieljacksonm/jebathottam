const fs = require("fs");
const path = require("path");

const src = "D:/Daniel/test/agntix-template";
const dst = "D:/Daniel/testing/agntix-template";

function copy(rel) {
  const from = path.join(src, rel);
  const to = path.join(dst, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log("copied", rel);
}

copy("src/data/blog.ts");
copy("src/components/blog/BlogGrid.tsx");
copy("src/components/blog/BlogArticle.tsx");
copy("src/app/[locale]/blog/page.tsx");
copy("src/app/[locale]/blog/[slug]/page.tsx");
copy("messages/en.json");
copy("messages/ta.json");
copy("messages/hi.json");

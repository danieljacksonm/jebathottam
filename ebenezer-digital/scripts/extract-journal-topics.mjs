import fs from "fs";
import vm from "vm";

const src = fs.readFileSync("lib/edu-blog.ts", "utf8");
const start = src.indexOf("export const EDU_TOPICS");
const end = src.indexOf("export type EduPost");
if (start < 0 || end < 0) throw new Error("topics block not found");
let block = src.slice(start, end);
block = block.replace("export const EDU_TOPICS: EduTopic[] =", "var EDU_TOPICS =");
const IMG = new Proxy({}, { get: () => [] });
const sandbox = { IMG, EDU_TOPICS: [] };
const t = (
  key,
  titleBase,
  category,
  metaphor,
  what,
  steps,
  funFacts,
  whyItMatters
) => ({ key, titleBase, category, metaphor, what, steps, funFacts, whyItMatters });
sandbox.t = t;
vm.createContext(sandbox);
vm.runInContext(block + "\nthis.EDU_TOPICS = EDU_TOPICS;", sandbox);
const topics = sandbox.EDU_TOPICS.map((topic) => ({
  key: topic.key,
  titleBase: topic.titleBase,
  category: topic.category,
  metaphor: topic.metaphor,
  what: topic.what,
  steps: topic.steps,
  funFacts: topic.funFacts,
  why: topic.whyItMatters,
}));
fs.mkdirSync("data/i18n", { recursive: true });
fs.writeFileSync("data/i18n/journal-topics.en.json", JSON.stringify(topics));
console.log("topics", topics.length, "bytes", fs.statSync("data/i18n/journal-topics.en.json").size);

import fs from "fs";
import path from "path";

const dir = "data/i18n/page-ui";
const files = ["indic.json", "europe.json", "asia.json", "north.json", "rest.json"];
const required = [
  "we",
  "build",
  "digital",
  "experiences",
  "kicker",
  "metaTitle",
  "metaDescription",
  "sceneBuild",
  "sceneDigital",
  "sceneExperiences",
  "subtextSuffix",
  "ctaStart",
  "ctaWork",
  "ctaServices",
  "stats",
  "shell",
  "studio",
  "common",
  "portfolio",
  "contact",
  "sections",
  "chrome",
  "cards",
  "footer",
];
const shellKeys = [
  "home",
  "services",
  "journal",
  "news",
  "store",
  "tools",
  "network",
  "saas",
  "ai",
  "hardware",
  "discover",
  "info",
  "contact",
  "search",
  "subscribe",
  "readMore",
  "language",
];

const all = {};
const problems = [];
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  for (const [code, ui] of Object.entries(data)) {
    if (all[code]) problems.push(`duplicate ${code}`);
    all[code] = ui;
    for (const key of required) {
      if (ui[key] == null) problems.push(`${code} missing ${key}`);
    }
    if (ui.build === "BUILD" || ui.we === "WE") problems.push(`${code} headline still English`);
    if (/MYMEMORY|AVAILABLE FREE TRANSLATIONS/i.test(JSON.stringify(ui))) problems.push(`${code} corrupt`);
    for (const sk of shellKeys) {
      if (!ui.shell?.[sk]) problems.push(`${code} shell.${sk}`);
    }
    if (!Array.isArray(ui.stats) || ui.stats.length !== 4) problems.push(`${code} stats`);
    if (!Array.isArray(ui.cards) || ui.cards.length !== 3) problems.push(`${code} cards`);
    if (!ui.chrome?.searchJournal) problems.push(`${code} chrome`);
    if (!ui.contact?.stepWord) problems.push(`${code} stepWord`);
  }
}

const seo = [
  "en", "hi", "ta", "te", "ml", "kn", "bn", "mr", "gu", "pa", "ur",
  "es", "fr", "ar", "de", "pt", "ru", "ja", "ko", "zh", "tr", "id",
  "it", "nl", "pl", "vi", "th", "sv", "no", "da", "fi", "cs", "ro",
  "hu", "uk", "he", "fa", "ms", "sw",
  "el", "bg", "sr", "hr", "sk", "lt", "lv", "et", "ne", "sl", "af",
  "ca", "fil", "sq", "am", "km", "lo", "my", "ka", "kk", "uz", "az",
  "be", "eu", "gl", "is", "cy", "ga", "mk", "bs", "hy", "mn",
];
for (const code of seo) {
  if (code === "en" || code === "hi" || code === "ta") continue;
  if (!all[code]) problems.push(`seo missing ${code}`);
}

fs.writeFileSync("data/i18n/page-ui.json", JSON.stringify(all));
console.log("locales", Object.keys(all).length);
console.log("bytes", fs.statSync("data/i18n/page-ui.json").size);
console.log("es.build", all.es?.build, all.es?.ctaStart);
console.log("te.build", all.te?.build);
console.log("ja.we", all.ja?.we, all.ja?.build);
if (problems.length) {
  console.log(problems.slice(0, 40).join("\n"));
  process.exit(1);
}
console.log("ok");

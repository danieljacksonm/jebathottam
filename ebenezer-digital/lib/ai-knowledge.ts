import { readFileSync } from "fs";
import { join } from "path";

export function loadEbenKnowledge(): string {
  try {
    return readFileSync(join(process.cwd(), "data", "eben-knowledge.md"), "utf8").slice(
      0,
      4500
    );
  } catch {
    return `Eben AI helps Ebenezer Digital users on news, journal, store, and chat. Answer in simple English with a full, clear explanation.`;
  }
}

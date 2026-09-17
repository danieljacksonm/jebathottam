/**
 * Queue English content keys for translation (stores draft rows when DATABASE_URL set).
 * Usage: node scripts/translate-content.mjs journal what-is-dns ta,hi,te,ml
 *
 * Full AI translation requires ANTHROPIC_API_KEY and admin review before publish.
 */
console.log(`
Translate content pipeline
==========================
1. Export English source from JournalPost / LocalizedContent / CMS
2. Run quality-checked AI translation (admin only)
3. Set status=published in LocalizedContent after human review
4. Add locale to NEXT_PUBLIC_EBEN_I18N_PUBLISHED_LOCALES when ready

This script is a placeholder queue — implement batch translation in admin when API keys are configured.
`);

const [, , type, slug, localesArg] = process.argv;
if (!type || !slug) {
  console.error("Usage: node scripts/translate-content.mjs <type> <slug> [locales]");
  process.exit(1);
}
const locales = (localesArg || "ta,hi,te,ml").split(",").map((s) => s.trim());
console.log(`Queue: ${type}:${slug} → ${locales.join(", ")}`);

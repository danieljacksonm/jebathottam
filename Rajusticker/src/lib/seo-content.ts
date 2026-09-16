/**
 * AI SEO content architecture
 * --------------------------------
 * Ready for future AI-assisted generation of:
 * - product descriptions
 * - SEO titles / meta descriptions
 * - FAQs
 * - category descriptions
 * - blog outlines
 * - related product recommendations
 *
 * Rules:
 * - Never mass-generate thin pages automatically
 * - Human review required before publishing
 * - Prefer product-grounded facts from catalogue metadata
 */

export type SeoContentDraft = {
  entityType: "product" | "category" | "article" | "faq";
  entityId: string;
  seoTitle?: string;
  seoDescription?: string;
  description?: string;
  faq?: Array<{ question: string; answer: string }>;
  relatedIds?: string[];
  status: "draft" | "reviewed" | "published";
  source: "human" | "ai-assisted";
};

export async function generateSeoDraft(input: {
  entityType: SeoContentDraft["entityType"];
  entityId: string;
  brief: string;
}): Promise<SeoContentDraft> {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    return {
      entityType: input.entityType,
      entityId: input.entityId,
      status: "draft",
      source: "human",
      description:
        "AI provider not configured. Use catalogue facts and human-written copy. Connect AI_API_KEY to enable assisted drafts.",
    };
  }

  // Provider-ready hook — returns a draft envelope only.
  return {
    entityType: input.entityType,
    entityId: input.entityId,
    status: "draft",
    source: "ai-assisted",
    seoTitle: undefined,
    seoDescription: undefined,
    description: `AI-assisted draft placeholder for: ${input.brief}`,
  };
}

/**
 * Ebenezer Tools — Affiliate comparison data
 * Every tool link should be replaced with your actual affiliate URL once you
 * sign up for each programme. Placeholder links are used here.
 */

export type ToolCategory =
  | "Billing & Invoicing"
  | "WhatsApp & Messaging"
  | "Social Media"
  | "Design & Branding"
  | "Productivity"
  | "Email Marketing"
  | "Website Builders"
  | "Payments";

export type Tool = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  logo: string; // emoji fallback — replace with real logo path when available
  url: string; // your affiliate link
  affiliateNote?: string; // shown only in code, not on page
  pricing: {
    free: boolean;
    freeLabel?: string;
    paid?: string;
    paidLabel?: string;
  };
  rating: number; // out of 5
  bestFor: string;
  pros: string[];
  cons: string[];
  badge?: "Best Value" | "Most Popular" | "Editor's Pick" | "Free Forever" | "Best for India";
  highlighted?: boolean; // featured position
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Billing & Invoicing",
  "WhatsApp & Messaging",
  "Social Media",
  "Design & Branding",
  "Productivity",
  "Email Marketing",
  "Website Builders",
  "Payments",
];

export const TOOLS: Tool[] = [
  /* ── BILLING & INVOICING ─────────────────────────────── */
  {
    id: "ebenezer-saas",
    name: "Ebenezer SaaS",
    tagline: "Free cloud billing for shops — invoices, stock, and reports.",
    description:
      "Built specifically for small shop owners worldwide. Create invoices, track stock, manage customers, and print on any printer. No installation. Starts completely free.",
    category: "Billing & Invoicing",
    logo: "🟢",
    url: "/saas",
    pricing: { free: true, freeLabel: "Free forever (current plan)", paid: "Coming soon", paidLabel: "Paid starter plan launching soon" },
    rating: 5,
    bestFor: "Small shops, retail stores, traders in any country",
    pros: [
      "100% free to start — no credit card",
      "Works from any browser, any device",
      "Thermal, A4, and A5 printing included",
      "Stock + customer + expense tracking in one",
      "Made for non-tech shop owners",
    ],
    cons: ["Paid plan not yet live", "Best for small-to-medium shops"],
    badge: "Editor's Pick",
    highlighted: true,
  },
  {
    id: "zoho-invoice",
    name: "Zoho Invoice",
    tagline: "Professional invoicing for freelancers and small businesses.",
    description:
      "Zoho Invoice is a popular free invoicing tool with templates, automated reminders, and client portals. Part of the Zoho suite — integrates with Zoho CRM and Books.",
    category: "Billing & Invoicing",
    logo: "🔵",
    url: "https://www.zoho.com/invoice/",
    affiliateNote: "Sign up for Zoho partner program: https://www.zoho.com/partners/",
    pricing: { free: true, freeLabel: "Free for up to 1,000 invoices/year", paid: "$15/mo", paidLabel: "Zoho One suite" },
    rating: 4,
    bestFor: "Freelancers, consultants, service businesses",
    pros: ["Completely free tier is generous", "Professional templates", "Client portal included", "Good mobile app"],
    cons: ["Stock tracking only in paid plans", "Not ideal for retail shops", "Can be complex for beginners"],
    badge: "Free Forever",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    tagline: "Full accounting and invoicing for growing businesses.",
    description:
      "The world's most used small business accounting software. Powerful features including GST reports, payroll, and multi-currency. Better for businesses that need full accounting.",
    category: "Billing & Invoicing",
    logo: "🟩",
    url: "https://quickbooks.intuit.com/",
    affiliateNote: "Affiliate: https://quickbooks.intuit.com/partners/affiliates/ — up to $50 per referral",
    pricing: { free: false, paid: "$15–$100/mo", paidLabel: "30-day free trial available" },
    rating: 4,
    bestFor: "Established businesses needing full accounting and payroll",
    pros: ["Full accounting — not just invoicing", "GST, VAT, and tax reports", "Bank sync and reconciliation", "Large ecosystem of integrations"],
    cons: ["No free plan", "Expensive for small shops", "Steep learning curve", "Overkill for basic billing"],
  },
  {
    id: "wave",
    name: "Wave Accounting",
    tagline: "Free accounting and invoicing for small businesses.",
    description:
      "Wave is a free accounting, invoicing, and receipt scanning tool. Genuinely free with no hidden limits — makes money through payment processing fees.",
    category: "Billing & Invoicing",
    logo: "🌊",
    url: "https://www.waveapps.com/",
    affiliateNote: "Wave affiliate: https://www.waveapps.com/partners",
    pricing: { free: true, freeLabel: "Accounting and invoicing free forever", paid: "2.9% + 30¢", paidLabel: "Payment processing fee only" },
    rating: 4,
    bestFor: "Freelancers, sole traders, and home businesses in US/Canada/UK",
    pros: ["Completely free invoicing and accounting", "Receipt scanning app", "Financial reports included", "Bank connection for reconciliation"],
    cons: ["Payment processing only in US/Canada/UK/Australia", "No stock/inventory tracking", "Limited customer support on free plan"],
    badge: "Free Forever",
  },

  /* ── WHATSAPP & MESSAGING ────────────────────────────── */
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    tagline: "The free business app — professional profile, catalogue, and auto-replies.",
    description:
      "WhatsApp Business is the free app version for small businesses. Set up a professional profile, add a catalogue, and use auto-replies. Used by 200M+ businesses worldwide.",
    category: "WhatsApp & Messaging",
    logo: "💬",
    url: "https://business.whatsapp.com/",
    pricing: { free: true, freeLabel: "Completely free app" },
    rating: 5,
    bestFor: "Any small business communicating with customers on WhatsApp",
    pros: ["Free forever", "Catalogue + auto-replies + labels", "Business profile with hours and address", "2 billion users already on the platform"],
    cons: ["Limited to one phone number/device", "No API access (need WhatsApp Cloud API for that)", "Cannot send bulk messages beyond broadcast limits"],
    badge: "Free Forever",
    highlighted: true,
  },
  {
    id: "wati",
    name: "WATI",
    tagline: "WhatsApp Business API platform — bulk messaging and CRM.",
    description:
      "WATI gives you access to the official WhatsApp Business API — bulk messages, chatbots, shared team inbox, and CRM integration. Good for businesses that outgrow the free app.",
    category: "WhatsApp & Messaging",
    logo: "📲",
    url: "https://www.wati.io/",
    affiliateNote: "WATI affiliate: https://www.wati.io/partners/",
    pricing: { free: false, paid: "$49/mo", paidLabel: "14-day free trial" },
    rating: 4,
    bestFor: "Businesses sending 1,000+ messages/month needing a team inbox",
    pros: ["Official WhatsApp API — no ban risk", "Team shared inbox", "Chatbot builder", "CRM and e-commerce integrations"],
    cons: ["Expensive for small businesses", "Requires Facebook Business verification", "Per-message charges on top of plan"],
    badge: "Best Value",
  },

  /* ── SOCIAL MEDIA ────────────────────────────────────── */
  {
    id: "canva",
    name: "Canva",
    tagline: "Design anything — social posts, logos, flyers, and presentations.",
    description:
      "The world's most popular design tool for non-designers. Thousands of templates for social media, presentations, flyers, and more. The free plan is very generous.",
    category: "Design & Branding",
    logo: "🎨",
    url: "https://www.canva.com/",
    affiliateNote: "Canva affiliate: https://www.canva.com/affiliates/ — 25–80% commission on Pro",
    pricing: { free: true, freeLabel: "Free with thousands of templates", paid: "$13/mo", paidLabel: "Canva Pro — unlimited assets" },
    rating: 5,
    bestFor: "Small businesses, social media managers, anyone creating visual content",
    pros: ["Huge free template library", "Social media post sizes built in", "Brand kit in Pro", "Magic AI tools in Pro", "Works on phone and computer"],
    cons: ["Some premium elements locked to Pro", "Export options limited on free plan", "Collaboration requires Pro for teams"],
    badge: "Most Popular",
    highlighted: true,
  },
  {
    id: "buffer",
    name: "Buffer",
    tagline: "Schedule and publish social media posts in advance.",
    description:
      "Buffer lets you schedule posts to Instagram, Facebook, LinkedIn, and Twitter/X in advance. Saves time and keeps your social media consistent without being online all day.",
    category: "Social Media",
    logo: "📅",
    url: "https://buffer.com/",
    affiliateNote: "Buffer affiliate: https://buffer.com/affiliate-program",
    pricing: { free: true, freeLabel: "3 channels free", paid: "$6/mo per channel", paidLabel: "Buffer Essentials" },
    rating: 4,
    bestFor: "Business owners who want to schedule a week of posts in one sitting",
    pros: ["Simple and clean interface", "Free plan covers most small businesses", "Analytics on all plans", "Instagram, Facebook, LinkedIn, Twitter/X"],
    cons: ["Free plan limits to 10 scheduled posts per channel", "No AI caption writing (basic)", "No Pinterest or TikTok on free plan"],
  },
  {
    id: "later",
    name: "Later",
    tagline: "Visual Instagram scheduler — plan your grid before posting.",
    description:
      "Later is the best tool for visually planning your Instagram grid. See exactly how posts will look before they go live. Also supports Facebook, TikTok, and Pinterest.",
    category: "Social Media",
    logo: "🗓️",
    url: "https://later.com/",
    affiliateNote: "Later affiliate: https://later.com/affiliate-program/",
    pricing: { free: true, freeLabel: "1 social set, 30 posts/month free", paid: "$18/mo", paidLabel: "Later Starter" },
    rating: 4,
    bestFor: "Instagram-focused businesses and creators who care about their grid look",
    pros: ["Visual grid preview before posting", "Hashtag suggestions", "Linkinbio page included", "Best-time-to-post suggestions"],
    cons: ["Limited to Instagram focus", "Free plan has low posting limit", "Analytics only on paid plans"],
  },

  /* ── DESIGN & BRANDING ───────────────────────────────── */
  {
    id: "adobe-express",
    name: "Adobe Express",
    tagline: "Quick design tool from Adobe — social posts, logos, and flyers.",
    description:
      "Adobe Express (formerly Adobe Spark) is Adobe's beginner-friendly design tool. Less powerful than Canva Pro but integrates with Adobe Creative Cloud. Good if you already use Adobe tools.",
    category: "Design & Branding",
    logo: "🅰️",
    url: "https://www.adobe.com/express/",
    affiliateNote: "Adobe affiliate: https://www.adobe.com/affiliates.html — up to 85% first month commission",
    pricing: { free: true, freeLabel: "Free with limited templates", paid: "$9.99/mo", paidLabel: "Adobe Express Premium" },
    rating: 4,
    bestFor: "Businesses already using Adobe Creative Cloud",
    pros: ["Adobe fonts and stock photos included", "Connects to Photoshop and Illustrator", "PDF editing tools", "Premium feel and output"],
    cons: ["Fewer templates than Canva", "Free plan very limited", "Less intuitive for beginners"],
  },
  {
    id: "looka",
    name: "Looka",
    tagline: "AI logo maker — create a professional logo in minutes.",
    description:
      "Looka uses AI to generate logo options based on your industry, colors, and style preferences. Get a full brand kit including logo, business card, and social media templates.",
    category: "Design & Branding",
    logo: "✨",
    url: "https://looka.com/",
    affiliateNote: "Looka affiliate: https://looka.com/affiliates/ — 15–30% commission",
    pricing: { free: false, paid: "$20 one-time or $96/yr", paidLabel: "Logo package or Brand kit subscription" },
    rating: 4,
    bestFor: "New businesses that need a logo fast without a designer",
    pros: ["AI-generated options in minutes", "Brand kit includes all formats", "Social media templates included", "Very affordable vs hiring a designer"],
    cons: ["Not free — you pay to download high-res files", "AI logos can look similar to others", "Limited customisation vs a real designer"],
    badge: "Best Value",
  },

  /* ── PRODUCTIVITY ────────────────────────────────────── */
  {
    id: "notion",
    name: "Notion",
    tagline: "All-in-one workspace — notes, databases, tasks, and wikis.",
    description:
      "Notion replaces your notes, to-do lists, spreadsheets, and team wikis in one tool. Very popular with freelancers, startups, and small teams. Free plan is very capable.",
    category: "Productivity",
    logo: "📝",
    url: "https://www.notion.so/",
    affiliateNote: "Notion affiliate: https://www.notion.so/affiliates — 50% first-year commission",
    pricing: { free: true, freeLabel: "Free for individuals — unlimited pages", paid: "$10/mo per member", paidLabel: "Notion Plus" },
    rating: 5,
    bestFor: "Solo founders, freelancers, small teams managing projects and knowledge",
    pros: ["Free plan is excellent for individuals", "Databases, tables, and kanban boards", "AI writing assistant built in", "Templates for CRM, project management, notes"],
    cons: ["Can be overwhelming at first", "Mobile app is slower than desktop", "Collaboration requires paid plan for larger teams"],
    badge: "Editor's Pick",
    highlighted: true,
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    tagline: "Gmail, Drive, Docs, Sheets, and Meet — all for your business.",
    description:
      "Google Workspace gives your business professional email (yourname@yourbusiness.com), 30GB storage, Google Meet video calls, and all Google apps with your brand domain.",
    category: "Productivity",
    logo: "🔵",
    url: "https://workspace.google.com/",
    affiliateNote: "Google Workspace affiliate: https://workspace.google.com/partners/",
    pricing: { free: false, paid: "$6/mo per user", paidLabel: "Business Starter — 14-day free trial" },
    rating: 5,
    bestFor: "Any business that wants professional email with their domain name",
    pros: ["Professional business email — not @gmail.com", "30GB Drive storage per user", "Google Meet video calls", "Familiar Google tools everyone knows"],
    cons: ["No free plan — starts at $6/user/month", "Storage fills up for media-heavy businesses", "Need a domain name first"],
    badge: "Best for India",
  },
  {
    id: "loom",
    name: "Loom",
    tagline: "Record quick video messages instead of long emails or meetings.",
    description:
      "Loom lets you record your screen and camera simultaneously and share a link. Perfect for explaining things to clients, team members, or customers without a meeting.",
    category: "Productivity",
    logo: "🎥",
    url: "https://www.loom.com/",
    affiliateNote: "Loom affiliate: https://www.loom.com/affiliate-program",
    pricing: { free: true, freeLabel: "5-minute videos, 25 videos free", paid: "$12.50/mo", paidLabel: "Loom Business" },
    rating: 4,
    bestFor: "Consultants, agencies, and anyone who explains things visually to clients",
    pros: ["Share a link — no download needed", "Auto-generated transcript", "Comments on the video timeline", "Viewer analytics"],
    cons: ["Free plan limits video length and count", "Large file sizes for long recordings", "Not ideal for live streaming"],
  },

  /* ── EMAIL MARKETING ─────────────────────────────────── */
  {
    id: "mailchimp",
    name: "Mailchimp",
    tagline: "Email marketing and automation for small businesses.",
    description:
      "Mailchimp is the most popular email marketing tool worldwide. Send newsletters, automated sequences, and promotional emails to your customer list. Good free plan up to 500 contacts.",
    category: "Email Marketing",
    logo: "🐵",
    url: "https://mailchimp.com/",
    affiliateNote: "Mailchimp affiliate: https://mailchimp.com/referral-program/",
    pricing: { free: true, freeLabel: "500 contacts, 1,000 emails/month free", paid: "$13/mo", paidLabel: "Mailchimp Essentials" },
    rating: 4,
    bestFor: "Small businesses building an email list and sending regular newsletters",
    pros: ["Very generous free plan", "Easy drag-and-drop email builder", "Automation and welcome sequences", "Landing page builder included", "Detailed analytics"],
    cons: ["Gets expensive as list grows", "Free plan has Mailchimp branding", "Limited automation on free plan"],
    badge: "Most Popular",
  },
  {
    id: "brevo",
    name: "Brevo (Sendinblue)",
    tagline: "Email and SMS marketing — better value than Mailchimp for growing lists.",
    description:
      "Brevo charges based on emails sent, not contacts stored — making it much more affordable when your list grows. Also includes SMS, WhatsApp campaigns, and live chat.",
    category: "Email Marketing",
    logo: "📧",
    url: "https://www.brevo.com/",
    affiliateNote: "Brevo affiliate: https://www.brevo.com/partners/affiliates/",
    pricing: { free: true, freeLabel: "300 emails/day, unlimited contacts free", paid: "$9/mo", paidLabel: "Brevo Starter" },
    rating: 5,
    bestFor: "Growing businesses with large contact lists who want better pricing than Mailchimp",
    pros: ["Unlimited contact storage on free plan", "SMS + WhatsApp campaigns", "Better pricing model as you scale", "Live chat widget included"],
    cons: ["300 emails/day limit on free plan", "Less polished UI than Mailchimp", "Advanced automation only on higher plans"],
    badge: "Best Value",
    highlighted: true,
  },

  /* ── WEBSITE BUILDERS ────────────────────────────────── */
  {
    id: "framer",
    name: "Framer",
    tagline: "The fastest way to build a modern, professional website.",
    description:
      "Framer is the best tool for building fast, beautiful websites without code. Used by startups and creators worldwide. The free plan publishes a real website on a framer.site domain.",
    category: "Website Builders",
    logo: "🖥️",
    url: "https://www.framer.com/",
    affiliateNote: "Framer affiliate: https://www.framer.com/affiliates/",
    pricing: { free: true, freeLabel: "Publish on framer.site free", paid: "$14/mo", paidLabel: "Framer Mini — custom domain" },
    rating: 5,
    bestFor: "Creators, freelancers, and startups who want a stunning website fast",
    pros: ["Fastest page load of any website builder", "Beautiful design tools", "AI content and layout assistant", "CMS for blog or product pages", "Free plan publishes real website"],
    cons: ["Custom domain requires paid plan", "No e-commerce built in", "Less suitable for complex shops"],
    badge: "Editor's Pick",
    highlighted: true,
  },
  {
    id: "webflow",
    name: "Webflow",
    tagline: "Professional website builder with full design control.",
    description:
      "Webflow gives designers and developers full CSS-level control without writing code. Steeper learning curve than Framer but more powerful for complex layouts and CMS-driven sites.",
    category: "Website Builders",
    logo: "🌐",
    url: "https://webflow.com/",
    affiliateNote: "Webflow affiliate: https://webflow.com/partners/affiliate",
    pricing: { free: true, freeLabel: "2 projects free on webflow.io", paid: "$14/mo", paidLabel: "Webflow Basic — custom domain" },
    rating: 4,
    bestFor: "Designers and agencies building client websites professionally",
    pros: ["Full design control — pixel perfect", "Powerful CMS", "E-commerce built in", "No-code animations and interactions"],
    cons: ["Steeper learning curve", "Expensive for full features", "Not ideal for beginners"],
  },

  /* ── PAYMENTS ─────────────────────────────────────────── */
  {
    id: "razorpay",
    name: "Razorpay",
    tagline: "India's leading payment gateway — UPI, cards, net banking, and more.",
    description:
      "Razorpay is the best payment gateway for India-based businesses. Accept UPI, debit/credit cards, net banking, and EMI. Easy integration with websites and WhatsApp payment links.",
    category: "Payments",
    logo: "💳",
    url: "https://razorpay.com/",
    affiliateNote: "Razorpay affiliate: https://razorpay.com/partners/",
    pricing: { free: true, freeLabel: "No monthly fee — 2% per transaction", paid: "Custom", paidLabel: "Volume pricing available" },
    rating: 5,
    bestFor: "India-based businesses accepting digital payments from customers",
    pros: ["Accepts all Indian payment methods", "UPI payment links on WhatsApp", "Instant payout to bank account", "Payment pages without a website", "Good dashboard and analytics"],
    cons: ["2% transaction fee", "India-only — not for international payments", "KYC verification required before going live"],
    badge: "Best for India",
    highlighted: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    tagline: "The global payments platform — accept cards from any country.",
    description:
      "Stripe is the global standard for online payments. Accept credit/debit cards from 195 countries. Used by millions of businesses worldwide. Better for international or USD payments.",
    category: "Payments",
    logo: "🟣",
    url: "https://stripe.com/",
    affiliateNote: "Stripe affiliate: https://stripe.com/partners",
    pricing: { free: true, freeLabel: "No monthly fee — 2.9% + 30¢ per transaction", paid: "Custom", paidLabel: "Volume pricing" },
    rating: 5,
    bestFor: "Businesses selling internationally or in USD",
    pros: ["Accept payments from 195 countries", "Excellent developer tools", "Stripe Links — payment pages without a website", "Subscription billing built in"],
    cons: ["Higher fees than Razorpay for India", "Requires more technical setup", "Payout delays for new accounts"],
  },
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getHighlightedTools(): Tool[] {
  return TOOLS.filter((t) => t.highlighted);
}

export function getAllCategories(): ToolCategory[] {
  return TOOL_CATEGORIES;
}

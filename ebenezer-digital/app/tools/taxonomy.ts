/**
 * Premium tools directory taxonomy — AI / Business / Development / Design / Marketing
 * Existing SMB tools remain mapped into these groups.
 */

export type ToolGroupId = "ai" | "business" | "development" | "design" | "marketing";

export type ToolCategory =
  | "AI Writing"
  | "AI Coding"
  | "AI Image"
  | "AI Video"
  | "AI Audio"
  | "AI Presentation"
  | "AI Productivity"
  | "AI Marketing"
  | "AI Research"
  | "CRM"
  | "Accounting"
  | "Project Management"
  | "HR"
  | "Communication"
  | "Analytics"
  | "Marketing"
  | "Sales"
  | "IDEs"
  | "Hosting"
  | "Databases"
  | "APIs"
  | "Deployment"
  | "Testing"
  | "Monitoring"
  | "Security"
  | "UI/UX"
  | "Graphics"
  | "Video"
  | "Animation"
  | "Prototyping"
  | "SEO"
  | "Email Marketing"
  | "Social Media"
  | "Advertising"
  | "Billing & Invoicing"
  | "WhatsApp & Messaging"
  | "Design & Branding"
  | "Productivity"
  | "Website Builders"
  | "Payments";

export const TOOL_CATEGORY_GROUPS: {
  id: ToolGroupId;
  label: string;
  categories: ToolCategory[];
}[] = [
  {
    id: "ai",
    label: "AI",
    categories: [
      "AI Writing",
      "AI Coding",
      "AI Image",
      "AI Video",
      "AI Audio",
      "AI Presentation",
      "AI Productivity",
      "AI Marketing",
      "AI Research",
    ],
  },
  {
    id: "business",
    label: "Business",
    categories: [
      "CRM",
      "Accounting",
      "Billing & Invoicing",
      "Project Management",
      "HR",
      "Communication",
      "WhatsApp & Messaging",
      "Analytics",
      "Marketing",
      "Sales",
      "Payments",
      "Productivity",
    ],
  },
  {
    id: "development",
    label: "Development",
    categories: ["IDEs", "Hosting", "Databases", "APIs", "Deployment", "Testing", "Monitoring", "Security"],
  },
  {
    id: "design",
    label: "Design",
    categories: ["UI/UX", "Graphics", "Design & Branding", "Video", "Animation", "Prototyping", "Website Builders"],
  },
  {
    id: "marketing",
    label: "Marketing",
    categories: ["SEO", "Email Marketing", "Social Media", "Advertising", "Analytics"],
  },
];

export const TOOL_CATEGORIES: ToolCategory[] = TOOL_CATEGORY_GROUPS.flatMap((g) => g.categories).filter(
  (c, i, arr) => arr.indexOf(c) === i
);

export function groupForCategory(category: ToolCategory): ToolGroupId | undefined {
  return TOOL_CATEGORY_GROUPS.find((g) => g.categories.includes(category))?.id;
}

import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";
import { ProposalClient } from "./ProposalClient";

export const metadata: Metadata = pageMetadata({
  title: "Freelance Proposal Generator | Ebenezer Store",
  description: "Create a client project proposal and print or save as PDF. Free browser tool for freelancers.",
  path: "/tools/proposal-generator",
});

export default function ProposalGeneratorPage() {
  return <ProposalClient />;
}

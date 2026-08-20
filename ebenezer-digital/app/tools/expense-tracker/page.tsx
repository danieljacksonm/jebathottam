import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";
import { ExpenseTrackerClient } from "./ExpenseTrackerClient";

export const metadata: Metadata = pageMetadata({
  title: "Expense Tracker | Ebenezer Store",
  description: "Track shop expenses in your browser. Categories, totals, CSV export, and print report. Free.",
  path: "/tools/expense-tracker",
});

export default function ExpenseTrackerPage() {
  return <ExpenseTrackerClient />;
}

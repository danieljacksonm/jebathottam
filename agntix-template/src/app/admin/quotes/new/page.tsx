import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { QuoteEditor } from "@/components/admin/QuoteEditor";

export default async function NewQuotePage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return (
    <div>
      <h1>New quote</h1>
      <QuoteEditor
        initial={{
          customerName: "",
          email: "",
          phone: "",
          destination: "",
          packageSlug: "",
          travelStart: "",
          travelEnd: "",
          travellers: "",
          itinerary: "",
          currency: "INR",
          discountMinor: 0,
          paymentTerms: "",
          cancellationNotes: "",
          validityDate: "",
          notes: "",
          status: "DRAFT",
          items: [],
        }}
      />
    </div>
  );
}

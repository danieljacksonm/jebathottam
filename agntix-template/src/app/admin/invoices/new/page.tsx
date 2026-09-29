import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { companyProfile } from "@/lib/company";
import { InvoiceEditor } from "@/components/admin/InvoiceEditor";

export default async function NewInvoicePage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const company = companyProfile();
  return (
    <div>
      <h1>New invoice</h1>
      <InvoiceEditor
        paidMinor={0}
        balanceMinor={0}
        initial={{
          customerName: "",
          email: "",
          phone: "",
          customerAddress: "",
          destination: "",
          reference: "",
          invoiceDate: new Date().toISOString().slice(0, 10),
          dueDate: "",
          travelStart: "",
          travelEnd: "",
          currency: "INR",
          discountMinor: 0,
          companyGst: company.gst,
          paymentTerms: "",
          cancellationNotes: "",
          notes: "",
          status: "DRAFT",
          items: [],
        }}
      />
    </div>
  );
}

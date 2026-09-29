import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { EnquiryDesk } from "@/components/admin/EnquiryDesk";

export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { createdAt: "asc" } },
      quotes: true,
      customer: true,
    },
  });
  if (!enquiry) notFound();

  const facts = [
    ["Email", enquiry.email],
    ["Phone", enquiry.phone],
    ["WhatsApp", enquiry.whatsapp],
    ["Country", enquiry.country],
    ["Destination", enquiry.destination],
    ["Departure", enquiry.departureLocation],
    ["Package", enquiry.packageSlug],
    ["Service", enquiry.service],
    ["Travel type", enquiry.travelType],
    ["Dates", [enquiry.travelStartDate, enquiry.travelEndDate].filter(Boolean).join(" – ")],
    ["Flexible", enquiry.flexibleDates ? "Yes" : "No"],
    ["Travellers", `${enquiry.adults} adults, ${enquiry.children} children, ${enquiry.infants} infants`],
    ["Budget", enquiry.budgetRange],
    ["Hotel", enquiry.hotelPreference],
    ["Transport", enquiry.transportPreference],
    ["Source", enquiry.source],
    ["Page", enquiry.sourcePage],
    ["UTM", [enquiry.utmSource, enquiry.utmMedium, enquiry.utmCampaign].filter(Boolean).join(" / ")],
    ["Email delivery", enquiry.emailStatus],
    ["Follow-up", enquiry.nextFollowUp],
  ];

  return (
    <div>
      <p className="admin-muted">
        <Link href="/admin/enquiries">Enquiries</Link>
      </p>
      <h1>
        {enquiry.referenceNumber}{" "}
        <span className="admin-badge draft">{enquiry.status}</span>
      </h1>
      <div className="admin-card">
        <h2>{enquiry.customerName}</h2>
        {enquiry.customer ? (
          <p>
            <Link href={`/admin/customers/${enquiry.customer.id}`}>Customer history</Link>
          </p>
        ) : null}
        <p>{enquiry.message || "No message."}</p>
        {enquiry.specialRequirements ? (
          <p className="admin-muted">Special: {enquiry.specialRequirements}</p>
        ) : null}
        <dl className="admin-grid-2">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="admin-muted">{label}</dt>
              <dd>{value || "—"}</dd>
            </div>
          ))}
        </dl>
        {enquiry.quotes.length ? (
          <p>
            Quotes:{" "}
            {enquiry.quotes.map((quote) => (
              <Link key={quote.id} href={`/admin/quotes/${quote.id}`}>
                {quote.number}{" "}
              </Link>
            ))}
          </p>
        ) : null}
      </div>
      <EnquiryDesk
        id={enquiry.id}
        status={enquiry.status}
        priority={enquiry.priority}
        nextFollowUp={enquiry.nextFollowUp}
      />
      <section className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>Timeline</h2>
        <ul className="admin-timeline">
          {enquiry.activities.map((item) => (
            <li key={item.id}>
              <strong>{item.kind}</strong> · {item.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              <div>{item.body}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

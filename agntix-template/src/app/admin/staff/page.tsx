import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { StaffForm } from "@/components/admin/StaffForm";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "ADMIN") {
    return (
      <div className="admin-card">
        <h1>Staff</h1>
        <p>Only an admin can add staff accounts.</p>
      </div>
    );
  }
  const people = await prisma.staffAccount.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, role: true, active: true, createdAt: true },
  });

  return (
    <div>
      <h1>Staff</h1>
      <p className="admin-muted">
        The owner password still signs in as Admin. A staff password is separate. Editor can change content and enquiries. Finance can change enquiries, quotes, invoices, and customers. Marketing can change social posts and connections.
      </p>
      <StaffForm />
      <section className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>Accounts</h2>
        {people.length === 0 ? (
          <p>No staff accounts yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.role}</td>
                  <td>{person.active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

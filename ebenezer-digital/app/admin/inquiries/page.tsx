"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Mail,
  Trash2,
  MoreHorizontal,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
} from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
  status: "new" | "in-progress" | "replied" | "closed" | "spam";
  notes?: string;
  createdAt: string;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "in-progress", label: "In Progress" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  replied: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  spam: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    filterInquiries();
  }, [inquiries, searchQuery, statusFilter]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/admin/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterInquiries = () => {
    let filtered = [...inquiries];

    if (statusFilter !== "all") {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.email.toLowerCase().includes(query) ||
          i.message.toLowerCase().includes(query)
      );
    }

    setFilteredInquiries(filtered);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const updateNotes = async (id: string) => {
    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, notes } : i))
        );
      }
    } catch (error) {
      console.error("Failed to update notes:", error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const response = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) {
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Service", "Budget", "Message", "Status", "Created At"];
    const rows = filteredInquiries.map((i) => [
      i.name,
      i.email,
      i.phone || "",
      i.service,
      i.budget || "",
      i.message,
      i.status,
      new Date(i.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const openModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setNotes(inquiry.notes || "");
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inquiries</h1>
          <p className="text-slate-400 mt-1">
            Manage and respond to client inquiries
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                  Service
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No inquiries found
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{inquiry.name}</p>
                        <p className="text-sm text-slate-500">{inquiry.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 capitalize">
                        {inquiry.service}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                          statusColors[inquiry.status]
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(inquiry)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">
                Inquiry Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">Name</label>
                  <p className="text-white font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Email</label>
                  <p className="text-white">{selectedInquiry.email}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Service</label>
                  <p className="text-white capitalize">{selectedInquiry.service}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Budget</label>
                  <p className="text-white">{selectedInquiry.budget || "Not specified"}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-500">Message</label>
                <p className="mt-1 p-3 bg-slate-950 rounded-lg text-slate-300 text-sm">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Status Actions */}
              <div>
                <label className="text-sm text-slate-500 mb-2 block">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions
                    .filter((s) => s.value !== "all")
                    .map((status) => (
                      <button
                        key={status.value}
                        onClick={() => updateStatus(selectedInquiry.id, status.value)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                          selectedInquiry.status === status.value
                            ? statusColors[status.value]
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm text-slate-500 mb-2 block">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-brand-500"
                  placeholder="Add notes about this inquiry..."
                />
                <button
                  onClick={() => updateNotes(selectedInquiry.id)}
                  className="mt-2 px-4 py-2 bg-brand-500 text-slate-950 text-sm font-medium rounded-lg hover:bg-brand-400 transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/50">
              <a
                href={`mailto:${selectedInquiry.email}`}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
              <button
                onClick={() => deleteInquiry(selectedInquiry.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

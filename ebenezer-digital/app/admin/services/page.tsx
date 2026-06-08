"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  X,
  Check,
  ChevronDown,
  Globe,
  Database,
  Plane,
  FileText,
  Users,
  Code,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "digital" | "travel" | "web" | "other";
  features: string[];
  status: "published" | "draft";
  order: number;
  createdAt: string;
  updatedAt: string;
}

const iconOptions = [
  { value: "FileText", label: "File Text", icon: FileText },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Database", label: "Database", icon: Database },
  { value: "Plane", label: "Plane", icon: Plane },
  { value: "Users", label: "Users", icon: Users },
  { value: "Code", label: "Code", icon: Code },
];

const categoryOptions = [
  { value: "digital", label: "Digital & Admin" },
  { value: "travel", label: "Travel & Booking" },
  { value: "web", label: "Web & Technical" },
  { value: "other", label: "Other" },
];

const statusColors: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function getIconComponent(iconName: string) {
  const icon = iconOptions.find((i) => i.value === iconName);
  return icon?.icon || FileText;
}

export default function ServicesManagerPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "FileText",
    category: "digital" as const,
    features: [""] as string[],
    status: "draft" as const,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [services, searchQuery]);

  const fetchServices = async () => {
    try {
      // Mock API call - replace with actual API
      const mockServices: Service[] = [
        {
          id: "1",
          title: "Data Entry",
          description: "Accurate, timely data entry from forms, spreadsheets, or documents into your preferred format.",
          icon: "FileText",
          category: "digital",
          features: ["Fast turnaround", "99% accuracy", "Multiple formats", "Confidential"],
          status: "published",
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Web Development",
          description: "Custom websites built with modern technologies.",
          icon: "Globe",
          category: "web",
          features: ["Responsive design", "SEO optimized", "Fast loading", "Secure"],
          status: "published",
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Travel Booking",
          description: "End-to-end travel assistance for business and personal trips.",
          icon: "Plane",
          category: "travel",
          features: ["Flight booking", "Hotel reservations", "Itinerary planning", "24/7 support"],
          status: "published",
          order: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setServices(mockServices.sort((a, b) => a.order - b.order));
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      // Update existing
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, ...formData, updatedAt: new Date().toISOString() }
            : s
        )
      );
    } else {
      // Create new
      const newService: Service = {
        id: Date.now().toString(),
        ...formData,
        features: formData.features.filter(Boolean),
        order: services.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setServices((prev) => [...prev, newService]);
    }

    closeModal();
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "published" ? "draft" : "published" }
          : s
      )
    );
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      category: service.category,
      features: service.features.length > 0 ? service.features : [""],
      status: service.status,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      icon: "FileText",
      category: "digital",
      features: [""],
      status: "draft",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleReorder = async (newOrder: Service[]) => {
    const updated = newOrder.map((s, index) => ({ ...s, order: index + 1 }));
    setServices(updated);
  };

  const saveOrder = async () => {
    setIsReordering(false);
    // API call to save order would go here
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Services Manager</h1>
          <p className="text-slate-400 mt-1">Manage your service offerings</p>
        </div>
        <div className="flex items-center gap-3">
          {isReordering ? (
            <>
              <button
                onClick={() => setIsReordering(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveOrder}
                className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-slate-950 font-medium rounded-lg hover:bg-brand-400 transition-colors"
              >
                <Check className="w-4 h-4" />
                Save Order
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsReordering(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              <GripVertical className="w-4 h-4" />
              Reorder
            </button>
          )}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-slate-950 font-medium rounded-lg hover:bg-brand-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Services List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {isReordering ? (
          <Reorder.Group
            axis="y"
            values={filteredServices}
            onReorder={handleReorder}
            className="divide-y divide-slate-800"
          >
            {filteredServices.map((service) => (
              <Reorder.Item key={service.id} value={service}>
                <div className="flex items-center gap-4 p-4 bg-slate-900 cursor-move">
                  <GripVertical className="w-5 h-5 text-slate-500" />
                  {(() => {
                    const IconComponent = getIconComponent(service.icon);
                    return <IconComponent className="w-5 h-5 text-brand-400" />;
                  })()}
                  <span className="font-medium text-white">{service.title}</span>
                  <span className="ml-auto text-sm text-slate-500">
                    {categoryOptions.find((c) => c.value === service.category)?.label}
                  </span>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredServices.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500">
                No services found
              </div>
            ) : (
              filteredServices.map((service) => {
                const IconComponent = getIconComponent(service.icon);
                return (
                  <div
                    key={service.id}
                    className="flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10">
                      <IconComponent className="w-5 h-5 text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white truncate">
                          {service.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                            statusColors[service.status]
                          }`}
                        >
                          {service.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 truncate mt-0.5">
                        {categoryOptions.find((c) => c.value === service.category)?.label} •{" "}
                        {service.features.length} features
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStatus(service.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title={service.status === "published" ? "Unpublish" : "Publish"}
                      >
                        {service.status === "published" ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(service)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                <h2 className="text-lg font-semibold text-white">
                  {editingService ? "Edit Service" : "Add Service"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="Service title"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="Service description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, icon: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                    >
                      {iconOptions.map((icon) => {
                        const IconComponent = icon.icon;
                        return (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value as typeof formData.category,
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Features
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                          placeholder={`Feature ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="mt-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <div className="flex gap-3">
                    {["draft", "published"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            status: status as "draft" | "published",
                          }))
                        }
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          formData.status === status
                            ? statusColors[status]
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-brand-500 text-slate-950 font-medium rounded-lg hover:bg-brand-400 transition-colors"
                  >
                    {editingService ? "Save Changes" : "Create Service"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

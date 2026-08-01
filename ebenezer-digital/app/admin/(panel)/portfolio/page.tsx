"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  X,
  Check,
  Image as ImageIcon,
  Link as LinkIcon,
  GripVertical,
  Upload,
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  category: string[];
  description: string;
  challenge?: string;
  solution?: string;
  result?: string;
  coverImage: string;
  galleryImages: string[];
  techStack: string[];
  liveUrl?: string;
  status: "published" | "draft";
  order: number;
  createdAt: string;
  updatedAt: string;
}

const categoryOptions = ["Web Development", "Data Entry", "Travel Booking", "Design", "E-commerce"];

const statusColors: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function PortfolioManagerPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    category: [] as string[],
    description: "",
    challenge: "",
    solution: "",
    result: "",
    coverImage: "",
    galleryImages: [] as string[],
    techStack: [] as string[],
    liveUrl: "",
    status: "draft" as "draft" | "published",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const filtered = items.filter(
      (i) =>
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [items, searchQuery]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      const list = (data.portfolio || []).map((p: PortfolioItem & { createdAt: string | Date; updatedAt: string | Date }) => ({
        ...p,
        createdAt: typeof p.createdAt === "string" ? p.createdAt : new Date(p.createdAt).toISOString(),
        updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : new Date(p.updatedAt).toISOString(),
      }));
      setItems(list.sort((a: PortfolioItem, b: PortfolioItem) => a.order - b.order));
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await fetch("/api/admin/portfolio", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...formData }),
        });
      } else {
        await fetch("/api/admin/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      await fetchItems();
      closeModal();
    } catch (error) {
      console.error("Save portfolio failed:", error);
      alert("Failed to save portfolio item");
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await fetch(`/api/admin/portfolio?id=${id}`, { method: "DELETE" });
    await fetchItems();
  };

  const toggleStatus = async (id: string) => {
    const current = items.find((i) => i.id === id);
    if (!current) return;
    const next = current.status === "published" ? "draft" : "published";
    await fetch("/api/admin/portfolio", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    await fetchItems();
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      clientName: item.clientName,
      category: item.category,
      description: item.description,
      challenge: item.challenge || "",
      solution: item.solution || "",
      result: item.result || "",
      coverImage: item.coverImage,
      galleryImages: item.galleryImages,
      techStack: item.techStack,
      liveUrl: item.liveUrl || "",
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      clientName: "",
      category: [],
      description: "",
      challenge: "",
      solution: "",
      result: "",
      coverImage: "",
      galleryImages: [],
      techStack: [],
      liveUrl: "",
      status: "draft",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }));
  };

  const addTech = () => {
    setFormData((prev) => ({ ...prev, techStack: [...prev.techStack, ""] }));
  };

  const updateTech = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.map((t, i) => (i === index ? value : t)),
    }));
  };

  const removeTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload - in production, upload to Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
          <h1 className="text-2xl font-bold text-white">Portfolio Manager</h1>
          <p className="text-slate-400 mt-1">Manage your portfolio items</p>
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
                onClick={() => setIsReordering(false)}
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
            Add Item
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search portfolio items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Items Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
            No portfolio items found
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-brand-500/30 transition-all"
            >
              {/* Cover Image */}
              <div className="relative aspect-video bg-slate-800">
                {item.coverImage ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-slate-600" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-slate-600" />
                  </div>
                )}
                {/* Status Badge */}
                <span
                  className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full border ${
                    statusColors[item.status]
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-medium text-white truncate">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.clientName}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.category.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                  {item.category.length > 2 && (
                    <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded">
                      +{item.category.length - 2}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title={item.status === "published" ? "Unpublish" : "Publish"}
                  >
                    {item.status === "published" ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
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
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                <h2 className="text-lg font-semibold text-white">
                  {editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
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
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="E.g., E-Commerce Platform"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientName: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="Client or company name"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          formData.category.includes(cat)
                            ? "bg-brand-500/10 text-brand-400 border-brand-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-24 bg-slate-950 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center">
                      {formData.coverImage ? (
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                          <Check className="w-6 h-6 text-emerald-400" />
                        </div>
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-slate-500 mt-2">
                        Recommended: 1200x800px, max 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
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
                    placeholder="Brief description of the project"
                  />
                </div>

                {/* Challenge, Solution, Result */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Challenge
                    </label>
                    <textarea
                      value={formData.challenge}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          challenge: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="What was the challenge?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Solution
                    </label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          solution: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="How did you solve it?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Result
                    </label>
                    <textarea
                      value={formData.result}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          result: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="What was the outcome?"
                    />
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.techStack.map((tech, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-lg"
                      >
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => updateTech(index, e.target.value)}
                          className="bg-transparent text-sm text-white focus:outline-none w-20"
                          placeholder="Tech"
                        />
                        <button
                          type="button"
                          onClick={() => removeTech(index)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addTech}
                    className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    + Add Technology
                  </button>
                </div>

                {/* Live URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Live URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          liveUrl: e.target.value,
                        }))
                      }
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="https://example.com"
                    />
                  </div>
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
                    {editingItem ? "Save Changes" : "Create Item"}
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

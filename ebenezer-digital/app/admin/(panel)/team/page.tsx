"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LinkedinIcon = () => (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>);
const GithubIcon = () => (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>);
const TwitterXIcon = () => (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>);
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Check,
  Mail,
  Upload,
  Image as ImageIcon,
  GripVertical,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  order: number;
  createdAt: string;
}

export default function TeamManagerPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    photo: "",
    email: "",
    twitter: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const filtered = members.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [members, searchQuery]);

  const fetchMembers = async () => {
    try {
      const mockMembers: TeamMember[] = [
        {
          id: "1",
          name: "John Smith",
          role: "Founder & CEO",
          bio: "Leading digital transformation for businesses worldwide.",
          email: "john@ebenezar.com",
          socialLinks: {
            linkedin: "https://linkedin.com/in/johnsmith",
            twitter: "https://twitter.com/johnsmith",
          },
          order: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Sarah Johnson",
          role: "Lead Developer",
          bio: "Full-stack developer with 8+ years of experience.",
          email: "sarah@ebenezar.com",
          socialLinks: {
            linkedin: "https://linkedin.com/in/sarahjohnson",
            github: "https://github.com/sarahj",
          },
          order: 2,
          createdAt: new Date().toISOString(),
        },
      ];
      setMembers(mockMembers.sort((a, b) => a.order - b.order));
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const memberData = {
      ...formData,
      socialLinks: {
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        github: formData.github,
      },
    };

    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? { ...m, ...memberData, updatedAt: new Date().toISOString() }
            : m
        )
      );
    } else {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        ...memberData,
        order: members.length + 1,
        createdAt: new Date().toISOString(),
      };
      setMembers((prev) => [...prev, newMember]);
    }

    closeModal();
  };

  const deleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || "",
      photo: member.photo || "",
      email: member.email || "",
      twitter: member.socialLinks?.twitter || "",
      linkedin: member.socialLinks?.linkedin || "",
      github: member.socialLinks?.github || "",
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      bio: "",
      photo: "",
      email: "",
      twitter: "",
      linkedin: "",
      github: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
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
          <h1 className="text-2xl font-bold text-white">Team Manager</h1>
          <p className="text-slate-400 mt-1">Manage team members and their profiles</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-slate-950 font-medium rounded-lg hover:bg-brand-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Team Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
            No team members found
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-brand-500/30 transition-all"
            >
              {/* Photo */}
              <div className="relative h-48 bg-slate-800">
                {member.photo ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-brand-400">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{member.bio}</p>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-2 mt-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {member.socialLinks?.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <LinkedinIcon />
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a
                      href={member.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <TwitterXIcon />
                    </a>
                  )}
                  {member.socialLinks?.github && (
                    <a
                      href={member.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <GithubIcon />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteMember(member.id)}
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
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900">
                <h2 className="text-lg font-semibold text-white">
                  {editingMember ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      {formData.photo ? (
                        <Check className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <span className="text-2xl font-bold text-slate-500">
                          {formData.name
                            ? formData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "?"}
                        </span>
                      )}
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, role: e.target.value }))
                      }
                      required
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="E.g., CEO, Developer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                    placeholder="Short biography..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Social Links
                  </label>

                  <div className="relative">
                    <LinkedinIcon />
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
                      }
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="LinkedIn URL"
                    />
                  </div>

                  <div className="relative">
                    <TwitterXIcon />
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, twitter: e.target.value }))
                      }
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="Twitter URL"
                    />
                  </div>

                  <div className="relative">
                    <GithubIcon />
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, github: e.target.value }))
                      }
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                      placeholder="GitHub URL"
                    />
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
                    {editingMember ? "Save Changes" : "Add Member"}
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

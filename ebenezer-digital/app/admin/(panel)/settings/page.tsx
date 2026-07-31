"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Check,
  AlertCircle,
  RefreshCw,
  Shield,
  Key,
} from "lucide-react";

const TwitterXIcon = () => (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>);
const LinkedinIcon = () => (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>);
const GithubIcon = () => (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>);
const InstagramIcon = () => (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>);

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
    instagram: string;
  };
  smtpSettings: {
    host: string;
    port: string;
    user: string;
    pass: string;
    from: string;
  };
}

const initialSettings: Settings = {
  siteName: "Ebenezer Digital Services",
  siteDescription: "Reliable digital work for businesses everywhere.",
  contactEmail: "contact@ebenezar.com",
  contactPhone: "+1 (555) 123-4567",
  address: "Remote / Worldwide",
  socialLinks: {
    twitter: "https://twitter.com/ebenezar",
    linkedin: "https://linkedin.com/company/ebenezar",
    github: "https://github.com/ebenezar",
    instagram: "",
  },
  smtpSettings: {
    host: "",
    port: "587",
    user: "",
    pass: "",
    from: "",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"general" | "social" | "email">("general");

  const handleChange = (section: keyof Settings | "", field: string, value: string) => {
    if (section === "") {
      setSettings((prev) => ({ ...prev, [field]: value }));
    } else if (section === "socialLinks" || section === "smtpSettings") {
      setSettings((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSaveStatus("success");
    setIsSaving(false);

    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const handleTestEmail = async () => {
    alert("Test email would be sent to " + settings.contactEmail);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 mt-1">Manage your website configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-slate-950 font-medium rounded-lg hover:bg-brand-400 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : saveStatus === "success" ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : saveStatus === "success" ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Status Message */}
      {saveStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400"
        >
          <Check className="w-5 h-5" />
          Settings saved successfully!
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 w-fit">
        {[
          { id: "general", label: "General", icon: Globe },
          { id: "social", label: "Social Links", icon: TwitterXIcon },
          { id: "email", label: "Email Settings", icon: Mail },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        {activeTab === "general" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Site Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleChange("", "siteName", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleChange("", "siteDescription", e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange("", "contactEmail", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      Phone Number
                    </div>
                  </label>
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => handleChange("", "contactPhone", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      Address
                    </div>
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => handleChange("", "address", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4">Social Media Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <TwitterXIcon />
                    Twitter / X
                  </div>
                </label>
                <input
                  type="url"
                  value={settings.socialLinks.twitter}
                  onChange={(e) => handleChange("socialLinks", "twitter", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <LinkedinIcon />
                    LinkedIn
                  </div>
                </label>
                <input
                  type="url"
                  value={settings.socialLinks.linkedin}
                  onChange={(e) => handleChange("socialLinks", "linkedin", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <GithubIcon />
                    GitHub
                  </div>
                </label>
                <input
                  type="url"
                  value={settings.socialLinks.github}
                  onChange={(e) => handleChange("socialLinks", "github", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="https://github.com/yourorg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <div className="flex items-center gap-2">
                    <InstagramIcon />
                    Instagram
                  </div>
                </label>
                <input
                  type="url"
                  value={settings.socialLinks.instagram}
                  onChange={(e) => handleChange("socialLinks", "instagram", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "email" && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium">Email Configuration</p>
                <p className="text-amber-400/80 text-sm mt-1">
                  Configure SMTP settings to enable email notifications for inquiries and contact form submissions.
                </p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">SMTP Settings</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.smtpSettings.host}
                  onChange={(e) => handleChange("smtpSettings", "host", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Port
                </label>
                <input
                  type="text"
                  value={settings.smtpSettings.port}
                  onChange={(e) => handleChange("smtpSettings", "port", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="587"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={settings.smtpSettings.user}
                  onChange={(e) => handleChange("smtpSettings", "user", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={settings.smtpSettings.pass}
                    onChange={(e) => handleChange("smtpSettings", "pass", e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  From Email
                </label>
                <input
                  type="email"
                  value={settings.smtpSettings.from}
                  onChange={(e) => handleChange("smtpSettings", "from", e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="noreply@yourdomain.com"
                />
              </div>
            </div>

            <button
              onClick={handleTestEmail}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Send Test Email
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all caches?")) {
                alert("Cache cleared!");
              }
            }}
            className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Clear Cache
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to reset all settings to defaults?")) {
                setSettings(initialSettings);
                alert("Settings reset!");
              }
            }}
            className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

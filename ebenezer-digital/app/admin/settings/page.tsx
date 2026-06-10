"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  TwitterX,
  Linkedin,
  Github,
  Instagram,
  Check,
  AlertCircle,
  RefreshCw,
  Shield,
  Key,
} from "lucide-react";

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
          { id: "social", label: "Social Links", icon: TwitterX },
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
                    <TwitterX className="w-4 h-4 text-sky-400" />
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
                    <Linkedin className="w-4 h-4 text-blue-400" />
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
                    <Github className="w-4 h-4 text-white" />
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
                    <Instagram className="w-4 h-4 text-pink-400" />
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

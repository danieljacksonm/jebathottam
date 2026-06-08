"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Camera, Mail, Phone, Calendar, Package, Heart, CreditCard } from "lucide-react";

// Mock user data
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  avatar: null,
  joinDate: "January 2024",
  stats: {
    orders: 12,
    wishlist: 8,
    addresses: 3,
    reviews: 5,
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(mockUser);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Package className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{user.stats.orders}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Total Orders</p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--error)]/10">
              <Heart className="h-5 w-5 text-[var(--error)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{user.stats.wishlist}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Wishlist Items</p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/10">
              <CreditCard className="h-5 w-5 text-[var(--success)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{user.stats.addresses}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Saved Addresses</p>
            </div>
          </div>
        </Card>
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/10">
              <Calendar className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--foreground)]">{user.joinDate}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Member Since</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Card */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Personal Information
          </h2>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        {/* Avatar Section */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primary)]/10 text-3xl font-bold text-[var(--primary)]">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                `${user.firstName[0]}${user.lastName[0]}`
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-[var(--foreground-muted)]">{user.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              First Name
            </label>
            <Input
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              Last Name
            </label>
            <Input
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              <Mail className="mr-1 inline h-4 w-4" />
              Email Address
            </label>
            <Input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
              <Phone className="mr-1 inline h-4 w-4" />
              Phone Number
            </label>
            <Input
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="mb-4 text-xl font-semibold text-[var(--foreground)]">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            { action: "Placed an order", item: "iPhone 14 Pro Max Display", date: "2 days ago" },
            { action: "Added to wishlist", item: "Samsung S23 Ultra Battery", date: "1 week ago" },
            { action: "Updated address", item: "Added new shipping address", date: "2 weeks ago" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-[var(--foreground)]">{activity.action}</p>
                <p className="text-sm text-[var(--foreground-muted)]">{activity.item}</p>
              </div>
              <span className="text-sm text-[var(--foreground-muted)]">{activity.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

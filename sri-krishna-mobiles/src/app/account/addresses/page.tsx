"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Home,
  Building2,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Mock addresses
const mockAddresses: Address[] = [
  {
    id: "addr-1",
    type: "home",
    name: "John Doe",
    phone: "+91 98765 43210",
    address: "123, Park Street, Near City Mall",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    isDefault: true,
  },
  {
    id: "addr-2",
    type: "work",
    name: "John Doe",
    phone: "+91 98765 43210",
    address: "456, Business Tower, Tech Park",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400051",
    isDefault: false,
  },
  {
    id: "addr-3",
    type: "other",
    name: "Jane Doe",
    phone: "+91 87654 32109",
    address: "789, Residential Complex, Sector 12",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    isDefault: false,
  },
];

const addressTypeConfig = {
  home: { icon: Home, label: "Home", color: "text-[var(--primary)]", bgColor: "bg-[var(--primary)]/10" },
  work: { icon: Building2, label: "Work", color: "text-[var(--accent)]", bgColor: "bg-[var(--accent)]/10" },
  other: { icon: MapPin, label: "Other", color: "text-[var(--foreground-muted)]", bgColor: "bg-[var(--background-secondary)]" },
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    type: "home",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      type: "home",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setIsAdding(false);
    setFormData(address);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId ? { ...formData, id: editingId } as Address : addr
        )
      );
      setEditingId(null);
    } else {
      const newAddress: Address = {
        ...formData as Address,
        id: `addr-${Date.now()}`,
      };
      setAddresses((prev) => [...prev, newAddress]);
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      type: "home",
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Saved Addresses
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            Manage your shipping addresses
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="border-[var(--border)] bg-[var(--card)] p-6">
          <h3 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                Address Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as Address["type"] })
                }
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                Phone Number
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                Street Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123, Main Street, Near Landmark"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                City
              </label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                State
              </label>
              <Input
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Maharashtra"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                Pincode
              </label>
              <Input
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="400001"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              <label htmlFor="isDefault" className="text-sm text-[var(--foreground)]">
                Set as default address
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              Save Address
            </Button>
          </div>
        </Card>
      )}

      {/* Addresses Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => {
          const typeConfig = addressTypeConfig[address.type];
          const TypeIcon = typeConfig.icon;

          return (
            <Card
              key={address.id}
              className={cn(
                "relative border-[var(--border)] bg-[var(--card)] p-6 transition-all",
                address.isDefault && "ring-2 ring-[var(--primary)]"
              )}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className="absolute -top-3 left-4 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white">
                  Default
                </div>
              )}

              {/* Address Type */}
              <div className="mb-4 flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    typeConfig.bgColor
                  )}
                >
                  <TypeIcon className={cn("h-4 w-4", typeConfig.color)} />
                </div>
                <span className={cn("text-sm font-medium", typeConfig.color)}>
                  {typeConfig.label}
                </span>
              </div>

              {/* Address Details */}
              <div className="space-y-1">
                <p className="font-semibold text-[var(--foreground)]">{address.name}</p>
                <p className="text-sm text-[var(--foreground-muted)]">{address.phone}</p>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  {address.address}
                </p>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  {address.city}, {address.state} - {address.pincode}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(address)}
                  className="gap-1"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="gap-1 text-[var(--error)] hover:bg-[var(--error)]/10"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="ml-auto"
                  >
                    Set Default
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && !isAdding && (
        <Card className="border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <MapPin className="mx-auto mb-4 h-12 w-12 text-[var(--foreground-muted)]" />
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            No saved addresses
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Add an address to make checkout faster
          </p>
          <Button onClick={handleAddNew} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        </Card>
      )}
    </div>
  );
}

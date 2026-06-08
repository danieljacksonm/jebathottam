"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Search, Smartphone, HelpCircle } from "lucide-react";

interface CompatibilityCheckerProps {
  productName: string;
  compatibility: string[];
}

const popularModels = [
  "iPhone 14 Pro Max",
  "iPhone 14 Pro",
  "iPhone 14 Plus",
  "iPhone 14",
  "Galaxy S23 Ultra",
  "Galaxy S23+",
  "Galaxy S23",
  "Pixel 7 Pro",
];

export function CompatibilityChecker({
  productName,
  compatibility,
}: CompatibilityCheckerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkResult, setCheckResult] = useState<"compatible" | "incompatible" | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = () => {
    if (!searchQuery.trim()) return;
    
    setIsChecking(true);
    
    // Simulate API check
    setTimeout(() => {
      const isCompatible = compatibility.some(
        (item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase()) ||
          searchQuery.toLowerCase().includes(item.toLowerCase())
      );
      setCheckResult(isCompatible ? "compatible" : "incompatible");
      setIsChecking(false);
    }, 800);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
          <Smartphone className="h-6 w-6 text-[var(--primary)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Check Compatibility
          </h3>
          <p className="text-sm text-[var(--foreground-muted)]">
            Enter your phone model to verify this part fits
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <Input
            type="text"
            placeholder="e.g., iPhone 14 Pro Max"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCheckResult(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />
        </div>
        <Button onClick={handleCheck} disabled={!searchQuery.trim() || isChecking}>
          {isChecking ? "Checking..." : "Check"}
        </Button>
      </div>

      {/* Result */}
      {checkResult && (
        <div
          className={`mt-4 flex items-center gap-3 rounded-xl p-4 ${
            checkResult === "compatible"
              ? "bg-[var(--success)]/10"
              : "bg-[var(--error)]/10"
          }`}
        >
          {checkResult === "compatible" ? (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--success)]/20">
                <Check className="h-5 w-5 text-[var(--success)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--success)]">
                  Compatible!
                </p>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  This part is compatible with {searchQuery}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--error)]/20">
                <X className="h-5 w-5 text-[var(--error)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--error)]">
                  Not Compatible
                </p>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  This part may not fit {searchQuery}. Please verify your model.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Popular Models */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
          Popular Models:
        </p>
        <div className="flex flex-wrap gap-2">
          {popularModels.map((model) => (
            <button
              key={model}
              onClick={() => {
                setSearchQuery(model);
                setCheckResult(null);
              }}
              className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground-secondary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* Supported Models */}
      <div className="mt-6 border-t border-[var(--border)] pt-6">
        <p className="mb-3 text-sm font-medium text-[var(--foreground)]">
          Officially Compatible With:
        </p>
        <ul className="space-y-2">
          {compatibility.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]"
            >
              <Check className="h-4 w-4 text-[var(--success)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Help Link */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        <HelpCircle className="h-4 w-4 text-[var(--primary)]" />
        <span className="text-[var(--foreground-muted)]">
          Not sure about your model?{" "}
          <button className="text-[var(--primary)] hover:underline">
            Contact Support
          </button>
        </span>
      </div>
    </div>
  );
}

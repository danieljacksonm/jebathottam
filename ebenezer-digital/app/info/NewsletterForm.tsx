"use client";

import { NewsletterSignup } from "@/components/NewsletterSignup";

export function NewsletterForm() {
  return (
    <NewsletterSignup
      variant="info"
      source="info-home"
      placeholder="you@example.com"
    />
  );
}

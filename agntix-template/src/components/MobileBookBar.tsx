"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function MobileBookBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const onEnquire = pathname === "/enquire";
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    if (onEnquire) return;
    const form = document.querySelector("form");
    if (!form) return;

    const io = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(form);
    return () => io.disconnect();
  }, [onEnquire, pathname]);

  if (onEnquire || formVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[55] border-t border-[var(--line)] bg-navy/92 px-4 py-3 backdrop-blur-xl md:hidden">
      <Link href="/enquire" className="btn-gold w-full">
        {t("bookNow")}
      </Link>
    </div>
  );
}

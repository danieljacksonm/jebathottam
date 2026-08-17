import {
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_TEL,
  SITE_WHATSAPP_URL,
} from "@/lib/site-contact";

const LINKS = [
  { href: `mailto:${SITE_EMAIL}`, label: SITE_EMAIL },
  { href: SITE_PHONE_TEL, label: SITE_PHONE_DISPLAY },
  { href: SITE_WHATSAPP_URL, label: "WhatsApp", external: true },
];

export function SiteContactLinks({
  className = "",
  linkClassName = "",
  stacked = false,
}: {
  className?: string;
  linkClassName?: string;
  stacked?: boolean;
}) {
  return (
    <div
      className={`${stacked ? "flex flex-col gap-1" : "flex flex-wrap items-center gap-x-3 gap-y-1"} ${className}`}
    >
      {LINKS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={linkClassName}
          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

import { Mail, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { BUSINESS } from "@/lib/contact";

type Props = {
  phoneLabel: string;
  whatsappLabel: string;
  emailLabel: string;
  facebookLabel: string;
  className?: string;
  compact?: boolean;
  /** Contextual WhatsApp deep link (prefilled message). */
  whatsappHref?: string;
};

export function ContactLinks({
  phoneLabel,
  whatsappLabel,
  emailLabel,
  facebookLabel,
  className = "",
  compact = false,
  whatsappHref,
}: Props) {
  const linkClass = compact
    ? "flex items-center gap-2 text-sm text-white/70 transition hover:text-gold"
    : "flex items-center gap-3 text-base text-white/80 transition hover:text-gold-bright";

  return (
    <ul className={`space-y-3 ${className}`}>
      <li>
        <a href={`tel:${BUSINESS.phoneE164}`} className={linkClass}>
          <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          <span>
            <span className="sr-only">{phoneLabel}: </span>
            {BUSINESS.phoneDisplay}
          </span>
        </a>
      </li>
      <li>
        <a
          href={whatsappHref ?? BUSINESS.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <MessageCircle className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          <span>{whatsappLabel}</span>
        </a>
      </li>
      {BUSINESS.emails.map((address) => (
        <li key={address}>
          <a href={`mailto:${address}`} className={linkClass}>
            <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
            <span>
              <span className="sr-only">{emailLabel}: </span>
              {address}
            </span>
          </a>
        </li>
      ))}
      <li>
        <a
          href={BUSINESS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <ExternalLink className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          <span>{facebookLabel}</span>
        </a>
      </li>
    </ul>
  );
}

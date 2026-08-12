import Link from 'next/link';
import { ministryInfo } from '@/data/demo-content';
import { Logo } from '@/components/ui/logo';

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Prayer Schedule' },
  { href: '/team', label: 'Our Team' },
  { href: '/blog', label: 'Blog' },
  { href: '/videos', label: 'Videos' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/attendance', label: 'Youth Attendance' },
  { href: '/carmel-attendance', label: 'Carmel Watch' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
];

const socialLinks = [
  {
    label: 'YouTube',
    href: ministryInfo.youtube,
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'WhatsApp',
    href: ministryInfo.whatsapp,
    icon: 'M12.012 2C6.48 2 2 6.48 2 12.01c0 1.83.49 3.54 1.34 5.03L2 22l5.13-1.34c1.44.78 3.09 1.22 4.88 1.22 5.53 0 10.01-4.48 10.01-10.01C22.022 6.48 17.54 2 12.012 2zm0 18.01c-1.57 0-3.08-.42-4.4-1.21l-.32-.19-3.27.85.87-3.19-.21-.34c-.87-1.38-1.33-2.99-1.33-4.66 0-4.68 3.81-8.49 8.49-8.49s8.49 3.81 8.49 8.49c-.01 4.68-3.82 8.49-8.49 8.49zm4.65-6.3c-.25-.13-1.5-.74-1.74-.82-.23-.08-.4-.13-.57.13-.17.25-.66.82-.81.99-.15.17-.3.19-.55.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.5-.61 1.71-1.2.21-.58.21-1.09.15-1.2-.06-.11-.22-.17-.47-.3z',
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-14 pb-10 border-b border-gray-800/60">
          <div className="w-10 h-px bg-primary-500 mx-auto mb-8" />
          <p className="text-xl md:text-2xl lg:text-3xl font-serif italic text-white/85 max-w-3xl mx-auto leading-relaxed tracking-tight">
            &ldquo;{ministryInfo.scripture}&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-14">
          <div>
            <Logo variant="admin" className="mb-5" />
            <p className="text-gray-400 text-sm leading-relaxed mt-4 max-w-xs">
              Christian prayer ministry in Keelamudiman, Tuticorin. Daily online prayer,
              youth morning prayer, fasting prayer, and 24x7 Carmel watch.
            </p>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-2.5 text-sm text-gray-400 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${ministryInfo.email}`} className="hover:text-white">
                  {ministryInfo.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {ministryInfo.phone}
              </li>
              <li className="flex items-start gap-2 text-gray-500">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {ministryInfo.address}
              </li>
            </ul>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800/60 hover:bg-primary-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  aria-label={`${social.label} (opens in new tab)`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-8 text-center">
          <p className="text-gray-500 text-xs tracking-wide">
            &copy; {currentYear} {ministryInfo.name}. All rights reserved.
            {typeof process.env.NEXT_PUBLIC_BUILD_TIME === 'string' && process.env.NEXT_PUBLIC_BUILD_TIME && (
              <span className="opacity-60"> &middot; Built {new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString()}</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}

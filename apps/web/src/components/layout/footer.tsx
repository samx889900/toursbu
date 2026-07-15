import Link from "next/link";
import { MapPin, Mail, Phone, Instagram, MessageCircle } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Explore Trips", href: "/trips" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Cancellation Policy", href: "/cancellation" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--tbu-hairline)] bg-[var(--tbu-parchment)]">
      <div className="tbu-container">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded-lg w-max">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--tbu-blue)] shadow-tbu-1 transition-transform hover:scale-105">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-heading-md">
                Tours<span className="text-[var(--tbu-blue)]">BU</span>
              </span>
            </Link>
            <p className="mt-4 text-body-sm text-[var(--tbu-muted)] max-w-xs text-balance">
              The modern platform for student travel. Discover, book, and manage
              trips with your college community.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com/toursbu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-muted)] transition-colors hover:bg-[var(--tbu-blue-soft)] hover:text-[var(--tbu-blue-press)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-muted)] transition-colors hover:bg-[var(--tbu-green-soft)] hover:text-[var(--tbu-green-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@toursbu.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tbu-surface)] text-[var(--tbu-muted)] transition-colors hover:bg-[var(--tbu-blue-soft)] hover:text-[var(--tbu-blue-press)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-heading-sm mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                   href={link.href}
                    className="text-body-sm text-[var(--tbu-muted)] transition-colors hover:text-[var(--tbu-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-heading-sm mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--tbu-muted)] transition-colors hover:text-[var(--tbu-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-heading-sm mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--tbu-muted)] transition-colors hover:text-[var(--tbu-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="flex flex-col gap-4 border-t border-[var(--tbu-hairline)] py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-6 text-body-sm text-[var(--tbu-muted)]">
            <a
              href="mailto:support@toursbu.com"
              className="flex items-center gap-2 hover:text-[var(--tbu-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded"
            >
              <Mail className="h-4 w-4" />
              support@toursbu.com
            </a>
            <a
              href="tel:+919999999999"
              className="flex items-center gap-2 hover:text-[var(--tbu-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded"
            >
              <Phone className="h-4 w-4" />
              +91 99999 99999
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--tbu-hairline)] py-6">
          <p className="text-caption-sm text-[var(--tbu-muted)] text-center">
            © {new Date().getFullYear()} ToursBU. All rights reserved. Made with ❤️ for student travelers.
          </p>
        </div>
      </div>
    </footer>
  );
}

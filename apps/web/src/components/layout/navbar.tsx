"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Trips", href: "/trips" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Demo auth state (will be replaced by Better Auth)
  const isAuthenticated = false;

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const handle = setTimeout(() => setMobileOpen(false), 0);
      return () => clearTimeout(handle);
    }
  }, [pathname, mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-subtle",
          scrolled
            ? "border-b border-[var(--tbu-glass-border)] shadow-sm"
            : "border-b border-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--tbu-blue)] shadow-tbu-1 transition-transform group-hover:scale-105">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-heading-md">
                Tours<span className="text-[var(--tbu-blue)]">BU</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-nav rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]",
                    pathname === link.href
                      ? "text-[var(--tbu-blue)]"
                      : "text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)] hover:bg-[var(--tbu-surface)]"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-[var(--tbu-blue)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--tbu-muted)] transition-colors hover:bg-[var(--tbu-surface)] hover:text-[var(--tbu-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              )}

              {/* Auth Buttons (Desktop) */}
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated ? (
                  <Button asChild className="gap-2">
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="rounded-full">
                      <Link href="/auth">Log in</Link>
                    </Button>
                    <Button asChild className="rounded-full">
                      <Link href="/auth">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--tbu-muted)] transition-colors hover:bg-[var(--tbu-surface)] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 border-b border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] p-4 shadow-tbu-2 md:hidden rounded-b-2xl"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3 text-nav transition-colors",
                    pathname === link.href
                      ? "bg-[var(--tbu-blue-soft)] text-[var(--tbu-blue-press)]"
                      : "text-[var(--tbu-muted)] hover:bg-[var(--tbu-surface)] hover:text-[var(--tbu-ink)]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 border-t border-[var(--tbu-hairline)] pt-4 space-y-2">
              {isAuthenticated ? (
                <Button asChild className="w-full gap-2 justify-center">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full justify-center rounded-xl">
                    <Link href="/auth">Log in</Link>
                  </Button>
                  <Button asChild className="w-full justify-center rounded-xl">
                    <Link href="/auth">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

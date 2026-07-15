"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { heroSlides, testimonials, platformFaqs, announcements } from "@/lib/data/cms";
import { Image, MessageSquareQuote, HelpCircle, Megaphone, ArrowRight } from "lucide-react";

const cmsBlocks = [
  {
    title: "Hero Slides",
    description: "Manage the main homepage carousel slides.",
    icon: Image,
    count: heroSlides.length,
    href: "/admin/cms/hero",
    color: "text-blue-500",
  },
  {
    title: "Testimonials",
    description: "Student reviews and testimonials displayed on the homepage.",
    icon: MessageSquareQuote,
    count: testimonials.length,
    href: "/admin/cms/testimonials",
    color: "text-purple-500",
  },
  {
    title: "FAQs",
    description: "Frequently asked questions displayed on the homepage.",
    icon: HelpCircle,
    count: platformFaqs.length,
    href: "/admin/cms/faq",
    color: "text-emerald-500",
  },
  {
    title: "Announcements",
    description: "Site-wide banners and announcement messages.",
    icon: Megaphone,
    count: announcements.length,
    href: "/admin/cms/announcements",
    color: "text-amber-500",
  },
];

export default function AdminCmsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Manage all editable content on the website using the ContentBlock system."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "CMS" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {cmsBlocks.map((block) => (
          <Link
            key={block.href}
            href={block.href}
            className="group rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 transition-all duration-300 hover:shadow-lg hover:border-[hsl(var(--primary)/0.2)] hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--muted))] group-hover:bg-[hsl(var(--primary)/0.1)] transition-colors">
                  <block.icon className={`h-5 w-5 ${block.color}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">{block.title}</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{block.description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-2xl font-bold text-[hsl(var(--foreground))]">{block.count}</span>
              <span className="text-xs text-[hsl(var(--muted-foreground))]">items</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

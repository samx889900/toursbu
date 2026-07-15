"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { platformFaqs } from "@/lib/data/cms";
import type { FaqContent } from "@toursbu/types";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="tbu-section tbu-parchment">
      <div className="tbu-container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-display-md mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-body text-[var(--tbu-muted)]">
            Everything you need to know about ToursBU.
          </p>
        </div>

        <div className="space-y-3">
          {platformFaqs.map((block, i) => {
            const content = block.content as unknown as FaqContent;
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="rounded-2xl border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] overflow-hidden transition-all duration-300 hover:border-[var(--tbu-hairline-strong)]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left focus-visible:outline-none focus-visible:bg-[var(--tbu-surface)]"
                >
                  <span className="text-body-sm font-semibold text-[var(--tbu-ink)] pr-4">
                    {content.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[var(--tbu-muted)] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 text-body-sm text-[var(--tbu-muted)] leading-relaxed">
                    {content.answer}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

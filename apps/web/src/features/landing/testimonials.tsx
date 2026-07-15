"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data/cms";
import type { TestimonialContent } from "@toursbu/types";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  return (
    <section className="tbu-section bg-[var(--tbu-canvas)]">
      <div className="tbu-container">
        <div className="text-center mb-16">
          <h2 className="text-display-md mb-3">
            What Students Say
          </h2>
          <p className="text-body text-[var(--tbu-muted)]">
            Real stories from real travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((block, i) => {
            const content = block.content as unknown as TestimonialContent;
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <Card className="h-full relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 flex flex-col h-full">
                    <Quote className="absolute top-6 right-6 h-12 w-12 text-[var(--tbu-blue-soft)] opacity-50" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-6 relative z-10">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={`h-4 w-4 ${
                            si < content.rating
                              ? "fill-[var(--tbu-warning)] text-[var(--tbu-warning)]"
                              : "text-[var(--tbu-hairline-strong)]"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-body text-[var(--tbu-ink)] leading-relaxed mb-8 flex-grow relative z-10">
                      &ldquo;{content.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 mt-auto relative z-10 pt-4 border-t border-[var(--tbu-hairline)]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tbu-blue-soft)] text-[var(--tbu-blue-press)] text-sm font-bold shadow-sm">
                        {content.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-[var(--tbu-ink)]">
                          {content.name}
                        </p>
                        <p className="text-caption-sm text-[var(--tbu-muted)]">
                          {content.college} · {content.tripName}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

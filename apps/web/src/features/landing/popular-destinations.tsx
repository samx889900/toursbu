"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { categories } from "@/lib/data/trips";
import { Card, CardContent } from "@/components/ui/card";

export function PopularDestinations() {
  return (
    <section className="tbu-section tbu-parchment">
      <div className="tbu-container">
        <div className="text-center mb-12">
          <h2 className="text-display-md mb-3">
            Explore by Category
          </h2>
          <p className="text-body text-[var(--tbu-muted)]">
            Find the type of trip that excites you most.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Link
                href={`/trips?category=${cat.slug}`}
                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded-2xl"
              >
                <Card className="h-full transition-transform duration-300 hover:-translate-y-1 group-hover:border-[var(--tbu-blue-soft)]">
                  <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="text-body-sm font-semibold text-[var(--tbu-ink)] group-hover:text-[var(--tbu-blue)] transition-colors">
                      {cat.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

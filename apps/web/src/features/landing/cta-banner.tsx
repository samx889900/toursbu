"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="tbu-section bg-[var(--tbu-canvas)]">
      <div className="tbu-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative overflow-hidden rounded-2xl bg-[var(--tbu-blue)] p-12 sm:p-16 text-center shadow-tbu-blue"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-display-md text-white">
              Ready for your next adventure?
            </h2>
            <p className="mt-4 text-body text-white/90 max-w-2xl mx-auto text-balance">
              Join thousands of students who&apos;ve discovered their favorite destinations
              through ToursBU. Your next memory is just a click away.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="rounded-full bg-white text-[var(--tbu-blue)] hover:bg-[var(--tbu-blue-soft)] group shadow-tbu-2" asChild>
                <Link href="/trips">
                  Explore Trips
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full bg-transparent text-white border-white/30 hover:bg-white/10" asChild>
                <Link href="/auth">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

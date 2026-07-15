"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const IMAGES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516939884455-1445c8652f83?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1974&auto=format&fit=crop"
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Cinematic Cross-Fade Background */}
      <div className="absolute inset-0 -z-20 bg-black">
        {IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 animate-[crossfade_25s_ease-in-out_infinite]"
            style={{ 
              backgroundImage: `url(${src})`,
              animationDelay: `${i * (25 / IMAGES.length)}s` 
            }}
          />
        ))}
      </div>

      {/* Photo Overlay */}
      <div className="absolute inset-0 -z-10 photo-overlay" />

      <div className="tbu-container text-center pt-24 pb-20 relative z-10 w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass-subtle px-4 py-1.5 text-caption font-medium text-white shadow-tbu-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--tbu-blue)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--tbu-blue)]" />
            </span>
            Booking open for August & September trips
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-display-hero !text-white text-balance drop-shadow-lg"
        >
          Travel Together.<br />
          Explore More.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-6 text-heading-md !text-white/90 max-w-2xl mx-auto text-balance drop-shadow-md"
        >
          Discover curated student trips, reserve your seat with a small advance,
          and create memories that last a lifetime.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <Button size="lg" className="rounded-full shadow-tbu-blue gap-2" asChild>
            <Link href="/trips">
              Explore Trips
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="rounded-full bg-white/10 !text-white border-white/20 hover:bg-white/20 backdrop-blur-md" asChild>
            <Link href="#how-it-works">
              How It Works
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-2xl mx-auto"
        >
          {[
            { value: "2,500+", label: "Travelers" },
            { value: "50+", label: "Trips Completed" },
            { value: "15+", label: "Destinations" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-display-md tabular-nums !text-white drop-shadow-md">
                {stat.value}
              </p>
              <p className="text-body-sm !text-white/80 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

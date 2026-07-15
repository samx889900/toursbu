"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Users, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WhyToursBU() {
  const features = [
    {
      icon: Shield,
      title: "Safe & Trusted",
      description: "Every trip is organized with certified operators, emergency contacts, and trip leaders trained in first aid.",
    },
    {
      icon: Clock,
      title: "Easy Booking",
      description: "Reserve your seat with a small advance payment. Pay the rest before departure. No complicated processes.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Travel with your college community. Make friends, share experiences, and build memories together.",
    },
    {
      icon: MapPin,
      title: "Curated Trips",
      description: "Hand-picked destinations with carefully planned itineraries. Every detail thought through for you.",
    },
  ];

  return (
    <section id="how-it-works" className="tbu-section tbu-parchment">
      <div className="tbu-container">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-display-md mb-4">
            Why <span className="text-[var(--tbu-blue)]">ToursBU</span>?
          </h2>
          <p className="text-body text-[var(--tbu-muted)] text-balance">
            We&apos;re not just another travel company. We&apos;re building the best platform for student group travel.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Card className="h-full text-center hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tbu-blue-soft)] mb-6">
                    <feature.icon className="h-6 w-6 text-[var(--tbu-blue)]" />
                  </div>
                  <h3 className="text-heading-sm mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-[var(--tbu-muted)] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

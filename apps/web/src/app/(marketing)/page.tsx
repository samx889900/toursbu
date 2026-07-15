import { HeroSection } from "@/features/landing/hero-section";
import { WhyToursBU } from "@/features/landing/why-toursbu";
import { UpcomingTrips } from "@/features/landing/upcoming-trips";
import { PopularDestinations } from "@/features/landing/popular-destinations";
import { Testimonials } from "@/features/landing/testimonials";
import { FaqSection } from "@/features/landing/faq-section";
import { CtaBanner } from "@/features/landing/cta-banner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <UpcomingTrips />
      <PopularDestinations />
      <WhyToursBU />
      <Testimonials />
      <FaqSection />
      <CtaBanner />
    </>
  );
}

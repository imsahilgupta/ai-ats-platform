import { Hero } from "@/components/marketing/hero";
import { TrustedCompanies } from "@/components/marketing/trusted-companies";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { StatsSection } from "@/components/marketing/stats-section";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustedCompanies />
      <FeatureGrid />
      <HowItWorks />
      <StatsSection />
      <PricingPreview />
      <TestimonialCarousel />
      <FaqSection />
      <CtaSection />
    </>
  );
}

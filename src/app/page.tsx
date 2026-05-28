"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { ServicesSection } from "@/components/landing/services-section"
import { WhyChooseSection } from "@/components/landing/why-choose-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { ResourcesSection } from "@/components/landing/resources-section"
import { DocumentLibrarySection } from "@/components/landing/document-library-section"
import { CTASection } from "@/components/landing/cta-section"

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <ServicesSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <PricingSection />
      <ResourcesSection />
      <DocumentLibrarySection />
      <CTASection />
    </div>
  )
}

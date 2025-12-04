"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ParallaxHero } from "@/components/landing/ParallaxHero";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

import { KeyBenefits } from "@/components/landing/KeyBenefits";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // useEffect(() => {
  //   if (!loading && user) {
  //     router.push("/roadmap");
  //   }
  // }, [user, loading, router]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#0F172A] text-white selection:bg-[#6B46FF]/30 font-sans overflow-x-hidden">
        <LandingNavbar />

        <main>
          <ParallaxHero />

          <div id="features">
            <KeyBenefits />
          </div>
          <InteractiveDemo />
          <div id="pricing">
            <Pricing />
          </div>
          <div id="testimonials">
            <Testimonials />
          </div>
          <FAQ />
        </main>

        <LandingFooter />
      </div>
    </SmoothScroll>
  );
}

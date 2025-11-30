"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe, Shield, Cpu, Play, CheckCircle2, Rocket, Brain, Layers, Code } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/Spotlight";
import { Meteors } from "@/components/ui/Meteors";
import { TiltCard } from "@/components/ui/TiltCard";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

// --- Components ---

function BentoCard({ title, description, icon: Icon, className, gradient }: any) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl p-8 border border-white/10 group hover:border-white/20 transition-all duration-500",
      "bg-slate-950/50 backdrop-blur-xl",
      className
    )}>
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500", gradient)} />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center group">
      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-2 tracking-tight group-hover:scale-110 transition-transform duration-500">{value}</div>
      <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">{label}</div>
    </div>
  );
}

// --- Main Content ---

function LandingContent() {

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30 font-sans overflow-hidden">

      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 mb-8 backdrop-blur-md hover:border-blue-500/50 transition-colors cursor-default"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">The Future of Learning is Here</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8"
          >
            Master <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 animate-gradient-x">
              Any Skill
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            EduMate AI generates personalized, interactive roadmaps for any topic in seconds.
            Powered by advanced AI to adapt to your unique learning style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] transition-all duration-300 border-0">
                Start For Free
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-10 rounded-2xl border-slate-700 hover:bg-slate-800 text-xl font-medium">
                <Play className="w-5 h-5 mr-2" />
                Live Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Meteors number={20} />
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Engineered for <span className="text-blue-400">Excellence</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              A complete ecosystem designed to accelerate your mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <BentoCard
              title="AI Curriculum"
              description="Dynamic learning paths generated instantly based on your goals."
              icon={Brain}
              className="md:col-span-2 md:row-span-2"
              gradient="bg-gradient-to-br from-blue-500 to-purple-500"
            />
            <BentoCard
              title="Interactive Labs"
              description="Hands-on coding environments."
              icon={Code}
              className="md:col-span-1 md:row-span-1"
              gradient="bg-gradient-to-br from-green-500 to-emerald-500"
            />
            <BentoCard
              title="Global Scale"
              description="Connect with millions."
              icon={Globe}
              className="md:col-span-1 md:row-span-1"
              gradient="bg-gradient-to-br from-orange-500 to-red-500"
            />
            <BentoCard
              title="Real-time Analytics"
              description="Track every milestone."
              icon={Zap}
              className="md:col-span-3 md:row-span-1"
              gradient="bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 border-y border-white/5 bg-slate-900/30 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem value="100k+" label="Active Users" />
            <StatItem value="5M+" label="Lessons Taken" />
            <StatItem value="99%" label="Satisfaction" />
            <StatItem value="24/7" label="AI Availability" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-blue-950/20" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
            Ready to <span className="text-blue-400">Ascend?</span>
          </h2>
          <p className="text-2xl text-slate-400 mb-12 max-w-3xl mx-auto">
            Join the revolution. Experience the most advanced learning platform ever built.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-20 px-16 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-black text-2xl shadow-[0_0_60px_-15px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/roadmap");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <SplashScreen />;
  }

  return <LandingContent />;
}

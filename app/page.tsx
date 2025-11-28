"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe, Shield, Cpu, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { BrandMark } from "@/components/ui/BrandMark";
import { cn } from "@/lib/utils";

// --- Components ---

function FeatureCard({ title, description, icon: Icon, className }: any) {
  return (
    <div className={cn(
      "p-8 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-all duration-300 group",
      className
    )}>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-indigo/20 to-accent-cyan/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-accent-cyan" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{value}</div>
      <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

// --- Main Content ---

function LandingContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-accent-indigo/30 font-sans overflow-hidden">

      {/* Global Background Effects (Matches Roadmap Page) */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <BrandMark tagline="Intelligent Skill Engine" size={32} variant="glow" />
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup">
              <Button className="bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={containerRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm font-medium text-slate-300">AI-Powered Learning Revolution</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          >
            Master any skill <br />
            <span className="bg-gradient-to-r from-accent-indigo via-accent-cyan to-accent-indigo bg-clip-text text-transparent animate-gradient">
              Faster Than Ever
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Stop wasting time on generic courses. Get a personalized, AI-generated curriculum that adapts to your goals, pace, and learning style in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-cyan hover:shadow-lg hover:shadow-accent-indigo/25 text-white font-bold text-lg border-0">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/roadmap" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl border-slate-700 hover:bg-slate-800 text-lg">
                <Play className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </Link>
          </motion.div>

          {/* Abstract Dashboard Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-24 relative mx-auto max-w-5xl"
          >
            <div className="relative rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/9] group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/5 via-transparent to-accent-cyan/5 group-hover:opacity-75 transition-opacity" />

              {/* Mock UI Elements */}
              <div className="absolute top-0 left-0 right-0 h-12 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center pt-12">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center mb-6 shadow-lg shadow-accent-indigo/20">
                    <Cpu className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Interactive Learning Engine</h3>
                  <p className="text-slate-400">Your personal AI tutor, available 24/7</p>
                </div>
              </div>
            </div>

            {/* Glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent-indigo to-accent-cyan opacity-20 blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Everything you need to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-indigo to-accent-cyan">
                Accelerate Your Growth
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              We've combined the best learning techniques with cutting-edge AI to create the ultimate learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="AI-Powered Curriculums"
              description="Instantly generate structured learning paths for any topic, tailored to your current skill level."
              icon={Cpu}
              className="md:col-span-2"
            />
            <FeatureCard
              title="Global Community"
              description="Connect with learners worldwide."
              icon={Globe}
            />
            <FeatureCard
              title="Progress Tracking"
              description="Visualize your journey with detailed analytics."
              icon={Zap}
            />
            <FeatureCard
              title="Secure & Private"
              description="Your data is encrypted and never shared."
              icon={Shield}
              className="md:col-span-2"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem value="50k+" label="Active Learners" />
            <StatItem value="1.2k+" label="Skill Paths" />
            <StatItem value="98%" label="Completion Rate" />
            <StatItem value="24/7" label="AI Support" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-accent-indigo/10 to-accent-cyan/10 border border-accent-indigo/20 backdrop-blur-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to start your journey?</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join thousands of developers and designers who are accelerating their careers with SkillForge.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-14 px-10 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-lg shadow-lg">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandMark size={24} tagline="" variant="default" />
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <div className="text-sm text-slate-500">
            © 2025 SkillForge AI. All rights reserved.
          </div>
        </div>
      </footer>
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

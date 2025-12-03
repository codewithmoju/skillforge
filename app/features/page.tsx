"use client";

import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { FeaturesNavigation } from "@/components/features/FeaturesNavigation";
import { FeaturesHero } from "@/components/features/FeaturesHero";
import { GamifiedLearning } from "@/components/features/GamifiedLearning";
import { RoadmapGenerator } from "@/components/features/RoadmapGenerator";
import { CourseGenerator } from "@/components/features/CourseGenerator";
import { ChatbotDemo } from "@/components/features/ChatbotDemo";
import { PodcastDemo } from "@/components/features/PodcastDemo";
import { SocialHub } from "@/components/features/SocialHub";
import { EncryptedChat } from "@/components/features/EncryptedChat";
import { ExploreWorld } from "@/components/features/ExploreWorld";
import { ProfilePreview } from "@/components/features/ProfilePreview";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/Button";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function FeaturesPage() {
    return (
        <SmoothScroll>
            <main className="relative bg-slate-950 min-h-screen">
                <LandingNavbar />
                <FeaturesNavigation />

                <section id="hero">
                    <FeaturesHero />
                </section>

                <section id="gamified">
                    <GamifiedLearning />
                </section>

                <section id="roadmap">
                    <RoadmapGenerator />
                </section>

                <section id="course-gen">
                    <CourseGenerator />
                </section>

                <section id="chatbot">
                    <ChatbotDemo />
                </section>

                <section id="podcast">
                    <PodcastDemo />
                </section>

                <section id="social">
                    <SocialHub />
                </section>

                <section id="encrypted">
                    <EncryptedChat />
                </section>

                <section id="explore">
                    <ExploreWorld />
                </section>

                <section id="profile">
                    <ProfilePreview />
                </section>

                <section id="profile">
                    <ProfilePreview />
                </section>

                <LandingFooter />

            </main>
        </SmoothScroll>
    );
}

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
    { id: "hero", label: "Top" },
    { id: "gamified", label: "Gamification" },
    { id: "roadmap", label: "Roadmaps" },
    { id: "course-gen", label: "Course Gen" },
    { id: "chatbot", label: "AI Tutor" },
    { id: "podcast", label: "Podcast" },
    { id: "social", label: "Social" },
    { id: "encrypted", label: "Privacy" },
    { id: "explore", label: "Explore" },
    { id: "profile", label: "Profile" },
    { id: "theme", label: "Themes" },
];

export function FeaturesNavigation() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-45% 0px -45% 0px",
                threshold: 0
            }
        );

        SECTIONS.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden xl:block">
            <div className="flex flex-col gap-4">
                {SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                            "group flex items-center gap-3 transition-all",
                            activeSection === section.id ? "opacity-100" : "opacity-40 hover:opacity-80"
                        )}
                    >
                        <div
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                activeSection === section.id ? "bg-indigo-600 w-3 h-3" : "bg-slate-400"
                            )}
                        />
                        <span
                            className={cn(
                                "text-xs font-medium transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                                activeSection === section.id && "opacity-100 translate-x-0 font-bold text-indigo-600"
                            )}
                        >
                            {section.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";

interface PerformanceSettings {
    prefersReducedMotion: boolean;
    isLowEndDevice: boolean;
    shouldReduceAnimations: boolean;
}

/**
 * Hook to detect device performance and user preferences for animations
 * Automatically reduces animations on low-end devices or when user prefers reduced motion
 */
export function usePerformance(): PerformanceSettings {
    const [settings, setSettings] = useState<PerformanceSettings>({
        prefersReducedMotion: false,
        isLowEndDevice: false,
        shouldReduceAnimations: false,
    });

    useEffect(() => {
        // Check if user prefers reduced motion (accessibility)
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const prefersReducedMotion = mediaQuery.matches;

        // Detect low-end device based on hardware concurrency and device memory
        let isLowEndDevice = false;

        // Check CPU cores (less than 4 cores = low-end)
        const cores = navigator.hardwareConcurrency || 4;
        if (cores < 4) {
            isLowEndDevice = true;
        }

        // Check device memory if available (less than 4GB = low-end)
        const memory = (navigator as any).deviceMemory;
        if (memory && memory < 4) {
            isLowEndDevice = true;
        }

        // Check if mobile device (generally less powerful)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        // On mobile, be more conservative
        if (isMobile && cores <= 4) {
            isLowEndDevice = true;
        }

        // Should reduce animations if either condition is true
        const shouldReduceAnimations = prefersReducedMotion || isLowEndDevice;

        setSettings({
            prefersReducedMotion,
            isLowEndDevice,
            shouldReduceAnimations,
        });

        // Listen for changes to reduced motion preference
        const handleChange = (e: MediaQueryListEvent) => {
            setSettings((prev) => ({
                ...prev,
                prefersReducedMotion: e.matches,
                shouldReduceAnimations: e.matches || prev.isLowEndDevice,
            }));
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return settings;
}

/**
 * Get animation configuration based on performance settings
 */
export function getAnimationConfig(shouldReduce: boolean) {
    if (shouldReduce) {
        return {
            // Reduced motion: simple fade animations only
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.2 },
        };
    }

    return {
        // Full animations
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5 },
    };
}

export type SkinId = "cyber-neon" | "forest-quest" | "space-odyssey" | "dragons-lair" | "ocean-depths";

export type LayoutType = "vertical" | "tree" | "orbital" | "dungeon" | "wave";

export interface SkinColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundCard: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
    nodeCompleted: string;
    nodeActive: string;
    nodeLocked: string;
    path: {
        inactive: string;
        active: string;
        completed: string;
    };
}

// ... (rest of interfaces)



export interface NodePositioning {
    strategy: LayoutType;
    spacing: {
        vertical: number;
        horizontal: number;
        minDistance: number; // Minimum distance between nodes to prevent overlap
    };
    preventOverlap: boolean;
    responsive: {
        mobile: { vertical: number; horizontal: number; minDistance: number };
        tablet: { vertical: number; horizontal: number; minDistance: number };
        desktop: { vertical: number; horizontal: number; minDistance: number };
    };
}

export interface SkinAnimations {
    nodeEntry: {
        type: 'fade' | 'scale' | 'slide' | 'bounce' | 'glow';
        duration: number;
        delay: number;
    };
    pathDraw: {
        type: 'draw' | 'fade' | 'pulse' | 'flow';
        duration: number;
    };
    completion: {
        type: 'confetti' | 'sparkle' | 'explosion' | 'ripple';
        duration: number;
    };
    hover: {
        scale: number;
        glow: boolean;
        duration: number;
    };
}

export interface SkinEffects {
    particles: {
        enabled: boolean;
        type: 'stars' | 'leaves' | 'bubbles' | 'fire' | 'code';
        count: number;
        speed: number;
    };
    glow: {
        enabled: boolean;
        intensity: number;
        color: string;
    };
    shadows: {
        enabled: boolean;
        blur: number;
        color: string;
    };
    background: {
        type: 'gradient' | 'pattern' | 'animated' | 'static';
        customClass?: string;
    };
}

export interface SkinConfig {
    id: SkinId;
    name: string;
    description: string;
    tagline: string;
    isPremium: boolean;
    price?: number;
    layout: LayoutType;
    colors: SkinColors;
    previewGradient: string;
    previewIcon: string;

    // Enhanced configuration
    positioning: NodePositioning;
    animations: SkinAnimations;
    effects: SkinEffects;
    themeClass: string;
}

export const SKIN_CONFIGS: Record<SkinId, SkinConfig> = {
    "cyber-neon": {
        id: "cyber-neon",
        name: "Cyber Neon",
        description: "Futuristic tech theme with glowing nodes",
        tagline: "Enter the Digital Realm",
        isPremium: false,
        layout: "vertical",
        colors: {
            primary: "#6366F1",
            secondary: "#8B5CF6",
            accent: "#06B6D4",
            background: "#0F172A",
            backgroundCard: "#1E293B",
            textPrimary: "#E2E8F0",
            textSecondary: "#94A3B8",
            textMuted: "#64748B",
            success: "#22C55E",
            warning: "#FACC15",
            error: "#EF4444",
            nodeCompleted: "#22C55E",
            nodeActive: "#06B6D4",
            nodeLocked: "#475569",
            path: {
                inactive: "#334155",
                active: "#06B6D4",
                completed: "#22C55E",
            },
        },
        previewGradient: "from-indigo-500 via-purple-500 to-cyan-500",
        previewIcon: "⚡",
        positioning: {
            strategy: "vertical",
            spacing: { vertical: 180, horizontal: 0, minDistance: 120 },
            preventOverlap: true,
            responsive: {
                mobile: { vertical: 140, horizontal: 0, minDistance: 100 },
                tablet: { vertical: 160, horizontal: 0, minDistance: 110 },
                desktop: { vertical: 180, horizontal: 0, minDistance: 120 },
            },
        },
        animations: {
            nodeEntry: { type: 'glow', duration: 600, delay: 100 },
            pathDraw: { type: 'draw', duration: 800 },
            completion: { type: 'sparkle', duration: 1000 },
            hover: { scale: 1.1, glow: true, duration: 300 },
        },
        effects: {
            particles: { enabled: true, type: 'stars', count: 50, speed: 0.5 },
            glow: { enabled: true, intensity: 0.8, color: '#06B6D4' },
            shadows: { enabled: true, blur: 20, color: 'rgba(99, 102, 241, 0.3)' },
            background: { type: 'animated', customClass: 'cyber-grid' },
        },
        themeClass: 'theme-cyber-neon',
    },
    "forest-quest": {
        id: "forest-quest",
        name: "Forest Quest",
        description: "Nature-themed with tree branch layout",
        tagline: "Grow Your Skill Tree",
        isPremium: true,
        price: 2.99,
        layout: "tree",
        colors: {
            primary: "#22C55E",
            secondary: "#10B981",
            accent: "#F59E0B",
            background: "#0A1F0A",
            backgroundCard: "#1A2E1A",
            textPrimary: "#D1FAE5",
            textSecondary: "#86EFAC",
            textMuted: "#6EE7B7",
            success: "#10B981",
            warning: "#F59E0B",
            error: "#EF4444",
            nodeCompleted: "#10B981",
            nodeActive: "#22C55E",
            nodeLocked: "#374151",
            path: {
                inactive: "#1F2937",
                active: "#22C55E",
                completed: "#10B981",
            },
        },
        previewGradient: "from-green-500 via-emerald-500 to-amber-500",
        previewIcon: "🌲",
        positioning: {
            strategy: "tree",
            spacing: { vertical: 200, horizontal: 250, minDistance: 150 },
            preventOverlap: true,
            responsive: {
                mobile: { vertical: 150, horizontal: 120, minDistance: 100 },
                tablet: { vertical: 180, horizontal: 200, minDistance: 130 },
                desktop: { vertical: 200, horizontal: 250, minDistance: 150 },
            },
        },
        animations: {
            nodeEntry: { type: 'bounce', duration: 800, delay: 150 },
            pathDraw: { type: 'flow', duration: 1000 },
            completion: { type: 'sparkle', duration: 1200 },
            hover: { scale: 1.08, glow: true, duration: 350 },
        },
        effects: {
            particles: { enabled: true, type: 'leaves', count: 40, speed: 0.3 },
            glow: { enabled: true, intensity: 0.6, color: '#22C55E' },
            shadows: { enabled: true, blur: 15, color: 'rgba(34, 197, 94, 0.2)' },
            background: { type: 'pattern', customClass: 'forest-bg' },
        },
        themeClass: 'theme-forest-quest',
    },
    "space-odyssey": {
        id: "space-odyssey",
        name: "Space Odyssey",
        description: "Cosmic theme with orbital layout",
        tagline: "Explore the Cosmos of Knowledge",
        isPremium: true,
        price: 2.99,
        layout: "orbital",
        colors: {
            primary: "#8B5CF6",
            secondary: "#A855F7",
            accent: "#EC4899",
            background: "#0A0A1A",
            backgroundCard: "#1A1A2E",
            textPrimary: "#E9D5FF",
            textSecondary: "#C4B5FD",
            textMuted: "#A78BFA",
            success: "#10B981",
            warning: "#F59E0B",
            error: "#EF4444",
            nodeCompleted: "#A855F7",
            nodeActive: "#EC4899",
            nodeLocked: "#4B5563",
            path: {
                inactive: "#1F2937",
                active: "#EC4899",
                completed: "#A855F7",
            },
        },
        previewGradient: "from-purple-600 via-pink-500 to-blue-500",
        previewIcon: "🚀",
        positioning: {
            strategy: "orbital",
            spacing: { vertical: 220, horizontal: 280, minDistance: 160 },
            preventOverlap: true,
            responsive: {
                mobile: { vertical: 140, horizontal: 140, minDistance: 110 },
                tablet: { vertical: 180, horizontal: 220, minDistance: 140 },
                desktop: { vertical: 220, horizontal: 280, minDistance: 160 },
            },
        },
        animations: {
            nodeEntry: { type: 'scale', duration: 700, delay: 120 },
            pathDraw: { type: 'pulse', duration: 900 },
            completion: { type: 'explosion', duration: 1500 },
            hover: { scale: 1.12, glow: true, duration: 320 },
        },
        effects: {
            particles: { enabled: true, type: 'stars', count: 80, speed: 0.4 },
            glow: { enabled: true, intensity: 0.9, color: '#EC4899' },
            shadows: { enabled: true, blur: 25, color: 'rgba(139, 92, 246, 0.4)' },
            background: { type: 'animated', customClass: 'space-bg' },
        },
        themeClass: 'theme-space-odyssey',
    },
    "dragons-lair": {
        id: "dragons-lair",
        name: "Dragon's Lair",
        description: "Fantasy RPG with dungeon path layout",
        tagline: "Conquer the Dragon's Challenge",
        isPremium: true,
        price: 2.99,
        layout: "dungeon",
        colors: {
            primary: "#EF4444",
            secondary: "#F97316",
            accent: "#FBBF24",
            background: "#1A0A0A",
            backgroundCard: "#2E1A1A",
            textPrimary: "#FEE2E2",
            textSecondary: "#FECACA",
            textMuted: "#FCA5A5",
            success: "#10B981",
            warning: "#F59E0B",
            error: "#EF4444",
            nodeCompleted: "#F97316",
            nodeActive: "#EF4444",
            nodeLocked: "#6B7280",
            path: {
                inactive: "#1F2937",
                active: "#EF4444",
                completed: "#F97316",
            },
        },
        previewGradient: "from-red-600 via-orange-500 to-yellow-500",
        previewIcon: "🐉",
        positioning: {
            strategy: "dungeon",
            spacing: { vertical: 190, horizontal: 240, minDistance: 140 },
            preventOverlap: true,
            responsive: {
                mobile: { vertical: 130, horizontal: 110, minDistance: 95 },
                tablet: { vertical: 160, horizontal: 180, minDistance: 120 },
                desktop: { vertical: 190, horizontal: 240, minDistance: 140 },
            },
        },
        animations: {
            nodeEntry: { type: 'bounce', duration: 750, delay: 130 },
            pathDraw: { type: 'draw', duration: 850 },
            completion: { type: 'explosion', duration: 1300 },
            hover: { scale: 1.09, glow: true, duration: 340 },
        },
        effects: {
            particles: { enabled: true, type: 'fire', count: 35, speed: 0.6 },
            glow: { enabled: true, intensity: 0.85, color: '#EF4444' },
            shadows: { enabled: true, blur: 22, color: 'rgba(239, 68, 68, 0.35)' },
            background: { type: 'pattern', customClass: 'dungeon-bg' },
        },
        themeClass: 'theme-dragons-lair',
    },
    "ocean-depths": {
        id: "ocean-depths",
        name: "Ocean Depths",
        description: "Underwater theme with wave layout",
        tagline: "Dive Into Deep Learning",
        isPremium: true,
        price: 2.99,
        layout: "wave",
        colors: {
            primary: "#06B6D4",
            secondary: "#0891B2",
            accent: "#14B8A6",
            background: "#0A1A1F",
            backgroundCard: "#1A2E33",
            textPrimary: "#CCFBF1",
            textSecondary: "#99F6E4",
            textMuted: "#5EEAD4",
            success: "#10B981",
            warning: "#F59E0B",
            error: "#EF4444",
            nodeCompleted: "#14B8A6",
            nodeActive: "#06B6D4",
            nodeLocked: "#475569",
            path: {
                inactive: "#1F2937",
                active: "#06B6D4",
                completed: "#14B8A6",
            },
        },
        previewGradient: "from-cyan-500 via-teal-500 to-blue-500",
        previewIcon: "🌊",
        positioning: {
            strategy: "wave",
            spacing: { vertical: 170, horizontal: 200, minDistance: 130 },
            preventOverlap: true,
            responsive: {
                mobile: { vertical: 120, horizontal: 100, minDistance: 90 },
                tablet: { vertical: 150, horizontal: 160, minDistance: 110 },
                desktop: { vertical: 170, horizontal: 200, minDistance: 130 },
            },
        },
        animations: {
            nodeEntry: { type: 'slide', duration: 650, delay: 110 },
            pathDraw: { type: 'flow', duration: 950 },
            completion: { type: 'ripple', duration: 1100 },
            hover: { scale: 1.07, glow: true, duration: 330 },
        },
        effects: {
            particles: { enabled: true, type: 'bubbles', count: 60, speed: 0.35 },
            glow: { enabled: true, intensity: 0.7, color: '#06B6D4' },
            shadows: { enabled: true, blur: 18, color: 'rgba(6, 182, 212, 0.25)' },
            background: { type: 'animated', customClass: 'ocean-bg' },
        },
        themeClass: 'theme-ocean-depths',
    },
};

export const DEFAULT_SKIN: SkinId = "cyber-neon";

// Helper function to get skin config
export function getSkinConfig(skinId: SkinId): SkinConfig {
    return SKIN_CONFIGS[skinId];
}

// Helper function to get responsive spacing based on screen width
export function getResponsiveSpacing(skin: SkinConfig, screenWidth: number) {
    if (screenWidth < 768) {
        return skin.positioning.responsive.mobile;
    } else if (screenWidth < 1024) {
        return skin.positioning.responsive.tablet;
    } else {
        return skin.positioning.responsive.desktop;
    }
}

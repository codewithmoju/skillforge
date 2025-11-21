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
}

export interface SkinConfig {
    id: SkinId;
    name: string;
    description: string;
    isPremium: boolean;
    layout: LayoutType;
    colors: SkinColors;
    previewGradient: string;
    previewIcon: string;
}

export const SKIN_CONFIGS: Record<SkinId, SkinConfig> = {
    "cyber-neon": {
        id: "cyber-neon",
        name: "Cyber Neon",
        description: "Futuristic tech theme with glowing nodes",
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
        },
        previewGradient: "from-indigo-500 via-purple-500 to-cyan-500",
        previewIcon: "⚡",
    },
    "forest-quest": {
        id: "forest-quest",
        name: "Forest Quest",
        description: "Nature-themed with tree branch layout",
        isPremium: true,
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
        },
        previewGradient: "from-green-500 via-emerald-500 to-amber-500",
        previewIcon: "🌲",
    },
    "space-odyssey": {
        id: "space-odyssey",
        name: "Space Odyssey",
        description: "Cosmic theme with orbital layout",
        isPremium: true,
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
        },
        previewGradient: "from-purple-600 via-pink-500 to-blue-500",
        previewIcon: "🚀",
    },
    "dragons-lair": {
        id: "dragons-lair",
        name: "Dragon's Lair",
        description: "Fantasy RPG with dungeon path layout",
        isPremium: true,
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
        },
        previewGradient: "from-red-600 via-orange-500 to-yellow-500",
        previewIcon: "🐉",
    },
    "ocean-depths": {
        id: "ocean-depths",
        name: "Ocean Depths",
        description: "Underwater theme with wave layout",
        isPremium: true,
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
        },
        previewGradient: "from-cyan-500 via-teal-500 to-blue-500",
        previewIcon: "🌊",
    },
};

export const DEFAULT_SKIN: SkinId = "cyber-neon";


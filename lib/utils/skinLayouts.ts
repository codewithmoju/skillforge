import { RoadmapDefinition } from "@/lib/store";
import { SkinConfig, getResponsiveSpacing } from "@/lib/types/skins";

export interface NodePosition {
    x: number;
    y: number;
    level: number;
}

export interface LayoutResult {
    positions: Map<string, NodePosition>;
    width: number;
    height: number;
}

/**
 * Calculate node positions based on skin layout strategy
 */
export function calculateNodePositions(
    nodes: RoadmapDefinition[],
    skin: SkinConfig,
    screenWidth: number
): LayoutResult {
    const spacing = getResponsiveSpacing(skin, screenWidth);

    if (!nodes || nodes.length === 0) {
        return {
            positions: new Map(),
            width: 400,
            height: 400,
        };
    }

    switch (skin.layout) {
        case 'vertical':
            return calculateVerticalLayout(nodes, spacing);
        case 'tree':
            return calculateForestVineLayout(nodes, spacing, screenWidth);
        case 'orbital':
            return calculateOrbitalLayout(nodes, spacing);
        case 'dungeon':
            return calculateDungeonLayout(nodes, spacing);
        case 'wave':
            return calculateWaveLayout(nodes, spacing);
        default:
            return calculateVerticalLayout(nodes, spacing);
    }
}

/**
 * VERTICAL LAYOUT (Cyber Neon)
 * Nodes arranged in a straight vertical line, centered horizontally
 */
function calculateVerticalLayout(
    nodes: RoadmapDefinition[],
    spacing: { vertical: number; horizontal: number; minDistance: number }
): LayoutResult {
    const positions = new Map<string, NodePosition>();
    const containerWidth = 800;
    const centerX = containerWidth / 2;

    nodes.forEach((node, index) => {
        positions.set(node.id, {
            x: centerX,
            y: 100 + (index * spacing.vertical), // Start with 100px padding from top
            level: node.level,
        });
    });

    return {
        positions,
        width: containerWidth,
        height: 100 + (nodes.length - 1) * spacing.vertical + 200,
    };
}

/**
 * FOREST VINE LAYOUT (Forest Quest)
 * Nodes are placed along a winding "Jungle Path" that traverses the screen.
 * Creates a gamified "level map" feel.
 */
function calculateForestVineLayout(
    nodes: RoadmapDefinition[],
    spacing: { vertical: number; horizontal: number; minDistance: number },
    screenWidth: number
): LayoutResult {
    const positions = new Map<string, NodePosition>();

    // Dynamic container width based on available space
    const containerWidth = screenWidth;
    const centerX = containerWidth / 2;

    // Path Configuration
    const isMobile = screenWidth < 768;

    // Amplitude: How wide the path swings side-to-side
    // Mobile: Less swing to keep it readable on narrow screens
    // Desktop: Wide, sweeping curves for the "Deep Jungle" feel
    const maxAmplitude = isMobile ? screenWidth * 0.35 : Math.min(screenWidth * 0.45, 600);
    const amplitude = Math.max(150, maxAmplitude);

    // Frequency: How tight the curves are. Lower = longer, more sweeping curves.
    const frequency = isMobile ? 0.6 : 0.4;

    // Vertical Spacing: Distance between nodes along the Y-axis
    const verticalSpacing = isMobile ? spacing.vertical * 0.8 : spacing.vertical;

    let maxX = centerX;
    let minX = centerX;
    let maxY = 0;

    nodes.forEach((node, index) => {
        // Calculate position along the sine wave path
        // t represents the "progress" along the curve
        const t = index * frequency;

        // Primary Sine Wave for the main path shape
        const primaryWave = Math.sin(t);

        // Secondary Wave adds a bit of "organic" irregularity so it's not a perfect math sine
        const secondaryWave = Math.cos(t * 0.7) * 0.2;

        // Calculate X position: Center + (Amplitude * Combined Wave)
        // We alternate the starting direction based on index to ensure flow
        const xOffset = amplitude * (primaryWave + secondaryWave);
        const x = centerX + xOffset;

        // Calculate Y position: Simple linear progression down the screen
        // Add a small random offset for "organic" feel, but keep it deterministic based on index
        const randomY = (index % 3 === 0) ? 20 : (index % 3 === 1) ? -10 : 0;
        const y = 100 + (index * verticalSpacing) + randomY;

        positions.set(node.id, {
            x,
            y,
            level: node.level,
        });

        // Track bounds for container sizing
        maxX = Math.max(maxX, x);
        minX = Math.min(minX, x);
        maxY = Math.max(maxY, y);
    });

    // Calculate total width needed (with padding)
    // Ensure we have enough space for the widest swing + node width
    const contentWidth = (maxX - minX) + 200; // Add padding for node visuals
    const totalWidth = Math.max(screenWidth, contentWidth);

    return {
        positions,
        width: totalWidth,
        height: maxY + 300, // Extra padding at bottom for "end of path" visuals
    };
}

/**
 * TREE LAYOUT (Forest Quest)
 * Nodes branch out like a skill tree
 * Each level can have multiple nodes side by side
 */
function calculateTreeLayout(
    nodes: RoadmapDefinition[],
    spacing: { vertical: number; horizontal: number; minDistance: number }
): LayoutResult {
    const positions = new Map<string, NodePosition>();

    // Group nodes by level
    const levelGroups = new Map<number, RoadmapDefinition[]>();
    nodes.forEach(node => {
        if (!levelGroups.has(node.level)) {
            levelGroups.set(node.level, []);
        }
        levelGroups.get(node.level)!.push(node);
    });

    let maxWidth = 0;

    // Position each level
    levelGroups.forEach((levelNodes, level) => {
        const nodesInLevel = levelNodes.length;
        const levelWidth = (nodesInLevel - 1) * spacing.horizontal;
        maxWidth = Math.max(maxWidth, levelWidth);

        // Center the level
        const startX = -levelWidth / 2;

        levelNodes.forEach((node, index) => {
            positions.set(node.id, {
                x: startX + (index * spacing.horizontal),
                y: (level - 1) * spacing.vertical,
                level: node.level,
            });
        });
    });

    return {
        positions,
        width: maxWidth + 400,
        height: (levelGroups.size - 1) * spacing.vertical + 200,
    };
}

/**
 * ORBITAL LAYOUT (Space Odyssey)
 * Nodes arranged in circular orbits
 * Each level is a different orbital ring
 */
function calculateOrbitalLayout(
    nodes: RoadmapDefinition[],
    spacing: { vertical: number; horizontal: number; minDistance: number }
): LayoutResult {
    const positions = new Map<string, NodePosition>();
    const centerX = 0;
    const centerY = 0;

    // Group nodes by level
    const levelGroups = new Map<number, RoadmapDefinition[]>();
    nodes.forEach(node => {
        if (!levelGroups.has(node.level)) {
            levelGroups.set(node.level, []);
        }
        levelGroups.get(node.level)!.push(node);
    });

    let maxRadius = 0;

    // Position each level in orbital rings
    levelGroups.forEach((levelNodes, level) => {
        const radius = level * spacing.vertical;
        maxRadius = Math.max(maxRadius, radius);
        const nodesInLevel = levelNodes.length;
        const angleStep = (2 * Math.PI) / nodesInLevel;

        levelNodes.forEach((node, index) => {
            const angle = index * angleStep - Math.PI / 2; // Start from top
            positions.set(node.id, {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                level: node.level,
            });
        });
    });

    return {
        positions,
        width: maxRadius * 2 + 400,
        height: maxRadius * 2 + 400,
    };
}

/**
 * DUNGEON LAYOUT (Dragon's Lair)
 * Nodes arranged in a winding dungeon path
 * Alternates left and right with slight randomness
 */
function calculateDungeonLayout(
    nodes: RoadmapDefinition[],
    spacing: { vertical: number; horizontal: number; minDistance: number }
): LayoutResult {
    const positions = new Map<string, NodePosition>();
    let maxX = 0;
    let minX = 0;

    nodes.forEach((node, index) => {
        // Alternate left and right with some variation
        const direction = index % 2 === 0 ? 1 : -1;
        const variation = (index % 3) * 50; // Add some variation
        const x = direction * (spacing.horizontal / 2 + variation);
        const y = index * spacing.vertical;

        positions.set(node.id, {
            x,
            y,
            level: node.level,
        });

        maxX = Math.max(maxX, x);
        minX = Math.min(minX, x);
    });

    return {
        positions,
        width: maxX - minX + 400,
        height: (nodes.length - 1) * spacing.vertical + 200,
    };
}

/**
 * WAVE LAYOUT (Ocean Depths)
 * Nodes arranged in a flowing wave pattern
 * Uses sine wave for smooth flowing effect
 */
function calculateWaveLayout(
    nodes: RoadmapDefinition[],
    spacing: { vertical: number; horizontal: number; minDistance: number }
): LayoutResult {
    const positions = new Map<string, NodePosition>();
    const amplitude = spacing.horizontal; // Wave height
    const frequency = 0.5; // Wave frequency
    let maxX = 0;
    let minX = 0;

    nodes.forEach((node, index) => {
        const y = index * spacing.vertical;
        const x = amplitude * Math.sin(index * frequency);

        positions.set(node.id, {
            x,
            y,
            level: node.level,
        });

        maxX = Math.max(maxX, x);
        minX = Math.min(minX, x);
    });

    return {
        positions,
        width: maxX - minX + 400,
        height: (nodes.length - 1) * spacing.vertical + 200,
    };
}

/**
 * Check if two nodes overlap
 */
function checkOverlap(
    pos1: NodePosition,
    pos2: NodePosition,
    minDistance: number
): boolean {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < minDistance;
}

/**
 * Adjust positions to prevent overlaps
 * Now properly moves BOTH nodes and iterates to convergence
 */
export function preventOverlaps(
    positions: Map<string, NodePosition>,
    minDistance: number,
    maxIterations: number = 10
): Map<string, NodePosition> {
    // Create a deep copy to avoid mutations
    const adjusted = new Map(
        Array.from(positions.entries()).map(([k, v]) => [k, { ...v }])
    );
    const nodeIds = Array.from(adjusted.keys());

    // Iterate until no overlaps or max iterations reached
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let hasOverlap = false;

        for (let i = 0; i < nodeIds.length; i++) {
            for (let j = i + 1; j < nodeIds.length; j++) {
                const pos1 = adjusted.get(nodeIds[i])!;
                const pos2 = adjusted.get(nodeIds[j])!;

                if (checkOverlap(pos1, pos2, minDistance)) {
                    hasOverlap = true;

                    // Calculate push vector
                    const dx = pos2.x - pos1.x;
                    const dy = pos2.y - pos1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Avoid division by zero
                    if (distance < 0.1) {
                        // Nodes are at same position, push them apart arbitrarily
                        pos1.x -= minDistance / 2;
                        pos2.x += minDistance / 2;
                        continue;
                    }

                    const pushDistance = (minDistance - distance) / 2;
                    const angle = Math.atan2(dy, dx);
                    const pushX = pushDistance * Math.cos(angle);
                    const pushY = pushDistance * Math.sin(angle);

                    // Move BOTH nodes apart (not just one!)
                    pos1.x -= pushX;
                    pos1.y -= pushY;
                    pos2.x += pushX;
                    pos2.y += pushY;
                }
            }
        }

        // If no overlaps found, we've converged
        if (!hasOverlap) break;
    }

    return adjusted;
}

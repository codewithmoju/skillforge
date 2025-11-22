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
            return calculateForestVineLayout(nodes, spacing);
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
 * Nodes arranged in a straight vertical line
 */
function calculateVerticalLayout(
    nodes: RoadmapDefinition[],
    spacing: { vertical: number; horizontal: number; minDistance: number }
): LayoutResult {
    const positions = new Map<string, NodePosition>();
    const centerX = 0; // Center of container

    nodes.forEach((node, index) => {
        positions.set(node.id, {
            x: centerX,
            y: index * spacing.vertical,
            level: node.level,
        });
    });

    return {
        positions,
        width: 400, // Fixed width for vertical layout
        height: (nodes.length - 1) * spacing.vertical + 200,
    };
}

/**
 * FOREST VINE LAYOUT (Forest Quest)
 * Nodes grow along a winding organic vine
 * Replaces the rigid tree structure
 */
function calculateForestVineLayout(
    nodes: RoadmapDefinition[],
    spacing: { vertical: number; horizontal: number; minDistance: number }
): LayoutResult {
    const positions = new Map<string, NodePosition>();
    const amplitude = spacing.horizontal * 0.8; // Vine sway width
    const frequency = 0.6; // Vine sway frequency
    let maxX = 0;
    let minX = 0;

    nodes.forEach((node, index) => {
        // Main vine follows a sine wave
        const vineX = amplitude * Math.sin(index * frequency);
        const vineY = index * spacing.vertical;

        // Nodes branch off the vine
        // Alternate left/right based on index
        const branchSide = index % 2 === 0 ? 1 : -1;
        const branchLength = spacing.horizontal * 0.6;

        // Add some organic randomness to branch angle
        const randomAngle = (Math.random() * 0.4) - 0.2; // +/- 0.2 radians

        const x = vineX + (branchSide * branchLength * Math.cos(randomAngle));
        const y = vineY + (branchSide * branchLength * Math.sin(randomAngle));

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
        width: Math.max(400, (maxX - minX) + 200),
        height: (nodes.length - 1) * spacing.vertical + 200,
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
 */
export function preventOverlaps(
    positions: Map<string, NodePosition>,
    minDistance: number
): Map<string, NodePosition> {
    const adjusted = new Map(positions);
    const nodeIds = Array.from(adjusted.keys());

    // Simple overlap prevention - push nodes apart if too close
    for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
            const pos1 = adjusted.get(nodeIds[i])!;
            const pos2 = adjusted.get(nodeIds[j])!;

            if (checkOverlap(pos1, pos2, minDistance)) {
                // Push nodes apart
                const dx = pos2.x - pos1.x;
                const dy = pos2.y - pos1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const pushDistance = (minDistance - distance) / 2;

                const angle = Math.atan2(dy, dx);
                pos2.x += pushDistance * Math.cos(angle);
                pos2.y += pushDistance * Math.sin(angle);
            }
        }
    }

    return adjusted;
}

"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

interface SkillNode {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    label?: string;
    connections: number[];
}

const skills: SkillNode[] = [
    { id: 0, x: 50, y: 50, size: 20, color: "#6366f1", label: "AI Core", connections: [1, 2, 3, 4] },
    { id: 1, x: 30, y: 30, size: 12, color: "#8b5cf6", label: "React", connections: [0] },
    { id: 2, x: 70, y: 30, size: 12, color: "#ec4899", label: "Python", connections: [0] },
    { id: 3, x: 30, y: 70, size: 12, color: "#06b6d4", label: "Data", connections: [0] },
    { id: 4, x: 70, y: 70, size: 12, color: "#10b981", label: "Design", connections: [0] },
    { id: 5, x: 20, y: 50, size: 8, color: "#8b5cf6", connections: [1] },
    { id: 6, x: 40, y: 20, size: 8, color: "#8b5cf6", connections: [1] },
    { id: 7, x: 80, y: 50, size: 8, color: "#10b981", connections: [4] },
    { id: 8, x: 60, y: 80, size: 8, color: "#10b981", connections: [4] },
];

export function SkillUniverse() {
    return (
        <div className="relative w-full h-[600px] flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {skills.map((skill) =>
                    skill.connections.map((targetId) => {
                        const target = skills.find((s) => s.id === targetId);
                        if (!target) return null;
                        return (
                            <motion.line
                                key={`${skill.id}-${targetId}`}
                                x1={`${skill.x}%`}
                                y1={`${skill.y}%`}
                                x2={`${target.x}%`}
                                y2={`${target.y}%`}
                                stroke={skill.color}
                                strokeWidth="1"
                                strokeOpacity="0.2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.2 }}
                                transition={{ duration: 2, delay: 1 }}
                            />
                        );
                    })
                )}
            </svg>

            {skills.map((skill) => (
                <motion.div
                    key={skill.id}
                    className="absolute rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/10"
                    style={{
                        left: `${skill.x}%`,
                        top: `${skill.y}%`,
                        width: skill.size * 4,
                        height: skill.size * 4,
                        backgroundColor: `${skill.color}20`,
                        borderColor: `${skill.color}40`,
                        x: "-50%",
                        y: "-50%",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: skill.id * 0.1 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                >
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: skill.color }}
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    {skill.label && (
                        <span className="text-xs font-bold text-white z-10 pointer-events-none">
                            {skill.label}
                        </span>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

"use client";

import { useEffect, useRef } from "react";
import { SkinConfig } from "@/lib/types/skins";

interface ParticleSystemProps {
    skin: SkinConfig;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
}

export function ParticleSystem({ skin }: ParticleSystemProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initialize particles
        const initParticles = () => {
            particlesRef.current = [];
            const count = skin.effects.particles.count;

            for (let i = 0; i < count; i++) {
                particlesRef.current.push(createParticle());
            }
        };

        // Create a single particle based on skin type
        const createParticle = (): Particle => {
            const { type, speed } = skin.effects.particles;

            switch (type) {
                case 'stars':
                    return {
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * speed,
                        vy: (Math.random() - 0.5) * speed,
                        size: Math.random() * 2 + 1,
                        opacity: Math.random() * 0.5 + 0.3,
                        color: '#ffffff',
                    };

                case 'leaves':
                    return {
                        x: Math.random() * canvas.width,
                        y: -10,
                        vx: (Math.random() - 0.5) * speed * 0.5,
                        vy: speed * 0.8,
                        size: Math.random() * 8 + 4,
                        opacity: Math.random() * 0.4 + 0.3,
                        color: Math.random() > 0.5 ? '#22C55E' : '#10B981',
                    };

                case 'bubbles':
                    return {
                        x: Math.random() * canvas.width,
                        y: canvas.height + 10,
                        vx: (Math.random() - 0.5) * speed * 0.3,
                        vy: -speed * 0.6,
                        size: Math.random() * 6 + 3,
                        opacity: Math.random() * 0.3 + 0.2,
                        color: '#06B6D4',
                    };

                case 'fire':
                    return {
                        x: Math.random() * canvas.width,
                        y: canvas.height + 10,
                        vx: (Math.random() - 0.5) * speed * 0.4,
                        vy: -speed * 1.2,
                        size: Math.random() * 5 + 2,
                        opacity: Math.random() * 0.6 + 0.3,
                        color: Math.random() > 0.5 ? '#EF4444' : '#F97316',
                    };

                case 'code':
                    return {
                        x: Math.random() * canvas.width,
                        y: -10,
                        vx: 0,
                        vy: speed * 1.5,
                        size: 12,
                        opacity: Math.random() * 0.5 + 0.3,
                        color: '#22C55E',
                    };

                default:
                    return {
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: 0,
                        vy: 0,
                        size: 2,
                        opacity: 0.5,
                        color: '#ffffff',
                    };
            }
        };

        // Update particle position
        const updateParticle = (particle: Particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around screen
            if (particle.x < -10) particle.x = canvas.width + 10;
            if (particle.x > canvas.width + 10) particle.x = -10;
            if (particle.y < -10) particle.y = canvas.height + 10;
            if (particle.y > canvas.height + 10) particle.y = -10;

            // Twinkle effect for stars
            if (skin.effects.particles.type === 'stars') {
                particle.opacity += (Math.random() - 0.5) * 0.02;
                particle.opacity = Math.max(0.1, Math.min(0.8, particle.opacity));
            }

            // Fade for fire
            if (skin.effects.particles.type === 'fire') {
                particle.opacity -= 0.01;
                if (particle.opacity <= 0) {
                    Object.assign(particle, createParticle());
                }
            }
        };

        // Draw particle
        const drawParticle = (particle: Particle) => {
            ctx.save();
            ctx.globalAlpha = particle.opacity;

            switch (skin.effects.particles.type) {
                case 'stars':
                    // Draw star
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case 'leaves':
                    // Draw leaf shape
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.ellipse(particle.x, particle.y, particle.size, particle.size * 1.5, Math.PI / 4, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case 'bubbles':
                    // Draw bubble with gradient
                    const gradient = ctx.createRadialGradient(
                        particle.x, particle.y, 0,
                        particle.x, particle.y, particle.size
                    );
                    gradient.addColorStop(0, particle.color + '80');
                    gradient.addColorStop(0.5, particle.color + '40');
                    gradient.addColorStop(1, particle.color + '00');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    // Bubble outline
                    ctx.strokeStyle = particle.color + '60';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    break;

                case 'fire':
                    // Draw fire particle
                    const fireGradient = ctx.createRadialGradient(
                        particle.x, particle.y, 0,
                        particle.x, particle.y, particle.size
                    );
                    fireGradient.addColorStop(0, particle.color);
                    fireGradient.addColorStop(1, particle.color + '00');
                    ctx.fillStyle = fireGradient;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;

                case 'code':
                    // Draw matrix-style code character
                    ctx.fillStyle = particle.color;
                    ctx.font = `${particle.size}px monospace`;
                    const chars = '01';
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(char, particle.x, particle.y);
                    break;

                default:
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
            }

            ctx.restore();
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach(particle => {
                updateParticle(particle);
                drawParticle(particle);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [skin]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}

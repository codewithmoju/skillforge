"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Loader2, Mail, Lock, ArrowLeft, Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePerformance } from "@/lib/hooks/usePerformance";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Animated gradient mesh background
function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Gradient orbs */}
            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-accent-indigo/30 to-accent-violet/30 blur-3xl"
                animate={{
                    x: ["-25%", "25%", "-25%"],
                    y: ["-25%", "25%", "-25%"],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ top: "10%", left: "10%" }}
            />
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent-cyan/30 to-blue-500/30 blur-3xl"
                animate={{
                    x: ["25%", "-25%", "25%"],
                    y: ["25%", "-25%", "25%"],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ bottom: "10%", right: "10%" }}
            />
            <motion.div
                className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl"
                animate={{
                    x: [0, "50%", 0],
                    y: ["50%", 0, "50%"],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ top: "50%", left: "50%" }}
            />

            {/* Floating particles */}
            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50 - 25, 0],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                />
            ))}

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        </div>
    );
}

// Floating geometric shapes
function FloatingShapes() {
    const shapes = [
        { size: 100, delay: 0, duration: 15, path: "M50,0 L100,50 L50,100 L0,50 Z" },
        { size: 80, delay: 2, duration: 12, path: "M40,0 L80,40 L40,80 L0,40 Z" },
        { size: 60, delay: 4, duration: 18, path: "M30,0 L60,30 L30,60 L0,30 Z" },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    animate={{
                        y: [0, -200, 0],
                        x: [0, 100, 0],
                        rotate: [0, 360],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: shape.duration,
                        repeat: Infinity,
                        delay: shape.delay,
                        ease: "easeInOut",
                    }}
                    style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`,
                    }}
                >
                    <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
                        <path
                            d={shape.path}
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            opacity="0.5"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const { loginWithEmail, loginWithGoogle, resetPassword } = useAuth();
    const { shouldReduceAnimations } = usePerformance();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetSent, setResetSent] = useState(false);
    const [view, setView] = useState<"login" | "reset">("login");

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await loginWithEmail(email, password);
            router.push("/roadmap");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await loginWithGoogle();
            router.push("/roadmap");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await resetPassword(email);
            setResetSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background - Only on high-performance devices */}
            {!shouldReduceAnimations && (
                <>
                    <AnimatedBackground />
                    <FloatingShapes />
                </>
            )}

            {/* Simple gradient background for low-end devices */}
            {shouldReduceAnimations && (
                <div className="absolute inset-0 bg-gradient-to-br from-accent-indigo/10 via-transparent to-accent-cyan/10" />
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Back to Home Link */}
                <Link href="/">
                    <motion.div
                        whileHover={{ x: -5 }}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </motion.div>
                </Link>

                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex justify-center mb-6"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shadow-2xl shadow-accent-indigo/50 overflow-hidden">
                            <Image
                                src="/icons/MyLogo.png"
                                alt="EduMate AI Logo"
                                width={64}
                                height={64}
                                className="object-contain"
                            />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold text-white mb-2"
                    >
                        {view === "login" ? "Welcome Back" : "Reset Password"}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400"
                    >
                        {view === "login"
                            ? "Enter your credentials to access your account"
                            : "Enter your email to receive a reset link"}
                    </motion.p>
                </div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative group"
                >
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-indigo to-accent-cyan rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />

                    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {resetSent && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
                                >
                                    Password reset email sent! Check your inbox.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {view === "login" ? (
                            <form onSubmit={handleEmailLogin} className="space-y-5">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Email
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-indigo transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-indigo transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-12 py-3.5 text-white focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setView("reset");
                                            setError(null);
                                            setResetSent(false);
                                        }}
                                        className="text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg bg-gradient-to-r from-accent-indigo to-accent-violet hover:from-accent-indigo/90 hover:to-accent-violet/90 shadow-lg shadow-accent-indigo/25"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                                    </Button>
                                </motion.div>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-slate-900 text-slate-500">Or continue with</span>
                                    </div>
                                </div>

                                {/* Google Login */}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-12 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                                        onClick={handleGoogleLogin}
                                        disabled={loading}
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Google
                                    </Button>
                                </motion.div>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordReset} className="space-y-5">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Email
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-indigo transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg bg-gradient-to-r from-accent-indigo to-accent-violet hover:from-accent-indigo/90 hover:to-accent-violet/90 shadow-lg shadow-accent-indigo/25"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                                    </Button>
                                </motion.div>

                                {/* Back to Login */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setView("login");
                                        setError(null);
                                    }}
                                    className="w-full text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                    Back to login
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>

                {/* Sign Up Link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8 text-slate-400"
                >
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors">
                        Sign up
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
}

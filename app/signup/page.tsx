"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2, Mail, Lock, User, AlertCircle, AtSign, ArrowLeft, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePerformance } from "@/lib/hooks/usePerformance";
import { validateUsername, checkUsernameAvailability, reserveUsername } from "@/lib/services/username";
import { createUserData } from "@/lib/services/firestore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Aurora/Northern Lights Background
function AuroraBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Aurora waves */}
            <motion.div
                className="absolute w-full h-full"
                style={{
                    background: "linear-gradient(45deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3), rgba(236,72,153,0.3), rgba(59,130,246,0.3))",
                    filter: "blur(100px)",
                }}
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Gradient orbs */}
            {[
                { color: "from-violet-500/40 to-purple-500/40", x: "20%", y: "20%", scale: [1, 1.3, 1], duration: 15 },
                { color: "from-cyan-500/40 to-blue-500/40", x: "80%", y: "30%", scale: [1.2, 1, 1.2], duration: 18 },
                { color: "from-pink-500/40 to-rose-500/40", x: "50%", y: "70%", scale: [1.1, 1.4, 1.1], duration: 12 },
            ].map((orb, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r ${orb.color} blur-3xl`}
                    style={{ left: orb.x, top: orb.y }}
                    animate={{
                        scale: orb.scale,
                        x: [0, 50, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Floating light particles */}
            {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -150, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: Math.random() * 8 + 8,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}

            {/* Animated grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        </div>
    );
}

// Liquid blob shapes
function LiquidBlobs() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                            result="goo"
                        />
                    </filter>
                    <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
                    </linearGradient>
                </defs>

                {[0, 1, 2].map((i) => (
                    <motion.circle
                        key={i}
                        cx={`${30 + i * 30}%`}
                        cy={`${40 + i * 20}%`}
                        r="100"
                        fill="url(#blob-gradient)"
                        filter="url(#goo)"
                        animate={{
                            cx: [`${30 + i * 30}%`, `${40 + i * 30}%`, `${30 + i * 30}%`],
                            cy: [`${40 + i * 20}%`, `${50 + i * 20}%`, `${40 + i * 20}%`],
                            r: [100, 150, 100],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export default function SignupPage() {
    const router = useRouter();
    const { signUpWithEmail, loginWithGoogle } = useAuth();
    const { shouldReduceAnimations } = usePerformance();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Password strength calculation
    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return { strength: 0, label: "", color: "" };
        let strength = 0;
        if (pwd.length >= 6) strength++;
        if (pwd.length >= 10) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z\d]/.test(pwd)) strength++;

        const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
        const colors = ["text-red-500", "text-orange-500", "text-yellow-500", "text-green-500", "text-emerald-500"];
        return { strength, label: labels[strength - 1] || "", color: colors[strength - 1] || "" };
    };

    const passwordStrength = getPasswordStrength(password);

    const handleUsernameChange = async (value: string) => {
        setUsername(value);
        setUsernameAvailable(null);

        const validation = validateUsername(value);
        if (!validation.valid) {
            return;
        }

        setCheckingUsername(true);
        try {
            const available = await checkUsernameAvailability(value);
            setUsernameAvailable(available);
        } catch (err) {
            console.error(err);
        } finally {
            setCheckingUsername(false);
        }
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !displayName || !username) {
            setError("Please fill in all required fields");
            return;
        }

        const validation = validateUsername(username);
        if (!validation.valid) {
            setError(validation.error || "Invalid username");
            return;
        }

        if (!usernameAvailable) {
            setError("Please choose an available username");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userCredential = await signUpWithEmail(email, password, displayName);
            await reserveUsername(username, userCredential.user.uid);
            await createUserData(
                userCredential.user.uid,
                email,
                displayName,
                username,
                profilePicture
            );
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

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden py-20">
            {/* Animated Background - Only on high-performance devices */}
            {!shouldReduceAnimations && (
                <>
                    <AuroraBackground />
                    <LiquidBlobs />
                </>
            )}

            {/* Simple gradient background for low-end devices */}
            {shouldReduceAnimations && (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
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
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex justify-center mb-6"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-cyan flex items-center justify-center shadow-2xl shadow-accent-indigo/50 overflow-hidden">
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
                        Create Account
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400"
                    >
                        Join the community and start learning
                    </motion.p>
                </div>

                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative group"
                >
                    {/* Animated glow effect */}
                    <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan rounded-3xl blur opacity-20"
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                        }}
                    />

                    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleEmailSignup} className="space-y-5">
                            {/* Profile Picture */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex justify-center mb-6"
                            >
                                <ImageUpload
                                    value={profilePicture}
                                    onChange={setProfilePicture}
                                    label="Profile Picture"
                                />
                            </motion.div>

                            {/* Display Name */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Display Name
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-indigo transition-colors" />
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </motion.div>

                            {/* Username */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Username
                                </label>
                                <div className="relative group">
                                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-indigo transition-colors" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => handleUsernameChange(e.target.value)}
                                        className={cn(
                                            "w-full bg-slate-800/50 border rounded-xl pl-12 pr-12 py-3.5 text-white focus:outline-none transition-all",
                                            usernameAvailable === true && "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
                                            usernameAvailable === false && "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
                                            usernameAvailable === null && "border-slate-700 focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20"
                                        )}
                                        placeholder="johndoe"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        {checkingUsername && (
                                            <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
                                        )}
                                        {!checkingUsername && usernameAvailable === true && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            </motion.div>
                                        )}
                                        {!checkingUsername && usernameAvailable === false && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            >
                                                <AlertCircle className="w-5 h-5 text-red-500" />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                                <AnimatePresence>
                                    {usernameAvailable === true && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="text-xs text-green-400 mt-1"
                                        >
                                            Username is available!
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                                <p className="text-xs text-slate-500 mt-1">3-20 characters, letters, numbers, and underscores only</p>
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
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
                            </motion.div>

                            {/* Password */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                            >
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
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                <AnimatePresence>
                                    {password && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-2"
                                        >
                                            <div className="flex gap-1 mb-1">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <motion.div
                                                        key={level}
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: level <= passwordStrength.strength ? 1 : 0 }}
                                                        className={cn(
                                                            "h-1 flex-1 rounded-full transition-colors",
                                                            level <= passwordStrength.strength
                                                                ? passwordStrength.strength === 1
                                                                    ? "bg-red-500"
                                                                    : passwordStrength.strength === 2
                                                                        ? "bg-orange-500"
                                                                        : passwordStrength.strength === 3
                                                                            ? "bg-yellow-500"
                                                                            : passwordStrength.strength === 4
                                                                                ? "bg-green-500"
                                                                                : "bg-emerald-500"
                                                                : "bg-slate-700"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <p className={cn("text-xs", passwordStrength.color)}>
                                                {passwordStrength.label}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-lg bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan hover:from-accent-indigo/90 hover:via-accent-violet/90 hover:to-accent-cyan/90 shadow-lg shadow-accent-indigo/25 mt-6"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
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

                            {/* Google Signup */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
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
                    </div>
                </motion.div>

                {/* Login Link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-center mt-8 text-slate-400"
                >
                    Already have an account?{" "}
                    <Link href="/login" className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors">
                        Log in
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
}

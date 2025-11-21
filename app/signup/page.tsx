"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Loader2, Mail, Lock, AlertCircle, AtSign, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { validateUsername, checkUsernameAvailability, reserveUsername } from "@/lib/services/username";
import { createUserData } from "@/lib/services/firestore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { MultiStepProgress } from "@/components/auth/MultiStepProgress";
import { ProfilePictureUpload } from "@/components/auth/ProfilePictureUpload";

type SignupStep = "credentials" | "profile-picture";

export default function SignupPage() {
    const router = useRouter();
    const { signUpWithEmail, loginWithGoogle } = useAuth();

    const [currentStep, setCurrentStep] = useState<SignupStep>("credentials");
    const [completedSteps, setCompletedSteps] = useState<SignupStep[]>([]);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [profilePicture, setProfilePicture] = useState("");

    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userCredential, setUserCredential] = useState<any>(null);

    const steps = [
        { id: "credentials" as SignupStep, title: "Account", description: "Basic info" },
        { id: "profile-picture" as SignupStep, title: "Profile", description: "Optional" },
    ];

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
        if (!validation.valid) return;

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

    const handleStep1Continue = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !username) {
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
            const credential = await signUpWithEmail(email, password, username);
            setUserCredential(credential);
            await reserveUsername(username, credential.user.uid);
            setCompletedSteps(["credentials"]);
            setCurrentStep("profile-picture");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSkipProfilePicture = async () => {
        if (!userCredential) return;
        setLoading(true);
        try {
            await createUserData(userCredential.user.uid, email, username, username, "");
            router.push("/roadmap");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSignup = async () => {
        if (!userCredential) return;
        setLoading(true);
        setError(null);
        try {
            await createUserData(userCredential.user.uid, email, username, username, profilePicture);
            router.push("/roadmap");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden p-4">
            <AnimatedBackground variant="aurora" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join the community and start learning</p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <MultiStepProgress steps={steps} currentStep={currentStep} completedSteps={completedSteps} />
                </div>

                {/* Form Container */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan rounded-3xl blur opacity-20" />

                    <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        {/* Error */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {currentStep === "credentials" && (
                                <motion.form
                                    key="credentials"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleStep1Continue}
                                    className="space-y-5"
                                >
                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                                        <div className="relative group">
                                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-accent-indigo transition-colors" />
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => handleUsernameChange(e.target.value)}
                                                className={cn(
                                                    "w-full bg-slate-800/50 border rounded-xl pl-12 pr-12 py-3.5 text-white focus:outline-none transition-all",
                                                    usernameAvailable === true && "border-green-500 focus:ring-2 focus:ring-green-500/20",
                                                    usernameAvailable === false && "border-red-500 focus:ring-2 focus:ring-red-500/20",
                                                    usernameAvailable === null && "border-slate-700 focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/20"
                                                )}
                                                placeholder="johndoe"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                {checkingUsername && <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />}
                                                {!checkingUsername && usernameAvailable === true && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                                {!checkingUsername && usernameAvailable === false && <AlertCircle className="w-5 h-5 text-red-500" />}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
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

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
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

                                        {/* Password Strength */}
                                        {password && (
                                            <div className="mt-2">
                                                <div className="flex gap-1 mb-1">
                                                    {[1, 2, 3, 4, 5].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={cn(
                                                                "h-1 flex-1 rounded-full transition-colors",
                                                                level <= passwordStrength.strength
                                                                    ? passwordStrength.strength === 1 ? "bg-red-500"
                                                                        : passwordStrength.strength === 2 ? "bg-orange-500"
                                                                            : passwordStrength.strength === 3 ? "bg-yellow-500"
                                                                                : passwordStrength.strength === 4 ? "bg-green-500"
                                                                                    : "bg-emerald-500"
                                                                    : "bg-slate-700"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <p className={cn("text-xs", passwordStrength.color)}>{passwordStrength.label}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Continue Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan hover:from-accent-indigo/90 hover:via-accent-violet/90 hover:to-accent-cyan/90 shadow-lg shadow-accent-indigo/25"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                Continue
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>

                                    {/* Divider */}
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-800"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-slate-900 text-slate-500">Or continue with</span>
                                        </div>
                                    </div>

                                    {/* Google Signup */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-12 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                                        onClick={handleGoogleSignup}
                                        disabled={loading}
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Google
                                    </Button>
                                </motion.form>
                            )}

                            {currentStep === "profile-picture" && (
                                <motion.div
                                    key="profile-picture"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-white mb-2">Add a Profile Picture</h3>
                                        <p className="text-slate-400">Help others recognize you (optional)</p>
                                    </div>

                                    <ProfilePictureUpload value={profilePicture} onChange={setProfilePicture} loading={loading} />

                                    <div className="space-y-3">
                                        {profilePicture && (
                                            <Button
                                                onClick={handleCompleteSignup}
                                                className="w-full h-12 text-lg bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-cyan hover:from-accent-indigo/90 hover:via-accent-violet/90 hover:to-accent-cyan/90 shadow-lg shadow-accent-indigo/25"
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Signup"}
                                            </Button>
                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={handleSkipProfilePicture}
                                            className="w-full h-12 border-slate-700 hover:bg-slate-800 hover:border-slate-600"
                                            disabled={loading}
                                        >
                                            Skip for Now
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Login Link */}
                <p className="text-center mt-6 text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="text-accent-cyan hover:text-accent-cyan/80 font-medium transition-colors">
                        Log in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

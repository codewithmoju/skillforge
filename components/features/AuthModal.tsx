"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2, Mail, Lock, User, AlertCircle, AtSign } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { validateUsername, checkUsernameAvailability, reserveUsername } from "@/lib/services/username";
import { createUserData } from "@/lib/services/firestore";
import { cn } from "@/lib/utils";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type AuthView = "login" | "signup" | "reset";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const router = useRouter();
    const [view, setView] = useState<AuthView>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetSent, setResetSent] = useState(false);

    const { loginWithGoogle, signUpWithEmail, loginWithEmail, resetPassword } = useAuth();

    const handleUsernameChange = async (value: string) => {
        setUsername(value);
        setUsernameAvailable(null);

        const validation = validateUsername(value);
        if (!validation.valid) {
            setError(validation.error || "Invalid username");
            return;
        }

        setError(null);
        setCheckingUsername(true);

        try {
            const available = await checkUsernameAvailability(value);
            setUsernameAvailable(available);
            if (!available) {
                setError("Username is already taken");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCheckingUsername(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            await loginWithGoogle();
            onClose();
            // ProfileCompletionModal will handle the rest
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !displayName || !username) {
            setError("Please fill in all required fields");
            return;
        }

        if (!usernameAvailable) {
            setError("Please choose an available username");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create Firebase auth account
            const userCredential = await signUpWithEmail(email, password, displayName);

            // Reserve username
            await reserveUsername(username, userCredential.user.uid);

            // Create user profile
            await createUserData(
                userCredential.user.uid,
                email,
                displayName,
                username,
                profilePicture
            );

            onClose();
            router.push("/roadmap");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
            onClose();
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

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setDisplayName("");
        setUsername("");
        setProfilePicture("");
        setUsernameAvailable(null);
        setError(null);
        setResetSent(false);
    };

    const switchView = (newView: AuthView) => {
        resetForm();
        setView(newView);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                resetForm();
                onClose();
            }}
            title={view === "login" ? "Welcome Back" : view === "signup" ? "Create Account" : "Reset Password"}
            className="max-w-md"
        >
            {/* Tab Switcher */}
            {view !== "reset" && (
                <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl">
                    <button
                        onClick={() => switchView("login")}
                        className={cn(
                            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                            view === "login"
                                ? "bg-accent-indigo text-white"
                                : "text-slate-400 hover:text-white"
                        )}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => switchView("signup")}
                        className={cn(
                            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                            view === "signup"
                                ? "bg-accent-indigo text-white"
                                : "text-slate-400 hover:text-white"
                        )}
                    >
                        Sign Up
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {/* Reset Success Message */}
            {resetSent && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-400">
                        Password reset email sent! Check your inbox.
                    </p>
                </div>
            )}

            {/* Login Form */}
            {view === "login" && (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent-indigo"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent-indigo"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => switchView("reset")}
                        className="text-sm text-accent-cyan hover:underline"
                    >
                        Forgot password?
                    </button>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
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
                </form>
            )}

            {/* Sign Up Form */}
            {view === "signup" && (
                <form onSubmit={handleEmailSignup} className="space-y-4">
                    <ImageUpload
                        value={profilePicture}
                        onChange={setProfilePicture}
                        label="Profile Picture (Optional)"
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Display Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent-indigo"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                className={cn(
                                    "w-full bg-slate-800 border rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none",
                                    usernameAvailable === true && "border-green-500 focus:border-green-500",
                                    usernameAvailable === false && "border-red-500 focus:border-red-500",
                                    usernameAvailable === null && "border-slate-700 focus:border-accent-indigo"
                                )}
                                placeholder="johndoe"
                            />
                            {checkingUsername && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 animate-spin" />
                            )}
                        </div>
                        {usernameAvailable === true && (
                            <p className="text-xs text-green-400 mt-1">Username is available!</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">3-20 characters, letters, numbers, and underscores only</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent-indigo"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent-indigo"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">At least 6 characters</p>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading || !usernameAvailable}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-900 text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
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
                </form>
            )}

            {/* Password Reset Form */}
            {view === "reset" && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                    <p className="text-sm text-slate-400 mb-4">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent-indigo"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                    </Button>

                    <button
                        type="button"
                        onClick={() => switchView("login")}
                        className="w-full text-sm text-accent-cyan hover:underline"
                    >
                        Back to login
                    </button>
                </form>
            )}
        </Modal>
    );
}

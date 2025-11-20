"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2, AtSign, AlertCircle, Type } from "lucide-react";
import { validateUsername, checkUsernameAvailability, reserveUsername } from "@/lib/services/username";
import { updateUserData } from "@/lib/services/firestore";
import { cn } from "@/lib/utils";

interface ProfileCompletionModalProps {
    isOpen: boolean;
    userId: string;
    email: string;
    displayName: string;
    onComplete: () => void;
}

export function ProfileCompletionModal({
    isOpen,
    userId,
    email,
    displayName,
    onComplete
}: ProfileCompletionModalProps) {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleComplete = async () => {
        if (!username) {
            setError("Please enter a username");
            return;
        }

        if (!usernameAvailable) {
            setError("Please choose an available username");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Reserve username
            await reserveUsername(username, userId);

            // Update user profile
            await updateUserData(userId, {
                username,
                bio,
                profilePicture,
                profileComplete: true,
            });

            onComplete();
            router.push("/roadmap");
        } catch (err: any) {
            setError(err.message || "Failed to complete profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { }} // Prevent closing - must complete profile
            title="Complete Your Profile"
            className="max-w-md"
        >
            <p className="text-sm text-slate-400 mb-6">
                Welcome, {displayName}! Let's set up your profile to get started.
            </p>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                <ImageUpload
                    value={profilePicture}
                    onChange={setProfilePicture}
                    label="Profile Picture (Optional)"
                />

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Username <span className="text-red-400">*</span>
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
                        Bio (Optional)
                    </label>
                    <div className="relative">
                        <Type className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent-indigo resize-none"
                            placeholder="Tell us about yourself..."
                            rows={3}
                            maxLength={150}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{bio.length}/150 characters</p>
                </div>

                <Button
                    onClick={handleComplete}
                    className="w-full"
                    size="lg"
                    disabled={loading || !usernameAvailable}
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Profile"}
                </Button>
            </div>
        </Modal>
    );
}

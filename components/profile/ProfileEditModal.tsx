"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { updateUserData, type FirestoreUserData } from "@/lib/services/firestore";
import { toast } from "sonner";
import { Loader2, Link as LinkIcon, MapPin, Briefcase, User, Image as ImageIcon } from "lucide-react";

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: FirestoreUserData;
}

export function ProfileEditModal({ isOpen, onClose, currentUser }: ProfileEditModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        location: "",
        website: "",
        occupation: "",
        profilePicture: ""
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || "",
                bio: currentUser.bio || "",
                location: currentUser.location || "",
                website: currentUser.website || "",
                occupation: currentUser.occupation || "",
                profilePicture: currentUser.profilePicture || ""
            });
        }
    }, [currentUser, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateUserData(currentUser.uid, {
                name: formData.name,
                bio: formData.bio,
                location: formData.location,
                website: formData.website,
                occupation: formData.occupation,
                profilePicture: formData.profilePicture,
                profileComplete: true
            });

            toast.success("Profile updated successfully");
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {/* Profile Picture URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-cyan-400" />
                            Profile Picture URL
                        </label>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <input
                                    type="url"
                                    value={formData.profilePicture}
                                    onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-1">Paste a direct link to an image (e.g. from Imgur, GitHub)</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                                {formData.profilePicture ? (
                                    <img
                                        src={formData.profilePicture}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <User className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                            placeholder="Your name"
                            required
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Bio</label>
                        <Textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            className="h-24 resize-none"
                            maxLength={160}
                        />
                        <p className="text-xs text-right text-slate-500">
                            {formData.bio.length}/160
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Occupation */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-cyan-400" />
                                Occupation
                            </label>
                            <input
                                type="text"
                                value={formData.occupation}
                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                placeholder="Student, Developer..."
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-cyan-400" />
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-cyan-400" />
                            Website
                        </label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                            placeholder="https://your-portfolio.com"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold">
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

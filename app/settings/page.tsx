"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield, Lock, Database, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData, updateUserData } from "@/lib/services/firestore";
import { validateUsername, checkUsernameAvailability } from "@/lib/services/username";

type TabType = "account" | "privacy" | "security" | "data";

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("account");
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form states
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    const loadUserData = async () => {
        if (!user) return;
        const data = await getUserData(user.uid);
        if (data) {
            setUserData(data);
            setName(data.name);
            setBio(data.bio || "");
            setProfilePicture(data.profilePicture || "");
            setIsPrivate(data.isPrivate);
        }
    };

    const handleSaveAccount = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            await updateUserData(user.uid, {
                name,
                bio,
                profilePicture,
            });
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    const handleSavePrivacy = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            await updateUserData(user.uid, { isPrivate });
            setMessage({ type: "success", text: "Privacy settings updated!" });
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to update privacy" });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "account" as TabType, label: "Account", icon: User },
        { id: "privacy" as TabType, label: "Privacy", icon: Shield },
        { id: "security" as TabType, label: "Security", icon: Lock },
        { id: "data" as TabType, label: "Data", icon: Database },
    ];

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-slate-400">Manage your account and preferences</p>
                </div>

                {/* Message */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl ${message.type === "success"
                                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                            }`}
                    >
                        {message.text}
                    </motion.div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-accent-indigo text-white"
                                    : "bg-slate-900/50 text-slate-400 hover:text-white"
                                }`}
                        >
                            <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-sm md:text-base">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-8">
                    {/* Account Tab */}
                    {activeTab === "account" && (
                        <div className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Account Settings</h2>

                            <ImageUpload
                                value={profilePicture}
                                onChange={setProfilePicture}
                                label="Profile Picture"
                            />

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-indigo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-indigo resize-none"
                                    rows={4}
                                    maxLength={150}
                                />
                                <p className="text-xs text-slate-500 mt-1">{bio.length}/150 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={userData?.username || ""}
                                    disabled
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-500 mt-1">Username cannot be changed</p>
                            </div>

                            <Button onClick={handleSaveAccount} disabled={loading} className="w-full md:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === "privacy" && (
                        <div className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Privacy Settings</h2>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                                <div>
                                    <p className="font-semibold text-white">Private Account</p>
                                    <p className="text-sm text-slate-400 mt-1">
                                        Require approval for new followers
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsPrivate(!isPrivate)}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${isPrivate ? "bg-accent-indigo" : "bg-slate-700"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isPrivate ? "translate-x-6" : ""
                                            }`}
                                    />
                                </button>
                            </div>

                            <Button onClick={handleSavePrivacy} disabled={loading} className="w-full md:w-auto">
                                <Save className="w-4 h-4 mr-2" />
                                Save Privacy Settings
                            </Button>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Security Settings</h2>
                            <p className="text-slate-400">Change password feature coming soon...</p>
                        </div>
                    )}

                    {/* Data Tab */}
                    {activeTab === "data" && (
                        <div className="space-y-6">
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Data Management</h2>
                            <p className="text-slate-400">Export/Import data feature coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2, Users, Lock, Globe, Tag, ArrowLeft } from "lucide-react";
import { createGroup } from "@/lib/services/groups";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CreateGroupPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            if (tags.length < 5 && !tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
                setCurrentTag("");
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!name.trim() || !description.trim()) {
            setError("Name and description are required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const groupId = await createGroup({
                name: name.trim(),
                description: description.trim(),
                image: image || undefined,
                isPrivate,
                tags,
                createdBy: user.uid,
                members: [user.uid],
                memberCount: 1
            });

            router.push(`/groups/${groupId}`);
        } catch (err: any) {
            console.error("Error creating group:", err);
            setError(err.message || "Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/groups"
                    className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Groups
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-accent-indigo/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-accent-indigo" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Create Community</h1>
                            <p className="text-slate-400">Start a new learning group</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Group Image */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Group Image</label>
                            <div className="flex items-center gap-6">
                                <ImageUpload
                                    value={image}
                                    onChange={setImage}
                                    size="lg"
                                    rounded
                                />
                                <div className="text-sm text-slate-400">
                                    <p>Recommended size: 400x400px</p>
                                    <p>Max file size: 2MB</p>
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Group Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-indigo transition-colors"
                                    placeholder="e.g. React Developers"
                                    maxLength={50}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-indigo transition-colors resize-none"
                                    placeholder="What is this group about?"
                                    rows={4}
                                    maxLength={300}
                                />
                                <p className="text-xs text-slate-500 mt-1 text-right">{description.length}/300</p>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Privacy</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsPrivate(false)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${!isPrivate
                                                ? "bg-accent-indigo/10 border-accent-indigo"
                                                : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                                            }`}
                                    >
                                        <Globe className={`w-6 h-6 mb-2 ${!isPrivate ? "text-accent-indigo" : "text-slate-400"}`} />
                                        <div className={`font-semibold ${!isPrivate ? "text-white" : "text-slate-300"}`}>Public</div>
                                        <div className="text-xs text-slate-500 mt-1">Anyone can find and join</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setIsPrivate(true)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${isPrivate
                                                ? "bg-accent-indigo/10 border-accent-indigo"
                                                : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                                            }`}
                                    >
                                        <Lock className={`w-6 h-6 mb-2 ${isPrivate ? "text-accent-indigo" : "text-slate-400"}`} />
                                        <div className={`font-semibold ${isPrivate ? "text-white" : "text-slate-300"}`}>Private</div>
                                        <div className="text-xs text-slate-500 mt-1">Invite only</div>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Tags (Optional)
                                </label>
                                <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 flex flex-wrap gap-2 min-h-[50px] items-center">
                                    {tags.map(tag => (
                                        <span key={tag} className="bg-accent-indigo/20 text-accent-indigo px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-white"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        className="bg-transparent border-none text-white focus:ring-0 flex-1 min-w-[100px] p-0"
                                        placeholder={tags.length < 5 ? "Type and press Enter..." : "Max tags reached"}
                                        disabled={tags.length >= 5}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Add up to 5 tags to help people find your group</p>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Link href="/groups" className="flex-1">
                                <Button variant="outline" className="w-full" type="button">Cancel</Button>
                            </Link>
                            <Button
                                className="flex-1"
                                disabled={loading || !name.trim() || !description.trim()}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Group"
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}

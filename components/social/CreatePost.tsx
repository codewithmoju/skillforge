"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2, Image as ImageIcon, X, Send } from "lucide-react";
import { createPost, Post } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { useUserStore } from "@/lib/store";
import { postSchema } from "@/lib/validations/schemas";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MAX_CHARS = 500;

interface CreatePostProps {
    onPostCreated?: (post: Post) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
    const { user } = useAuth();
    const incrementPostCount = useUserStore((state) => state.incrementPostCount);
    const [text, setText] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem("post_draft");
        if (savedDraft) {
            try {
                const { text: savedText, images: savedImages } = JSON.parse(savedDraft);
                if (savedText) setText(savedText);
                if (savedImages) setImages(savedImages);
                if (savedText || (savedImages && savedImages.length > 0)) setIsExpanded(true);
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, []);

    // Save draft on change
    useEffect(() => {
        if (text || images.length > 0) {
            localStorage.setItem("post_draft", JSON.stringify({ text, images }));
        } else {
            localStorage.removeItem("post_draft");
        }
    }, [text, images]);

    const handleAddImage = (url: string) => {
        if (images.length < 4) {
            setImages([...images, url]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        if (!user) return;

        // Validation
        const validationResult = postSchema.safeParse({
            content: text.trim(),
            images: images.length > 0 ? images : undefined,
        });

        if (!validationResult.success) {
            setError(validationResult.error.issues[0].message);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userData = await getUserData(user.uid);
            if (!userData) throw new Error("User data not found");

            const postId = await createPost(
                user.uid,
                userData.username,
                userData.name,
                userData.profilePicture,
                {
                    type: "text",
                    content: {
                        text: text.trim(),
                        images: images.length > 0 ? images : undefined,
                    }
                }
            );

            // Construct optimistic post object
            const newPost: Post = {
                id: postId,
                userId: user.uid,
                username: userData.username,
                userName: userData.name,
                userPhoto: userData.profilePicture,
                type: "text",
                content: {
                    text: text.trim(),
                    images: images.length > 0 ? images : undefined,
                },
                likes: 0,
                comments: 0,
                saves: 0,
                createdAt: new Date().toISOString(),
            };

            // Update achievement progress
            incrementPostCount();

            setText("");
            setImages([]);
            localStorage.removeItem("post_draft");
            setIsExpanded(false);
            onPostCreated?.(newPost);
        } catch (err: any) {
            setError(err.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-accent-indigo/50">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                        {user?.displayName?.charAt(0).toUpperCase() || "U"}
                    </span>
                </div>
                <div className="flex-1">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                        onFocus={() => setIsExpanded(true)}
                        className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 resize-none min-h-[40px]"
                        placeholder="What are you learning today?"
                        rows={isExpanded ? 3 : 1}
                        maxLength={MAX_CHARS}
                    />
                    {isExpanded && (
                        <div className={cn(
                            "text-xs text-right transition-colors",
                            text.length > MAX_CHARS * 0.9 ? "text-red-400" :
                                text.length > MAX_CHARS * 0.75 ? "text-yellow-400" : "text-slate-500"
                        )}>
                            {text.length}/{MAX_CHARS}
                        </div>
                    )}

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 pt-2"
                            >
                                {error && (
                                    <div className="text-sm text-red-400 bg-red-500/10 p-2 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {/* Image Previews */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative aspect-video rounded-xl overflow-hidden group bg-slate-800">
                                                <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                    <div className="flex gap-2">
                                        {images.length < 4 && (
                                            <ImageUpload
                                                value=""
                                                onChange={handleAddImage}
                                                label=""
                                                className="w-auto h-auto"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                                                >
                                                    <ImageIcon className="w-5 h-5 mr-2" />
                                                    Photo
                                                </Button>
                                            </ImageUpload>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setIsExpanded(false);
                                                setText("");
                                                setImages([]);
                                                setError(null);
                                            }}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handlePost}
                                            disabled={loading || (!text.trim() && images.length === 0)}
                                            className="bg-accent-indigo hover:bg-accent-indigo/90"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Post
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}


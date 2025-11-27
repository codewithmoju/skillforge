"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2, Image as ImageIcon, X } from "@/lib/icons";
import { createPost } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";
import { useUserStore } from "@/lib/store";

interface CreatePostProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
}

export function CreatePost({ isOpen, onClose, onPostCreated }: CreatePostProps) {
    const { user } = useAuth();
    const incrementPostCount = useUserStore((state) => state.incrementPostCount);
    const [text, setText] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        if (!text.trim() && images.length === 0) {
            setError("Please add some content to your post");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const userData = await getUserData(user.uid);
            if (!userData) throw new Error("User data not found");

            await createPost(
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

            // Update achievement progress
            incrementPostCount();

            setText("");
            setImages([]);
            onClose();
            onPostCreated?.();
        } catch (err: any) {
            setError(err.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Post"
            className="max-w-lg"
        >
            <div className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-indigo resize-none"
                        placeholder="What's on your mind?"
                        rows={4}
                        maxLength={500}
                    />
                    <p className="text-xs text-slate-500 mt-1">{text.length}/500 characters</p>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
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

                {/* Add Image */}
                {images.length < 4 && (
                    <div>
                        <ImageUpload
                            value=""
                            onChange={handleAddImage}
                            label={`Add Image (${images.length}/4)`}
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePost}
                        disabled={loading || (!text.trim() && images.length === 0)}
                        className="flex-1"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}


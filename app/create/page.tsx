"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Loader2, X, ArrowLeft } from "lucide-react";
import { createPost } from "@/lib/services/posts";
import { useAuth } from "@/lib/hooks/useAuth";
import { getUserData } from "@/lib/services/firestore";

export default function CreatePage() {
    const router = useRouter();
    const { user } = useAuth();
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
                    type: 'text',
                    content: {
                        text: text.trim(),
                        images: images.length > 0 ? images : undefined,
                    }
                }
            );

            router.push("/social");
        } catch (err: any) {
            setError(err.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm md:text-base">Back</span>
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Create Post</h1>
                    <p className="text-slate-400">Share your learning journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 md:p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-sm md:text-base text-red-400">{error}</p>
                    </div>
                )}

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-8 space-y-6">
                    <div>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-indigo resize-none text-sm md:text-base"
                            placeholder="What's on your mind?"
                            rows={6}
                            maxLength={500}
                        />
                        <p className="text-xs md:text-sm text-slate-500 mt-1">{text.length}/500 characters</p>
                    </div>

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            {images.map((image, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                    <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
                            onClick={() => router.back()}
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
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Share2, Link as LinkIcon, Twitter, Facebook, Linkedin, Check } from "lucide-react";
import { copyToClipboard, shareToTwitter, shareToFacebook, shareToLinkedIn, shareViaWebShare } from "@/lib/utils/share";

interface ShareButtonProps {
    url: string;
    title: string;
    text?: string;
    className?: string;
}

export function ShareButton({ url, title, text = "", className }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(url);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWebShare = async () => {
        const success = await shareViaWebShare(title, text, url);
        if (success) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`text-slate-400 hover:text-accent-cyan transition-colors ${className}`}
            >
                <Share2 className="w-5 h-5" />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Share"
                className="max-w-md"
            >
                <div className="space-y-4">
                    {/* Copy Link */}
                    <button
                        onClick={handleCopy}
                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                    >
                        {copied ? (
                            <Check className="w-5 h-5 text-green-400" />
                        ) : (
                            <LinkIcon className="w-5 h-5 text-slate-400" />
                        )}
                        <span className="text-white font-medium">
                            {copied ? "Link copied!" : "Copy link"}
                        </span>
                    </button>

                    {/* Web Share API (Mobile) */}
                    {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                        <button
                            onClick={handleWebShare}
                            className="w-full flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                            <Share2 className="w-5 h-5 text-slate-400" />
                            <span className="text-white font-medium">Share via...</span>
                        </button>
                    )}

                    {/* Social Media */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => {
                                shareToTwitter(text || title, url);
                                setIsOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                            <Twitter className="w-6 h-6 text-blue-400" />
                            <span className="text-xs text-slate-400">Twitter</span>
                        </button>

                        <button
                            onClick={() => {
                                shareToFacebook(url);
                                setIsOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                            <Facebook className="w-6 h-6 text-blue-500" />
                            <span className="text-xs text-slate-400">Facebook</span>
                        </button>

                        <button
                            onClick={() => {
                                shareToLinkedIn(url);
                                setIsOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                            <Linkedin className="w-6 h-6 text-blue-600" />
                            <span className="text-xs text-slate-400">LinkedIn</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, UserPlus, Heart, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock notifications for now
    const mockNotifications = [
        {
            id: "1",
            type: "follow",
            fromUserName: "John Doe",
            fromUsername: "johndoe",
            fromUserPhoto: "",
            read: false,
            createdAt: new Date().toISOString(),
        },
        {
            id: "2",
            type: "like",
            fromUserName: "Jane Smith",
            fromUsername: "janesmith",
            fromUserPhoto: "",
            postId: "post1",
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setNotifications(mockNotifications);
            setLoading(false);
        }, 500);
    }, []);

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "follow":
                return UserPlus;
            case "like":
                return Heart;
            case "comment":
                return MessageCircle;
            default:
                return Bell;
        }
    };

    const getNotificationText = (notification: any) => {
        switch (notification.type) {
            case "follow":
                return "started following you";
            case "like":
                return "liked your post";
            case "comment":
                return "commented on your post";
            default:
                return "sent you a notification";
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Notifications</h1>
                    <p className="text-slate-400">Stay updated with your activity</p>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12 md:py-20">
                        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-2 md:space-y-3">
                        {notifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.type);
                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`bg-slate-900/50 border rounded-xl md:rounded-2xl p-4 md:p-6 ${notification.read ? "border-slate-800" : "border-accent-indigo/30 bg-accent-indigo/5"
                                        }`}
                                >
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${notification.type === "follow" ? "bg-blue-500/10" :
                                                notification.type === "like" ? "bg-red-500/10" :
                                                    "bg-green-500/10"
                                            }`}>
                                            <Icon className={`w-5 h-5 md:w-6 md:h-6 ${notification.type === "follow" ? "text-blue-400" :
                                                    notification.type === "like" ? "text-red-400" :
                                                        "text-green-400"
                                                }`} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm md:text-base text-white">
                                                <Link href={`/profile/${notification.fromUsername}`} className="font-semibold hover:text-accent-cyan">
                                                    {notification.fromUserName}
                                                </Link>
                                                {" "}
                                                <span className="text-slate-400">{getNotificationText(notification)}</span>
                                            </p>
                                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {!notification.read && (
                                            <div className="w-2 h-2 rounded-full bg-accent-cyan shrink-0 mt-2" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-20">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 md:w-10 md:h-10 text-slate-600" />
                        </div>
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">No notifications yet</h3>
                        <p className="text-sm md:text-base text-slate-400">We'll notify you when something happens</p>
                    </div>
                )}
            </div>
        </div>
    );
}

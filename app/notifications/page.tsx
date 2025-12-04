"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { getNotificationsPaginated, markAsRead, markAllAsRead, Notification, PaginatedNotifications } from "@/lib/services/notifications";
import { Loader2, Bell, Heart, MessageSquare, UserPlus, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 15;

export default function NotificationsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

    useEffect(() => {
        if (user) {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const result = await getNotificationsPaginated(user.uid, PAGE_SIZE);
            setNotifications(result.items);
            lastDocRef.current = result.lastDoc;
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Error loading notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (!user || loadingMore || !hasMore || !lastDocRef.current) return;

        setLoadingMore(true);
        try {
            const result = await getNotificationsPaginated(user.uid, PAGE_SIZE, lastDocRef.current);
            setNotifications(prev => [...prev, ...result.items]);
            lastDocRef.current = result.lastDoc;
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Error loading more notifications:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleMarkAllRead = async () => {
        if (!user) return;
        try {
            await markAllAsRead(user.uid);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'like': return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
            case 'comment': return <MessageSquare className="w-5 h-5 text-blue-400 fill-blue-400" />;
            case 'follow': return <UserPlus className="w-5 h-5 text-emerald-400" />;
            case 'mention': return <span className="text-lg">@</span>;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    };

    const getMessage = (notification: Notification) => {
        switch (notification.type) {
            case 'like': return "liked your post";
            case 'comment': return "commented on your post";
            case 'follow': return "started following you";
            case 'mention': return "mentioned you in a post";
            default: return "interacted with you";
        }
    };

    // Get the navigation link for a notification
    const getNotificationLink = (notification: Notification): string => {
        switch (notification.type) {
            case 'like':
            case 'comment':
            case 'mention':
                return notification.postId ? `/social?post=${notification.postId}` : '/social';
            case 'follow':
                return `/profile/${notification.fromUserId}`;
            default:
                return '/social';
        }
    };

    // Handle notification click - mark as read and navigate
    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            await handleMarkAsRead(notification.id);
        }
        router.push(getNotificationLink(notification));
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                {notifications.some(n => !n.read) && (
                    <Button variant="ghost" onClick={handleMarkAllRead} className="text-sm text-slate-400 hover:text-white">
                        <Check className="w-4 h-4 mr-2" />
                        Mark all read
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {notifications.length > 0 ? (
                        <>
                            {notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`bg-slate-900/50 border rounded-2xl p-4 flex items-center gap-4 transition-colors cursor-pointer hover:border-accent-indigo/50 ${notification.read ? "border-slate-800" : "border-accent-indigo/30 bg-accent-indigo/5"
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800">
                                            {notification.fromUserPhoto ? (
                                                <Image
                                                    src={notification.fromUserPhoto}
                                                    alt={notification.fromUserName}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-slate-700 to-slate-600">
                                                    {notification.fromUserName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1">
                                            {getIcon(notification.type)}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-white">
                                            <span className="font-semibold hover:underline cursor-pointer">
                                                {notification.fromUserName}
                                            </span>
                                            {" "}{getMessage(notification)}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {formatDistanceToNow(new Date(notification.createdAt))} ago
                                        </p>
                                    </div>

                                    {!notification.read && (
                                        <div className="w-2 h-2 rounded-full bg-accent-indigo" />
                                    )}
                                </motion.div>
                            ))}

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="flex justify-center pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={loadMore}
                                        disabled={loadingMore}
                                        className="w-full max-w-xs"
                                    >
                                        {loadingMore ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            "Load More Notifications"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
                            <p className="text-slate-400">You're all caught up!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

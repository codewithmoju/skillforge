"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { collection, query, where, orderBy, getDocs, updateDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, MessageSquare, Heart, UserPlus, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'achievement' | 'system';
    title: string;
    message: string;
    read: boolean;
    createdAt: any;
    link?: string;
    sender?: {
        name: string;
        photoURL?: string;
    };
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const q = query(
                    collection(db, "users", user.uid, "notifications"),
                    orderBy("createdAt", "desc")
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user]);

    const markAsRead = async (id: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, "users", user.uid, "notifications", id), { read: true });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            const batch = writeBatch(db);
            notifications.forEach(n => {
                if (!n.read) {
                    const ref = doc(db, "users", user.uid, "notifications", n.id);
                    batch.update(ref, { read: true });
                }
            });
            await batch.commit();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const deleteNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;
        try {
            const { deleteDoc } = await import("firebase/firestore");
            await deleteDoc(doc(db, "users", user.uid, "notifications", id));
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart className="w-5 h-5 text-rose-500" />;
            case 'comment': return <MessageSquare className="w-5 h-5 text-blue-500" />;
            case 'follow': return <UserPlus className="w-5 h-5 text-emerald-500" />;
            case 'achievement': return <Trophy className="w-5 h-5 text-amber-500" />;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                    <p className="text-slate-400">Stay updated with your community activity</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Mark all read
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={() => {
                                    if (!notification.read) markAsRead(notification.id);
                                    if (notification.link) router.push(notification.link);
                                }}
                                className={`relative p-5 rounded-2xl border transition-all cursor-pointer group ${notification.read
                                        ? "bg-slate-900/50 border-white/5 hover:border-white/10"
                                        : "bg-slate-800/50 border-cyan-500/30 hover:border-cyan-500/50"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${notification.read ? "bg-slate-800" : "bg-slate-700"}`}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-semibold ${notification.read ? "text-slate-200" : "text-white"}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                                                {notification.createdAt?.toDate ? formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed">{notification.message}</p>
                                    </div>
                                    <button
                                        onClick={(e) => deleteNotification(notification.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                {!notification.read && (
                                    <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-slate-900/50">
                            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
                            <p className="text-slate-400">No new notifications to show.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

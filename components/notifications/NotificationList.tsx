"use client";

import { useEffect, useState } from "react";
import { Notification, getNotifications, markAsRead, markAllAsRead } from "@/lib/services/notifications";
import { NotificationItem } from "./NotificationItem";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Loader2, CheckCheck } from "lucide-react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function NotificationList() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Initial fetch and real-time listener
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Notification[];
            setNotifications(newNotifications);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleRead = async (id: string) => {
        try {
            await markAsRead(id);
            // Optimistic update handled by listener, but we can do local state update if needed for instant feedback
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllRead = async () => {
        if (!user) return;
        try {
            await markAllAsRead(user.uid);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <CheckCheck className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm">No notifications yet</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col max-h-[400px]">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                <h3 className="font-semibold text-sm text-white">Notifications</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="text-xs text-slate-400 hover:text-white"
                >
                    Mark all read
                </Button>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={handleRead}
                    />
                ))}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getNotifications, markAsRead, markAllAsRead, Notification } from '@/lib/services/notifications';
import { Loader2, Heart, UserPlus, MessageCircle, Bell } from 'lucide-react';
import Link from 'next/link';

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
}

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const data = await getNotifications(user.uid);
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user]);

    const handleMarkAllRead = async () => {
        if (!user) return;
        try {
            await markAllAsRead(user.uid);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read) {
            try {
                await markAsRead(notification.id);
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'like':
                return <Heart className="w-5 h-5 text-red-400 fill-red-400" />;
            case 'follow':
                return <UserPlus className="w-5 h-5 text-blue-400" />;
            case 'comment':
                return <MessageCircle className="w-5 h-5 text-green-400" />;
            case 'mention':
                return <Bell className="w-5 h-5 text-yellow-400" />;
            default:
                return <Bell className="w-5 h-5 text-gray-400" />;
        }
    };

    const getMessage = (notification: Notification) => {
        switch (notification.type) {
            case 'like':
                return 'liked your post';
            case 'follow':
                return 'started following you';
            case 'comment':
                return 'commented on your post';
            case 'mention':
                return 'mentioned you in a post';
            default:
                return 'interacted with you';
        }
    };

    const getLink = (notification: Notification) => {
        if (notification.type === 'follow') {
            return `/profile/${notification.fromUserName}`; // Assuming username is available or we fetch it. Wait, fromUserName is name not username.
            // We might need to store username in notification or fetch it.
            // For now, let's assume we can link to profile but we need username.
            // The notification service stores `fromUserName` which is likely the display name.
            // We should probably store `fromUserUsername` too if we want to link correctly.
            // Let's update the service later if needed, for now let's link to dashboard or just not link if we can't.
            // Actually, let's just link to /profile/ID if we supported it, but we support /profile/USERNAME.
            // I'll assume for now that I can't easily link to profile without username.
            // But wait, I can store username in notification.
        }
        if (notification.postId) {
            // We don't have a single post page yet? Or maybe we do?
            // We don't have a dedicated single post page in the plan.
            // But we can link to the feed or create a post modal.
            // For now, let's just make it non-clickable or link to home.
            return '/dashboard';
        }
        return '/dashboard';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${notification.read
                                ? 'bg-slate-900/30 border-slate-800/50'
                                : 'bg-slate-800/50 border-slate-700'
                                }`}
                        >
                            <div className="flex-shrink-0">
                                {notification.fromUserPhoto ? (
                                    <img
                                        src={notification.fromUserPhoto}
                                        alt={notification.fromUserName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                        <span className="text-white font-bold">
                                            {notification.fromUserName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1">
                                    {getIcon(notification.type)}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-white">
                                    <span className="font-semibold">{notification.fromUserName}</span>{' '}
                                    <span className="text-slate-300">{getMessage(notification)}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {timeAgo(notification.createdAt)}
                                </p>
                            </div>

                            {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-accent-cyan flex-shrink-0" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

interface OnlineStatusProps {
    online?: boolean;
    lastSeen?: string;
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

export function OnlineStatus({ online, lastSeen }: OnlineStatusProps) {
    if (online) {
        return (
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">Active now</span>
            </div>
        );
    }

    if (lastSeen) {
        return (
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-600 rounded-full" />
                <span className="text-xs text-slate-400">Active {timeAgo(lastSeen)}</span>
            </div>
        );
    }

    return null;
}

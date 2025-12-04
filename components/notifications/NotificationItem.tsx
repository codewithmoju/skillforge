import { Notification } from "@/lib/services/notifications";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
    notification: Notification;
    onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
    const iconMap = {
        like: <Heart className="w-4 h-4 text-red-500 fill-red-500" />,
        comment: <MessageCircle className="w-4 h-4 text-blue-500 fill-blue-500" />,
        follow: <UserPlus className="w-4 h-4 text-green-500 fill-green-500" />,
        mention: <AtSign className="w-4 h-4 text-orange-500" />,
    };

    const contentMap = {
        like: "liked your post",
        comment: "commented on your post",
        follow: "started following you",
        mention: "mentioned you in a post",
    };

    const handleClick = () => {
        if (!notification.read) {
            onRead(notification.id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={cn(
                "flex items-start gap-3 p-3 hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-800 last:border-0",
                !notification.read && "bg-slate-800/30"
            )}
        >
            <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700">
                    {notification.fromUserPhoto ? (
                        <Image
                            src={notification.fromUserPhoto}
                            alt={notification.fromUserName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                            {notification.fromUserName.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-1 border border-slate-800">
                    {iconMap[notification.type]}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">
                    <span className="font-semibold text-white">{notification.fromUserName}</span>{" "}
                    {contentMap[notification.type]}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
            </div>

            {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            )}
        </div>
    );
}

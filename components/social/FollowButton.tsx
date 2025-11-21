"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { UserPlus, UserMinus, Clock, Loader2 } from "lucide-react";
import { followUser, unfollowUser, getFollowStatus } from "@/lib/services/follow";
import { useAuth } from "@/lib/hooks/useAuth";

interface FollowButtonProps {
    targetUserId: string;
    isPrivate: boolean;
    className?: string;
    onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ targetUserId, isPrivate, className, onFollowChange }: FollowButtonProps) {
    const { user } = useAuth();
    const [status, setStatus] = useState<'none' | 'pending' | 'following'>('none');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && targetUserId) {
            getFollowStatus(user.uid, targetUserId).then(setStatus);
        }
    }, [user, targetUserId]);

    const handleFollow = async () => {
        if (!user) return;

        setLoading(true);
        try {
            await followUser(user.uid, targetUserId, isPrivate, {
                name: user.displayName || 'User',
                photo: user.photoURL || undefined
            });
            setStatus(isPrivate ? 'pending' : 'following');
            if (!isPrivate && onFollowChange) {
                onFollowChange(true);
            }
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (!user) return;

        setLoading(true);
        try {
            await unfollowUser(user.uid, targetUserId);
            const wasFollowing = status === 'following';
            setStatus('none');
            if (wasFollowing && onFollowChange) {
                onFollowChange(false);
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.uid === targetUserId) {
        return null; // Don't show button for own profile or if not logged in
    }

    if (status === 'following') {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={handleUnfollow}
                disabled={loading}
                className={className}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Following
                    </>
                )}
            </Button>
        );
    }

    if (status === 'pending') {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={handleUnfollow}
                disabled={loading}
                className={className}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        <Clock className="w-4 h-4 mr-2" />
                        Requested
                    </>
                )}
            </Button>
        );
    }

    return (
        <Button
            size="sm"
            onClick={handleFollow}
            disabled={loading}
            className={className}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                </>
            )}
        </Button>
    );
}

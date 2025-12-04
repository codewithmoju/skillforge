"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { getUserData, FirestoreUserData } from "@/lib/services/firestore";
import { Loader2, UserX, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface GroupMembersModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
    members: string[];
    currentUser: FirestoreUserData | null;
    groupCreatorId: string;
    onBan: (userId: string) => Promise<void>;
}

export function GroupMembersModal({ isOpen, onClose, groupId, members, currentUser, groupCreatorId, onBan }: GroupMembersModalProps) {
    const [memberData, setMemberData] = useState<FirestoreUserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [banningId, setBanningId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && members.length > 0) {
            loadMembers();
        }
    }, [isOpen, members]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            // Fetch all members
            // Note: In a real app with large groups, this should be paginated or batched
            const promises = members.map(id => getUserData(id));
            const results = await Promise.all(promises);
            const validUsers = results.filter((u): u is FirestoreUserData => u !== null);
            setMemberData(validUsers);
        } catch (error) {
            console.error("Error loading members:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (userId: string) => {
        if (!confirm("Are you sure you want to ban this member?")) return;

        setBanningId(userId);
        try {
            await onBan(userId);
            setMemberData(prev => prev.filter(u => u.uid !== userId));
        } catch (error) {
            console.error("Error banning member:", error);
        } finally {
            setBanningId(null);
        }
    };

    const isAdmin = currentUser?.uid === groupCreatorId;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Members (${members.length})`}>
            <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-accent-indigo animate-spin" />
                    </div>
                ) : memberData.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No members found.</p>
                ) : (
                    <div className="space-y-3">
                        {memberData.map((member) => (
                            <div key={member.uid} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                                <Link href={`/profile/${member.username}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                    <div className="relative">
                                        {member.profilePicture ? (
                                            <Image
                                                src={member.profilePicture}
                                                alt={member.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                {member.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        {member.uid === groupCreatorId && (
                                            <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-slate-900">
                                                <Shield className="w-3 h-3 text-black fill-current" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white flex items-center gap-2">
                                            {member.name}
                                            {member.uid === currentUser?.uid && <span className="text-xs text-slate-500">(You)</span>}
                                        </p>
                                        <p className="text-xs text-slate-500">@{member.username}</p>
                                    </div>
                                </Link>

                                {isAdmin && member.uid !== currentUser?.uid && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleBan(member.uid)}
                                        disabled={banningId === member.uid}
                                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                                        title="Ban Member"
                                    >
                                        {banningId === member.uid ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <UserX className="w-4 h-4" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
}

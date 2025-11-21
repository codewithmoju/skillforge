'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getGroup, joinGroup, leaveGroup, Group } from '@/lib/services/groups';
import { Loader2, Users, Hash, Calendar, UserPlus, UserMinus } from 'lucide-react';
import { FirestoreUserData } from '@/lib/services/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function GroupPage() {
    const { groupId } = useParams();
    const { user } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed');
    const [members, setMembers] = useState<FirestoreUserData[]>([]);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!groupId) return;
            try {
                const data = await getGroup(groupId as string);
                setGroup(data);
                if (data && user) {
                    setIsMember(data.members.includes(user.uid));
                }

                // Fetch members details (limit to first 10 for now)
                if (data && data.members.length > 0) {
                    const membersToFetch = data.members.slice(0, 10);
                    const memberPromises = membersToFetch.map(uid => getDoc(doc(db, 'users', uid)));
                    const memberDocs = await Promise.all(memberPromises);
                    const membersData = memberDocs
                        .filter(doc => doc.exists())
                        .map(doc => doc.data() as FirestoreUserData);
                    setMembers(membersData);
                }
            } catch (error) {
                console.error('Error fetching group:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [groupId, user]);

    const handleJoinLeave = async () => {
        if (!user || !group || joining) return;

        setJoining(true);
        try {
            if (isMember) {
                await leaveGroup(user.uid, group.id);
                setIsMember(false);
                setGroup(prev => prev ? { ...prev, membersCount: prev.membersCount - 1 } : null);
            } else {
                await joinGroup(user.uid, group.id);
                setIsMember(true);
                setGroup(prev => prev ? { ...prev, membersCount: prev.membersCount + 1 } : null);
            }
        } catch (error) {
            console.error('Error joining/leaving group:', error);
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="flex justify-center items-center min-h-screen text-slate-500">
                Group not found
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
            {/* Header */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-8">
                <div className="h-48 bg-slate-800 relative">
                    {group.imageUrl ? (
                        <img src={group.imageUrl} alt={group.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                            <Users className="w-24 h-24 text-slate-600" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />

                    <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{group.name}</h1>
                            <div className="flex items-center gap-4 text-slate-300 text-sm">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{group.membersCount} members</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleJoinLeave}
                            disabled={joining}
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${isMember
                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                    : 'bg-accent-indigo text-white hover:bg-accent-indigo/90'
                                }`}
                        >
                            {joining ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isMember ? (
                                <>
                                    <UserMinus className="w-5 h-5" />
                                    Leave Group
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Join Group
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 mb-6">
                {(['feed', 'members', 'about'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-accent-cyan' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-cyan rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {activeTab === 'feed' && (
                    <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                        <Hash className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">Discussion Feed</p>
                        <p className="text-sm">Coming soon! Start discussions with other members.</p>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {members.map(member => (
                            <div key={member.uid} className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                                {member.profilePicture ? (
                                    <img src={member.profilePicture} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-white">{member.name}</p>
                                    <p className="text-xs text-slate-400">@{member.username}</p>
                                </div>
                            </div>
                        ))}
                        {group.members.length > 10 && (
                            <div className="flex items-center justify-center p-4 text-slate-500">
                                +{group.members.length - 10} more members
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">About this Community</h3>
                        <p className="text-slate-300 whitespace-pre-wrap mb-6">{group.description}</p>

                        <div className="flex flex-wrap gap-2">
                            {group.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

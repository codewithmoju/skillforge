'use client';

import React from 'react';
import { MessageSquare, Users, Zap, Hash, ArrowRight } from 'lucide-react';
import { FirestoreUserData } from '@/lib/services/firestore';
import Image from 'next/image';

interface EmptyStateEnhancedProps {
    onStartConversation: (user: FirestoreUserData) => void;
    suggestedUsers: FirestoreUserData[];
    loading: boolean;
}

export function EmptyStateEnhanced({ onStartConversation, suggestedUsers, loading }: EmptyStateEnhancedProps) {
    return (
        <div className="w-full h-full bg-slate-900/30 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-8 text-center overflow-y-auto">
            <div className="max-w-md w-full">
                <div className="w-20 h-20 bg-gradient-to-br from-accent-indigo/20 to-accent-violet/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <MessageSquare className="w-10 h-10 text-accent-indigo" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Your Inbox is Empty</h2>
                <p className="text-slate-400 mb-8">
                    Connect with other learners, share knowledge, and build your network.
                    Start a conversation today!
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left hover:border-accent-indigo/50 transition-colors group cursor-pointer">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-white text-sm">Find Mentors</h3>
                        <p className="text-xs text-slate-500 mt-1">Connect with experts in your field</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left hover:border-accent-indigo/50 transition-colors group cursor-pointer">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Zap className="w-4 h-4 text-purple-400" />
                        </div>
                        <h3 className="font-semibold text-white text-sm">Join Challenges</h3>
                        <p className="text-xs text-slate-500 mt-1">Compete and learn with others</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left hover:border-accent-indigo/50 transition-colors group cursor-pointer">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Hash className="w-4 h-4 text-green-400" />
                        </div>
                        <h3 className="font-semibold text-white text-sm">Topic Channels</h3>
                        <p className="text-xs text-slate-500 mt-1">Discuss specific tech topics</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-left hover:border-accent-indigo/50 transition-colors group cursor-pointer">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-4 h-4 text-orange-400" />
                        </div>
                        <h3 className="font-semibold text-white text-sm">Group Chats</h3>
                        <p className="text-xs text-slate-500 mt-1">Collaborate on projects</p>
                    </div>
                </div>

                {loading ? (
                    <div className="h-20 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : suggestedUsers.length > 0 && (
                    <div className="text-left bg-slate-800/30 rounded-xl p-4 border border-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-white text-sm">Suggested for you</h3>
                            <button className="text-xs text-accent-cyan hover:underline flex items-center gap-1">
                                View all <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {suggestedUsers.slice(0, 3).map(user => (
                                <div key={user.uid} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        {user.profilePicture ? (
                                            <Image
                                                src={user.profilePicture}
                                                alt={user.name}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-white group-hover:text-accent-indigo transition-colors">{user.name}</p>
                                            <p className="text-xs text-slate-500">@{user.username}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onStartConversation(user)}
                                        className="p-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-accent-indigo hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

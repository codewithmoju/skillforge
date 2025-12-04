'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Conversation, subscribeToConversations, createConversation } from '@/lib/services/messages';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { EmptyStateEnhanced } from '@/components/messages/EmptyStateEnhanced';
import { MessageList } from '@/components/messages/MessageList';
import { Loader2, X, Search } from 'lucide-react';
import { searchUsers } from '@/lib/services/search';
import { FirestoreUserData } from '@/lib/services/firestore';
import Image from 'next/image';

export default function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);

    // Suggested users state
    const [suggestedUsers, setSuggestedUsers] = useState<FirestoreUserData[]>([]);
    const [suggestedLoading, setSuggestedLoading] = useState(false);

    // New message modal state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FirestoreUserData[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToConversations(user.uid, (convs) => {
            setConversations(convs);
            setLoading(false);

            // Always fetch suggested users so they are available
            fetchSuggestedUsers();
        });

        return () => unsubscribe();
    }, [user]);

    const fetchSuggestedUsers = async () => {
        if (!user) return;
        setSuggestedLoading(true);
        try {
            const { getFollowers } = await import('@/lib/services/follow');
            const { getUserData, getRecentUsers } = await import('@/lib/services/firestore');

            const followerIds = await getFollowers(user.uid);

            if (followerIds.length > 0) {
                const users = await Promise.all(
                    followerIds.slice(0, 5).map(id => getUserData(id))
                );
                const validUsers = users.filter((u): u is FirestoreUserData => u !== null && u.uid !== user.uid);
                if (validUsers.length > 0) {
                    setSuggestedUsers(validUsers);
                    return;
                }
            }

            // Fallback: get recently active users if no followers
            const recentUsers = await getRecentUsers(5);
            setSuggestedUsers(recentUsers.filter(u => u.uid !== user.uid));
        } catch (error) {
            console.error('Error fetching suggested users:', error);
        } finally {
            setSuggestedLoading(false);
        }
    };

    const handleSearchUsers = async (query: string) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const results = await searchUsers(query);
            setSearchResults(results.filter(u => u.uid !== user?.uid));
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setSearching(false);
        }
    };

    const startConversation = async (recipient: FirestoreUserData) => {
        if (!user) return;

        try {
            const participantDetails = {
                [user.uid]: { name: user.displayName || 'User', photo: user.photoURL || undefined },
                [recipient.uid]: { name: recipient.name, photo: recipient.profilePicture }
            };

            await createConversation([user.uid, recipient.uid], participantDetails);

            // Close modal
            setShowNewMessageModal(false);
            setSearchQuery('');
            setSearchResults([]);

        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 text-accent-indigo animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <div className={`
                w-full md:w-[380px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 z-20
                ${selectedConversation ? 'hidden md:flex' : 'flex'}
            `}>
                <MessageList
                    conversations={conversations}
                    selectedId={selectedConversation?.id}
                    onSelect={setSelectedConversation}
                    loading={loading}
                    onNewMessage={() => setShowNewMessageModal(true)}
                />
            </div>

            {/* Chat Area */}
            <div className={`
                flex-1 flex flex-col bg-white dark:bg-slate-950 min-w-0
                ${selectedConversation ? 'flex fixed inset-0 md:static z-30 md:z-auto' : 'hidden md:flex'}
            `}>
                {selectedConversation ? (
                    <div className="w-full h-full flex flex-col relative">
                        {/* Mobile Back Button Overlay - Only visible on mobile */}
                        <div className="md:hidden absolute top-3 left-3 z-50">
                            <button
                                onClick={() => setSelectedConversation(null)}
                                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur text-slate-900 dark:text-white p-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
                            >
                                ←
                            </button>
                        </div>
                        <ChatWindow
                            conversationId={selectedConversation.id}
                            recipientName={selectedConversation.participantDetails[selectedConversation.participants.find(id => id !== user?.uid) || '']?.name || 'User'}
                            recipientPhoto={selectedConversation.participantDetails[selectedConversation.participants.find(id => id !== user?.uid) || '']?.photo}
                        />
                    </div>
                ) : (
                    <div className="hidden md:flex w-full h-full">
                        <EmptyStateEnhanced
                            onStartConversation={startConversation}
                            suggestedUsers={suggestedUsers}
                            loading={suggestedLoading}
                        />
                    </div>
                )}
            </div>

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">New Message</h3>
                            <button
                                onClick={() => setShowNewMessageModal(false)}
                                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchUsers(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-indigo focus:outline-none"
                                    autoFocus
                                />
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                                {searching ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-6 h-6 text-accent-indigo animate-spin" />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map(result => (
                                        <button
                                            key={result.uid}
                                            onClick={() => startConversation(result)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left group"
                                        >
                                            {result.profilePicture ? (
                                                <Image
                                                    src={result.profilePicture}
                                                    alt={result.name}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold">
                                                    {result.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{result.name}</p>
                                                <p className="text-xs text-slate-500">@{result.username}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : searchQuery.length >= 2 ? (
                                    <p className="text-center text-slate-500 py-8">No users found</p>
                                ) : (
                                    <div className="text-center text-slate-500 py-8">
                                        <p>Search for people to chat with</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


'use client';

import Image from 'next/image';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Conversation, subscribeToConversations, createConversation } from '@/lib/services/messages';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { Loader2, Plus, MessageSquare } from 'lucide-react';
import { searchUsers } from '@/lib/services/search';
import { FirestoreUserData } from '@/lib/services/firestore';

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

            // If no conversations, fetch suggested users (followers)
            if (convs.length === 0) {
                fetchSuggestedUsers();
            }
        });

        return () => unsubscribe();
    }, [user]);

    const fetchSuggestedUsers = async () => {
        if (!user) return;
        setSuggestedLoading(true);
        try {
            const { getFollowers } = await import('@/lib/services/follow');
            const { getUserData } = await import('@/lib/services/firestore');

            const followerIds = await getFollowers(user.uid);

            if (followerIds.length > 0) {
                const users = await Promise.all(
                    followerIds.slice(0, 5).map(id => getUserData(id))
                );
                setSuggestedUsers(users.filter((u): u is FirestoreUserData => u !== null));
            }
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

            const conversationId = await createConversation([user.uid, recipient.uid], participantDetails);

            setShowNewMessageModal(false);
            setSearchQuery('');
            setSearchResults([]);
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)] max-w-6xl mx-auto p-4 flex gap-6">
            {/* Sidebar */}
            <div className={`w-full md:w-80 flex flex-col bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="font-bold text-white text-lg">Messages</h2>
                    <button
                        onClick={() => setShowNewMessageModal(true)}
                        className="p-2 bg-accent-indigo/20 text-accent-indigo rounded-full hover:bg-accent-indigo/30 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.length > 0 ? (
                        conversations.map((conv) => {
                            const otherUserId = conv.participants.find(id => id !== user?.uid) || '';
                            const otherUser = conv.participantDetails[otherUserId];
                            const unread = conv.unreadCount[user?.uid || ''] || 0;

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 ${selectedConversation?.id === conv.id ? 'bg-slate-800/80' : ''
                                        }`}
                                >
                                    {otherUser?.photo ? (
                                        <Image
                                            src={otherUser.photo}
                                            alt={otherUser.name}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                            {otherUser?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className={`font-semibold truncate ${unread > 0 ? 'text-white' : 'text-slate-300'}`}>
                                                {otherUser?.name || 'Unknown User'}
                                            </h3>
                                            {unread > 0 && (
                                                <span className="bg-accent-indigo text-white text-xs px-2 py-0.5 rounded-full">
                                                    {unread}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm truncate ${unread > 0 ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                                            {conv.lastMessage || 'Start a conversation'}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No conversations yet</p>
                            <button
                                onClick={() => setShowNewMessageModal(true)}
                                className="mt-4 text-accent-cyan hover:underline block mx-auto mb-8"
                            >
                                Start a chat
                            </button>

                            {suggestedLoading ? (
                                <div className="flex justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                                </div>
                            ) : suggestedUsers.length > 0 && (
                                <div className="text-left">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Suggested People</p>
                                    <div className="space-y-2">
                                        {suggestedUsers.map(u => (
                                            <button
                                                key={u.uid}
                                                onClick={() => startConversation(u)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
                                            >
                                                {u.profilePicture ? (
                                                    <Image
                                                        src={u.profilePicture}
                                                        alt={u.name}
                                                        width={32}
                                                        height={32}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-bold">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-slate-300">{u.name}</p>
                                                    <p className="text-xs text-slate-500">@{u.username}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                {selectedConversation ? (
                    <div className="w-full h-full flex flex-col">
                        <div className="md:hidden mb-2">
                            <button
                                onClick={() => setSelectedConversation(null)}
                                className="text-slate-400 hover:text-white flex items-center gap-2"
                            >
                                ← Back to messages
                            </button>
                        </div>
                        <ChatWindow
                            conversationId={selectedConversation.id}
                            recipientName={selectedConversation.participantDetails[selectedConversation.participants.find(id => id !== user?.uid) || '']?.name || 'User'}
                            recipientPhoto={selectedConversation.participantDetails[selectedConversation.participants.find(id => id !== user?.uid) || '']?.photo}
                        />
                    </div>
                ) : (
                    <div className="w-full h-full bg-slate-900/30 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>Select a conversation to start messaging</p>
                        </div>
                    </div>
                )}
            </div>

            {/* New Message Modal */}
            {showNewMessageModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-white">New Message</h3>
                            <button
                                onClick={() => setShowNewMessageModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchUsers(e.target.value)}
                                placeholder="Search users..."
                                className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-indigo focus:outline-none mb-4"
                                autoFocus
                            />

                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {searching ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="w-6 h-6 text-accent-cyan animate-spin" />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map(result => (
                                        <button
                                            key={result.uid}
                                            onClick={() => startConversation(result)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-colors text-left"
                                        >
                                            {result.profilePicture ? (
                                                <Image
                                                    src={result.profilePicture}
                                                    alt={result.name}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                                    {result.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-white">{result.name}</p>
                                                <p className="text-xs text-slate-400">@{result.username}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : searchQuery.length >= 2 ? (
                                    <p className="text-center text-slate-500 py-4">No users found</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

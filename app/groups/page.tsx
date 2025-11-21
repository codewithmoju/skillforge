'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getGroups, Group, createGroup } from '@/lib/services/groups';
import { GroupCard } from '@/components/groups/GroupCard';
import { Loader2, Plus, Search, Users } from 'lucide-react';

export default function GroupsPage() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Create group form state
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupTags, setNewGroupTags] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getGroups();
                setGroups(data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newGroupName.trim() || creating) return;

        setCreating(true);
        try {
            const tags = newGroupTags.split(',').map(t => t.trim()).filter(t => t);
            await createGroup(user.uid, newGroupName, newGroupDesc, tags);

            // Refresh groups
            const data = await getGroups();
            setGroups(data);

            setShowCreateModal(false);
            setNewGroupName('');
            setNewGroupDesc('');
            setNewGroupTags('');
        } catch (error) {
            console.error('Error creating group:', error);
        } finally {
            setCreating(false);
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
        <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Communities</h1>
                    <p className="text-slate-400">Connect with others who share your interests</p>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center gap-2 bg-accent-indigo hover:bg-accent-indigo/90 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Create Group
                </button>
            </div>

            {/* Search - Placeholder for now */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search communities..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-cyan focus:outline-none"
                />
            </div>

            {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(group => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">No communities found</p>
                    <p className="text-sm">Be the first to create one!</p>
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Create Community</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreateGroup} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                    className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-indigo focus:outline-none"
                                    placeholder="e.g. React Developers"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                                <textarea
                                    value={newGroupDesc}
                                    onChange={(e) => setNewGroupDesc(e.target.value)}
                                    className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-indigo focus:outline-none h-24 resize-none"
                                    placeholder="What is this community about?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={newGroupTags}
                                    onChange={(e) => setNewGroupTags(e.target.value)}
                                    className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-accent-indigo focus:outline-none"
                                    placeholder="e.g. react, javascript, webdev"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full bg-accent-indigo hover:bg-accent-indigo/90 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Community'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

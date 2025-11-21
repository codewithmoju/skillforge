'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import { UserResultCard } from '@/components/search/UserResultCard';
import { PostCard } from '@/components/social/PostCard';
import { searchUsers, searchPosts, searchRoadmaps } from '@/lib/services/search';
import { FirestoreUserData } from '@/lib/services/firestore';
import { Post } from '@/lib/services/posts';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'roadmaps'>('users');
    const [loading, setLoading] = useState(false);
    const [trendingLoading, setTrendingLoading] = useState(true);

    const [users, setUsers] = useState<FirestoreUserData[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [roadmaps, setRoadmaps] = useState<Post[]>([]);
    const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchTrending = async () => {
            setTrendingLoading(true);
            try {
                const { getTrendingPosts } = await import('@/lib/services/posts');
                const trending = await getTrendingPosts(10);
                setTrendingPosts(trending);
            } catch (error) {
                console.error('Error fetching trending posts:', error);
            } finally {
                setTrendingLoading(false);
            }
        };

        fetchTrending();
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setUsers([]);
                setPosts([]);
                setRoadmaps([]);
                return;
            }

            setLoading(true);
            try {
                const [usersRes, postsRes, roadmapsRes] = await Promise.all([
                    searchUsers(query),
                    searchPosts(query),
                    searchRoadmaps(query)
                ]);

                setUsers(usersRes);
                setPosts(postsRes);
                setRoadmaps(roadmapsRes);
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const tabs = [
        { id: 'users', label: 'Users', count: users.length },
        { id: 'posts', label: 'Posts', count: posts.length },
        { id: 'roadmaps', label: 'Roadmaps', count: roadmaps.length },
    ] as const;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-4">Search</h1>
                <SearchBar />
            </div>

            {query ? (
                <>
                    {/* Tabs */}
                    <div className="flex border-b border-slate-800 mb-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-accent-cyan text-accent-cyan'
                                    : 'border-transparent text-slate-400 hover:text-white'
                                    }`}
                            >
                                {tab.label} <span className="ml-1 text-xs opacity-70">({tab.count})</span>
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeTab === 'users' && (
                                <div className="space-y-3">
                                    {users.length > 0 ? (
                                        users.map(user => (
                                            <UserResultCard key={user.uid} user={user} />
                                        ))
                                    ) : (
                                        <p className="text-center text-slate-500 py-8">No users found matching "{query}"</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'posts' && (
                                <div className="space-y-4">
                                    {posts.length > 0 ? (
                                        posts.map(post => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    ) : (
                                        <p className="text-center text-slate-500 py-8">No posts found matching "{query}"</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'roadmaps' && (
                                <div className="space-y-4">
                                    {roadmaps.length > 0 ? (
                                        roadmaps.map(post => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                    ) : (
                                        <p className="text-center text-slate-500 py-8">No roadmaps found matching "{query}"</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white">Trending Now</h2>
                    {trendingLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                        </div>
                    ) : trendingPosts.length > 0 ? (
                        <div className="space-y-6">
                            {trendingPosts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500">
                            <p>No trending posts at the moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

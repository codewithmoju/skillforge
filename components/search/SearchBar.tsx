'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setQuery(q);
        }
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search users, posts, roadmaps..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-white bg-blue-600 rounded-r-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                    Search
                </button>
            </div>
        </form>
    );
}

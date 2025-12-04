"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, User, BookOpen, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSkinContext } from "@/lib/contexts/SkinContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SearchResult {
    id: string;
    type: 'user' | 'course';
    title: string;
    subtitle?: string;
    image?: string;
    url: string;
}

export function GlobalSearch() {
    const [queryText, setQueryText] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const skinContext = useSkinContext();
    const { shouldApplySkin, colors } = skinContext || { shouldApplySkin: false, colors: null };
    const safeColors = shouldApplySkin && colors ? colors : null;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const search = async () => {
            if (queryText.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const searchResults: SearchResult[] = [];

                // Search Users
                const usersRef = collection(db, "users");
                // Note: Firestore doesn't support native full-text search. 
                // We'll use a simple prefix match on 'name' for now.
                // For production, consider Algolia or Typesense.
                const usersQuery = query(
                    usersRef,
                    where("name", ">=", queryText),
                    where("name", "<=", queryText + '\uf8ff'),
                    limit(3)
                );
                const usersSnap = await getDocs(usersQuery);
                usersSnap.forEach(doc => {
                    const data = doc.data();
                    searchResults.push({
                        id: doc.id,
                        type: 'user',
                        title: data.name || "Unknown User",
                        subtitle: `Level ${data.level || 1}`,
                        image: data.photoURL,
                        url: `/profile/${doc.id}`
                    });
                });

                // Search Courses
                const coursesRef = collection(db, "courses");
                const coursesQuery = query(
                    coursesRef,
                    where("topic", ">=", queryText),
                    where("topic", "<=", queryText + '\uf8ff'),
                    limit(3)
                );
                const coursesSnap = await getDocs(coursesQuery);
                coursesSnap.forEach(doc => {
                    const data = doc.data();
                    searchResults.push({
                        id: doc.id,
                        type: 'course',
                        title: data.topic,
                        subtitle: `${data.level || 'Beginner'} • ${data.syllabus?.modules?.length || 0} modules`,
                        url: `/courses/${doc.id}`
                    });
                });

                setResults(searchResults);
                setIsOpen(true);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [queryText]);

    const handleSelect = (url: string) => {
        setIsOpen(false);
        setQueryText("");
        router.push(url);
    };

    return (
        <div ref={wrapperRef} className="relative w-96 hidden md:block">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-500"
                style={{ color: safeColors ? safeColors.textMuted : "#94a3b8" }}
            />
            <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onFocus={() => setIsOpen(true)}
                placeholder="Search users, courses..."
                className="w-full border rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all duration-500 outline-none"
                style={{
                    backgroundColor: safeColors ? `${safeColors.backgroundCard}80` : "rgba(30, 41, 59, 0.5)",
                    borderColor: safeColors ? `${safeColors.primary}40` : "rgba(148, 163, 184, 0.2)",
                    color: safeColors ? safeColors.textPrimary : "#f8fafc",
                }}
            />
            {queryText && (
                <button
                    onClick={() => { setQueryText(""); setResults([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            <AnimatePresence>
                {isOpen && (queryText.length >= 2 || loading) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
                    >
                        {loading ? (
                            <div className="p-4 flex items-center justify-center text-slate-400">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Searching...
                            </div>
                        ) : results.length > 0 ? (
                            <div className="py-2">
                                {results.map((result) => (
                                    <div
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleSelect(result.url)}
                                        className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                                            {result.type === 'user' ? (
                                                result.image ? (
                                                    <Image src={result.image} alt={result.title} width={32} height={32} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4 text-slate-400" />
                                                )
                                            ) : (
                                                <BookOpen className="w-4 h-4 text-cyan-400" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{result.title}</p>
                                            <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-slate-400 text-sm">
                                No results found for "{queryText}"
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

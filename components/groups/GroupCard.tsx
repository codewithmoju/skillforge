'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { Group } from '@/lib/services/groups';
import Image from 'next/image';

interface GroupCardProps {
    group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
    return (
        <Link href={`/groups/${group.id}`} className="block">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-accent-cyan/50 transition-all group h-full flex flex-col">
                <div className="h-32 bg-slate-800 relative overflow-hidden">
                    {group.imageUrl ? (
                        <Image
                            src={group.imageUrl}
                            alt={group.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                            <Users className="w-12 h-12 text-slate-600" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                        {group.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                        {group.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{group.membersCount} members</span>
                        </div>
                        <div className="flex gap-2">
                            {group.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

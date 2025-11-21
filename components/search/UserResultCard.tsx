import Link from 'next/link';
import Image from 'next/image';
import { FirestoreUserData } from '@/lib/services/firestore';

interface UserResultCardProps {
    user: FirestoreUserData;
}

export function UserResultCard({ user }: UserResultCardProps) {
    return (
        <Link href={`/profile/${user.username}`} className="block">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                {user.profilePicture ? (
                    <Image
                        src={user.profilePicture}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{user.name}</h3>
                    <p className="text-slate-400 text-sm truncate">@{user.username}</p>
                    {user.bio && (
                        <p className="text-slate-500 text-sm truncate mt-1">{user.bio}</p>
                    )}
                </div>
                <div className="flex flex-col items-end text-xs text-slate-500">
                    <span>{user.followers} followers</span>
                    <span>Lvl {user.level}</span>
                </div>
            </div>
        </Link>
    );
}

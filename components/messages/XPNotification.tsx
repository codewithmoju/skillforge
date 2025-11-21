'use client';

import { useEffect, useState } from 'react';

interface XPNotificationProps {
    amount: number;
    reason?: string;
    onComplete: () => void;
}

export function XPNotification({ amount, reason, onComplete }: XPNotificationProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 300); // Wait for exit animation
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div
            className={`fixed bottom-24 right-8 z-50 pointer-events-none transition-all duration-300 transform ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90'
                }`}
        >
            <div className="bg-slate-900/90 backdrop-blur-md border border-accent-indigo/50 px-4 py-2 rounded-xl shadow-xl shadow-accent-indigo/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold text-xs animate-bounce">
                    XP
                </div>
                <div>
                    <p className="text-accent-cyan font-bold text-lg leading-none">+{amount}</p>
                    {reason && <p className="text-xs text-slate-400">{reason}</p>}
                </div>
            </div>
        </div>
    );
}

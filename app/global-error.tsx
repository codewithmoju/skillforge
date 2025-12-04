'use client';

import * as Sentry from "@sentry/nextjs";
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
        console.error('Global error:', error);
    }, [error]);

    return (
        <html>
            <body className="bg-slate-950 text-white">
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Critical Error</h2>
                        <p className="text-slate-400 mb-6 break-words text-sm">
                            {error.message || "A critical error occurred."}
                        </p>
                        <Button onClick={() => reset()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}

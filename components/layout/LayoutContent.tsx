"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfileCompletionModal } from "@/components/features/ProfileCompletionModal";
import { useFirestoreSync } from "@/lib/hooks/useFirestoreSync";
import { SkinProvider } from "@/lib/contexts/SkinContext";
import { useUserStore } from "@/lib/store";
import { ForestQuestWrapper } from "@/components/skins/forest-quest/ForestQuestWrapper";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/features" || pathname?.startsWith("/docs");
    const isMessagesPage = pathname === "/messages";
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const selectedSkin = useUserStore((state) => state.selectedSkin);

    const showForestSkin = selectedSkin === 'forest-quest' && pathname?.startsWith('/roadmap');

    // Sync Firestore data with Zustand store
    const { needsProfileCompletion, user, onProfileComplete } = useFirestoreSync();

    if (isPublicPage) {
        return <>{children}</>;
    }

    return (
        <>
            {needsProfileCompletion && user && (
                <ProfileCompletionModal
                    isOpen={true}
                    userId={user.uid}
                    email={user.email || ''}
                    displayName={user.displayName || 'User'}
                    onComplete={onProfileComplete}
                />
            )}

            <ProtectedRoute>
                <SkinProvider>
                    {showForestSkin ? (
                        <ForestQuestWrapper>{children}</ForestQuestWrapper>
                    ) : (
                        <>
                            {/* Mobile Header */}
                            {!isMessagesPage && <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />}

                            {/* Mobile Drawer */}
                            <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

                            <div className="flex min-h-screen">
                                {/* Desktop Sidebar */}
                                <Sidebar />

                                <div className={`flex-1 flex flex-col ${isMessagesPage
                                    ? 'fixed inset-0 md:left-20 z-0 bg-slate-950'
                                    : 'md:pl-20 min-h-screen'
                                    }`}>
                                    {/* Desktop TopBar */}
                                    {!isMessagesPage && <TopBar />}

                                    {/* Main Content */}
                                    <main className={`flex-1 w-full ${isMessagesPage
                                        ? 'h-full overflow-hidden p-0'
                                        : (pathname === '/roadmap' || pathname === '/courses')
                                            ? 'p-0 pt-16 md:pt-0 overflow-y-auto'
                                            : 'p-4 md:px-8 md:pb-8 md:pt-24 pt-16 pb-20 overflow-y-auto'
                                        }`}>
                                        <ErrorBoundary>
                                            {children}
                                        </ErrorBoundary>
                                    </main>
                                </div>
                            </div>

                            {/* Mobile Bottom Navigation */}
                            {!isMessagesPage && <MobileNav />}
                        </>
                    )}
                </SkinProvider>
            </ProtectedRoute>
        </>
    );
}

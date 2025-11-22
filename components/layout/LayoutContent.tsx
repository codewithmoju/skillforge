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
import useSkinStore from "@/lib/store/skinStore";
import { ForestQuestWrapper } from "@/components/skins/forest-quest/ForestQuestWrapper";

export function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/signup";
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { currentSkin } = useSkinStore();

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
                    {currentSkin === 'forest-quest' ? (
                        <ForestQuestWrapper>{children}</ForestQuestWrapper>
                    ) : (
                        <>
                            {/* Mobile Header */}
                            <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />

                            {/* Mobile Drawer */}
                            <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

                            <div className="flex min-h-screen">
                                {/* Desktop Sidebar */}
                                <Sidebar />

                                <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                                    {/* Desktop TopBar */}
                                    <TopBar />

                                    {/* Main Content */}
                                    <main className="flex-1 p-4 md:p-8 pt-16 md:pt-0 pb-20 md:pb-8 overflow-y-auto">
                                        {children}
                                    </main>
                                </div>
                            </div>

                            {/* Mobile Bottom Navigation */}
                            <MobileNav />
                        </>
                    )}
                </SkinProvider>
            </ProtectedRoute>
        </>
    );
}

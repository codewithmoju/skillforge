export interface Recommendation {
    topic: string;
    reason: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    color: string;
}

export const recommendationService = {
    async getRecommendations(): Promise<Recommendation[]> {
        try {
            // 1. Gather Local History
            const history = [];
            if (typeof window !== 'undefined') {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('course-')) {
                        try {
                            const course = JSON.parse(localStorage.getItem(key) || '{}');
                            if (course.title) {
                                history.push(course.title);
                            }
                        } catch (e) {
                            console.warn('Failed to parse course history', e);
                        }
                    }
                }
            }

            // Limit history to last 5 items to keep prompt small
            const recentHistory = history.slice(-5);

            // 2. Call API
            const res = await fetch('/api/ai/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: recentHistory,
                    currentLevel: 'Intermediate' // TODO: Calculate from user stats
                })
            });

            const data = await res.json();
            return data.recommendations || [];

        } catch (error) {
            console.error("Failed to get recommendations:", error);
            return [];
        }
    }
};

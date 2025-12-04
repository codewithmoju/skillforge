import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';

interface RateLimitConfig {
    maxRequests: number;
    windowSeconds: number;
}

interface RateLimitData {
    count: number;
    resetTime: Timestamp;
}

// Configuration for different endpoints
export const RATE_LIMIT_CONFIGS = {
    AI_GENERATION: { maxRequests: 5, windowSeconds: 3600 }, // 5 requests per hour
    POST_CREATION: { maxRequests: 10, windowSeconds: 600 }, // 10 posts per 10 minutes
    COMMENT_CREATION: { maxRequests: 30, windowSeconds: 300 }, // 30 comments per 5 minutes
};

/**
 * Checks if a user or IP is rate limited for a specific action.
 * Uses Firestore to persist limits across server instances.
 * 
 * @param identifier - UserId or IP address
 * @param action - The action key (e.g., 'AI_GENERATION')
 * @returns { success: boolean, resetTime?: Date }
 */
export async function checkRateLimit(
    identifier: string,
    action: keyof typeof RATE_LIMIT_CONFIGS
): Promise<{ success: boolean; resetTime?: Date }> {
    try {
        const config = RATE_LIMIT_CONFIGS[action];
        const now = Timestamp.now();
        const rateLimitId = `ratelimit_${identifier}_${action}`;
        const docRef = doc(db, 'rate_limits', rateLimitId);

        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // First request
            const resetTime = new Timestamp(now.seconds + config.windowSeconds, 0);
            await setDoc(docRef, {
                count: 1,
                resetTime: resetTime,
                createdAt: now
            });
            return { success: true };
        }

        const data = docSnap.data() as RateLimitData;

        // Check if window has expired
        if (now.seconds > data.resetTime.seconds) {
            // Reset window
            const resetTime = new Timestamp(now.seconds + config.windowSeconds, 0);
            await setDoc(docRef, {
                count: 1,
                resetTime: resetTime,
                updatedAt: now
            });
            return { success: true };
        }

        // Check limit
        if (data.count >= config.maxRequests) {
            return {
                success: false,
                resetTime: data.resetTime.toDate()
            };
        }

        // Increment count
        await updateDoc(docRef, {
            count: increment(1),
            updatedAt: now
        });

        return { success: true };

    } catch (error) {
        console.error('Rate limit check failed:', error);
        // Fail open to avoid blocking legitimate users on system error, 
        // but log it. In strict mode, you might want to fail closed.
        return { success: true };
    }
}

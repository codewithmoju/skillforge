import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export type BehaviorEventType =
    | 'view_lesson'
    | 'complete_quiz'
    | 'generate_course'
    | 'search'
    | 'social_interaction'
    | 'view_post'
    | 'like_post'
    | 'save_post';

export interface BehaviorEvent {
    userId: string;
    type: BehaviorEventType;
    data: {
        targetId?: string; // lessonId, postId, etc.
        duration?: number; // Time spent in seconds
        outcome?: 'success' | 'failure' | 'abandoned';
        tags?: string[];
        sentiment?: number; // -1 to 1
        metadata?: Record<string, any>;
    };
    timestamp?: any; // Firestore timestamp
}

class UserBehaviorService {
    private queue: BehaviorEvent[] = [];
    private isProcessing = false;
    private BATCH_SIZE = 10;
    private FLUSH_INTERVAL = 10000; // 10 seconds

    constructor() {
        if (typeof window !== 'undefined') {
            // Flush queue periodically
            setInterval(() => this.flushQueue(), this.FLUSH_INTERVAL);

            // Flush on page unload
            window.addEventListener('beforeunload', () => this.flushQueue());
        }
    }

    /**
     * Log a user behavior event.
     * Uses requestIdleCallback to avoid blocking the main thread.
     */
    public log(userId: string, type: BehaviorEventType, data: BehaviorEvent['data']) {
        const event: BehaviorEvent = {
            userId,
            type,
            data,
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => {
                this.queue.push(event);
                if (this.queue.length >= this.BATCH_SIZE) {
                    this.flushQueue();
                }
            });
        } else {
            // Fallback for environments without requestIdleCallback
            this.queue.push(event);
            if (this.queue.length >= this.BATCH_SIZE) {
                this.flushQueue();
            }
        }
    }

    /**
     * Flush the event queue to Firestore.
     */
    private async flushQueue() {
        if (this.queue.length === 0 || this.isProcessing) return;

        this.isProcessing = true;
        const eventsToProcess = [...this.queue];
        this.queue = [];

        try {
            // In a real high-scale app, we might send this to an analytics endpoint.
            // For Firestore, we'll add them individually but concurrently to avoid a single large batch failure.
            // Ideally, we'd use a cloud function to ingest these, but direct write is fine for now.

            const promises = eventsToProcess.map(event =>
                addDoc(collection(db, 'user_behavior'), {
                    ...event,
                    timestamp: serverTimestamp()
                })
            );

            await Promise.all(promises);
            console.log(`[UserBehavior] Flushed ${eventsToProcess.length} events`);
        } catch (error) {
            console.error('[UserBehavior] Failed to flush events:', error);
            // Re-queue failed events (optional, maybe limit retries)
            this.queue = [...eventsToProcess, ...this.queue];
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Retrieve recent logs for a user to provide context for AI.
     */
    public async getRecentLogs(userId: string, count: number = 5): Promise<BehaviorEvent[]> {
        try {
            const q = query(
                collection(db, 'user_behavior'),
                where('userId', '==', userId),
                orderBy('timestamp', 'desc'),
                limit(count)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as BehaviorEvent);
        } catch (error) {
            console.error('[UserBehavior] Failed to fetch logs:', error);
            return [];
        }
    }
}

export const userBehavior = new UserBehaviorService();

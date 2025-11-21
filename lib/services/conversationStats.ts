import { db } from '@/lib/firebase';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';

export interface ConversationStats {
    id: string; // conversationId_userId
    conversationId: string;
    userId: string;

    // Streak tracking
    currentStreak: number;
    longestStreak: number;
    lastMessageDate: string; // ISO date string YYYY-MM-DD

    // Message counts
    totalMessagesSent: number;

    // Level system
    level: number;
    xp: number;
    messagesForNextLevel: number;

    // Achievements
    achievementsUnlocked: string[];
}

export interface MessageAchievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
    condition: (stats: ConversationStats) => boolean;
}

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1700, 2300, 3000];

export const ACHIEVEMENTS: MessageAchievement[] = [
    {
        id: 'first_message',
        title: 'First Hello',
        description: 'Send your first message',
        icon: '👋',
        xpReward: 10,
        condition: (stats) => stats.totalMessagesSent >= 1
    },
    {
        id: 'streak_3',
        title: 'Heating Up',
        description: 'Reach a 3-day streak',
        icon: '🔥',
        xpReward: 50,
        condition: (stats) => stats.currentStreak >= 3
    },
    {
        id: 'streak_7',
        title: 'On Fire',
        description: 'Reach a 7-day streak',
        icon: '🚀',
        xpReward: 100,
        condition: (stats) => stats.currentStreak >= 7
    },
    {
        id: 'level_5',
        title: 'Conversation Starter',
        description: 'Reach Level 5',
        icon: '⭐',
        xpReward: 200,
        condition: (stats) => stats.level >= 5
    },
    {
        id: 'messages_100',
        title: 'Chatterbox',
        description: 'Send 100 messages',
        icon: '💬',
        xpReward: 150,
        condition: (stats) => stats.totalMessagesSent >= 100
    }
];

export async function getConversationStats(conversationId: string, userId: string): Promise<ConversationStats> {
    const statsId = `${conversationId}_${userId}`;
    const statsRef = doc(db, 'conversationStats', statsId);
    const statsSnap = await getDoc(statsRef);

    if (statsSnap.exists()) {
        return statsSnap.data() as ConversationStats;
    }

    // Initialize stats if not exists
    const initialStats: ConversationStats = {
        id: statsId,
        conversationId,
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastMessageDate: '',
        totalMessagesSent: 0,
        level: 1,
        xp: 0,
        messagesForNextLevel: LEVEL_THRESHOLDS[1],
        achievementsUnlocked: []
    };

    await setDoc(statsRef, initialStats);
    return initialStats;
}

export async function updateStatsOnMessage(conversationId: string, userId: string): Promise<{
    xpGained: number;
    levelUp: boolean;
    newLevel?: number;
    achievementsUnlocked: MessageAchievement[];
}> {
    const stats = await getConversationStats(conversationId, userId);
    const today = new Date().toISOString().split('T')[0];

    let xpGained = 5; // Base XP per message
    let levelUp = false;
    let newLevel = stats.level;
    const unlockedAchievements: MessageAchievement[] = [];

    // Update Streak
    let currentStreak = stats.currentStreak;
    if (stats.lastMessageDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (stats.lastMessageDate === yesterdayStr) {
            currentStreak++;
            xpGained += 10; // Streak bonus
        } else if (stats.lastMessageDate < yesterdayStr) {
            currentStreak = 1; // Reset streak
        } else {
            currentStreak = 1; // First message ever or today
        }
    }

    // Update Level
    let currentXp = stats.xp + xpGained;
    let nextLevelThreshold = LEVEL_THRESHOLDS[stats.level] || (stats.level * 100); // Fallback logic

    if (currentXp >= nextLevelThreshold) {
        levelUp = true;
        newLevel++;
        currentXp -= nextLevelThreshold; // Carry over excess XP? Or cumulative? Let's do cumulative total XP for simplicity in display, but for levels usually it's total.
        // Actually, let's just track total XP and calculate level from that, or store level directly.
        // Let's stick to the simple logic: Level up if total XP crosses threshold.
        // Wait, LEVEL_THRESHOLDS are cumulative totals? Yes.

        // Re-calculate level based on total XP (if we were storing total XP)
        // But here we are adding to stats.xp. Let's assume stats.xp is TOTAL XP.
    }

    // Let's refine level logic:
    // stats.xp is the TOTAL accumulated XP.
    // We check if new total XP >= threshold for next level.

    const newTotalXp = stats.xp + xpGained;
    const nextLevelXp = LEVEL_THRESHOLDS[stats.level]; // Threshold to reach next level (index matches current level to get next threshold? No, index 1 is for level 2)

    // LEVEL_THRESHOLDS = [0, 50, 150...]
    // Level 1: 0-49 XP
    // Level 2: 50-149 XP

    if (newTotalXp >= LEVEL_THRESHOLDS[stats.level]) {
        levelUp = true;
        newLevel = stats.level + 1;
    }

    // Update Stats Object locally first for achievement check
    const updatedStats: ConversationStats = {
        ...stats,
        currentStreak,
        longestStreak: Math.max(currentStreak, stats.longestStreak),
        lastMessageDate: today,
        totalMessagesSent: stats.totalMessagesSent + 1,
        xp: newTotalXp,
        level: newLevel,
        messagesForNextLevel: (LEVEL_THRESHOLDS[newLevel] || (newLevel * 500)) - newTotalXp // Remaining XP needed
    };

    // Check Achievements
    ACHIEVEMENTS.forEach(achievement => {
        if (!stats.achievementsUnlocked.includes(achievement.id) && achievement.condition(updatedStats)) {
            unlockedAchievements.push(achievement);
            updatedStats.achievementsUnlocked.push(achievement.id);
            updatedStats.xp += achievement.xpReward; // Award achievement XP
            xpGained += achievement.xpReward;
        }
    });

    // Save to Firestore
    const statsRef = doc(db, 'conversationStats', stats.id);
    await updateDoc(statsRef, {
        currentStreak: updatedStats.currentStreak,
        longestStreak: updatedStats.longestStreak,
        lastMessageDate: updatedStats.lastMessageDate,
        totalMessagesSent: increment(1),
        xp: updatedStats.xp,
        level: updatedStats.level,
        achievementsUnlocked: updatedStats.achievementsUnlocked
    });

    return {
        xpGained,
        levelUp,
        newLevel: levelUp ? newLevel : undefined,
        achievementsUnlocked: unlockedAchievements
    };
}

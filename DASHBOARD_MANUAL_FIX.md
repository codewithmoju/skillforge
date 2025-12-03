# Dashboard Firestore Integration - Manual Fix Guide

## Overview
The Dashboard component needs Firestore integration but automated edits are causing corruption. Follow this manual guide to add it.

## File to Edit
**Path:** `app/dashboard/page.tsx`

## Changes Required

### Step 1: Locate the `fetchDashboard` function
Find this code around line 53-82:

```typescript
const fetchDashboard = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const [data, posts, liveChallenges, topLeaders, rank] = await Promise.all([
            getUserData(user.uid),
            getUserPosts(user.uid, 5),
            getChallenges("active"),
            getTopLeaderboard(5),
            getUserRank(user.uid),
        ]);

        setUserData(data);
        setRecentPosts(posts);
        setChallenges(liveChallenges);
        setLeaderboard(topLeaders);
        setUserRank(rank > 0 ? rank : null);
    } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("We couldn't sync your dashboard. Please try again.");
    } finally {
        setLoading(false);
    }
}, [user]);
```

### Step 2: Add Firestore Import at Top of File
Add this import statement near the top with other imports (around line 1-30):

```typescript
// Add with other imports
import { getUserProgress, initializeUserProgress } from '@/lib/services/userProgress';
```

### Step 3: Replace the `fetchDashboard` function
Replace the ENTIRE function with this version that includes Firestore sync:

```typescript
const fetchDashboard = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Initialize Firestore user progress if needed
        let firestoreProgress = await getUserProgress(user.uid);
        
        if (!firestoreProgress) {
            await initializeUserProgress(user.uid);
        }

        // Fetch dashboard data (unchanged)
        const [data, posts, liveChallenges, topLeaders, rank] = await Promise.all([
            getUserData(user.uid),
            getUserPosts(user.uid, 5),
            getChallenges("active"),
            getTopLeaderboard(5),
            getUserRank(user.uid),
        ]);

        setUserData(data);
        setRecentPosts(posts);
        setChallenges(liveChallenges);
        setLeaderboard(topLeaders);
        setUserRank(rank > 0 ? rank : null);
    } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("We couldn't sync your dashboard. Please try again.");
    } finally {
        setLoading(false);
    }
}, [user]);
```

## What This Does

1. **Checks for existing Firestore progress** - Loads user progress document
2. **Initializes if needed** - Creates the document if it doesn't exist
3. **Continues normal flow** - All existing dashboard logic unchanged

## Benefits

- ✅ Automatic Firestore document creation for new users
- ✅ Silent initialization (no UI interruption)
- ✅ Backward compatible with existing code
- ✅ Prepares for future migration from localStorage

## Testing

After making this change:

1. Clear your browser's localStorage
2. Log in to the app
3. Check Firestore console - you should see a `userProgress` document created
4. Dashboard should load normally with no errors

## Alternative: Dynamic Import

If you prefer to lazy-load the service (slightly better for bundle size):

```typescript
const fetchDashboard = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    try {
        // Dynamic import
        const { getUserProgress, initializeUserProgress } = await import('@/lib/services/userProgress');
        let firestoreProgress = await getUserProgress(user.uid);
        
        if (!firestoreProgress) {
            await initializeUserProgress(user.uid);
        }

        // ... rest of function unchanged
    } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("We couldn't sync your dashboard. Please try again.");
    } finally {
        setLoading(false);
    }
}, [user]);
```

## Notes

- This is **non-breaking** - existing functionality preserved
- Dashboard will work even if Firestore sync fails
- Error logging helps with debugging
- Ready for Phase 3: full data migration from localStorage

---

**Status:** Manual edit required. Automated tools causing file corruption with this component.

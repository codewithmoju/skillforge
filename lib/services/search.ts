import { db } from '../firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { FirestoreUserData } from './firestore';
import { Post } from './posts';

export interface SearchResults {
    users: FirestoreUserData[];
    posts: Post[];
    roadmaps: Post[];
}

export async function searchUsers(queryText: string, limitCount: number = 10): Promise<FirestoreUserData[]> {
    try {
        if (!queryText.trim()) return [];

        const usersRef = collection(db, 'users');
        const lowerCaseQuery = queryText.toLowerCase();

        // Search by username (prefix match)
        const qUsername = query(
            usersRef,
            where('username', '>=', lowerCaseQuery),
            where('username', '<=', lowerCaseQuery + '\uf8ff'),
            limit(limitCount)
        );
        const usernameSnapshot = await getDocs(qUsername);
        let users = usernameSnapshot.docs.map(doc => doc.data() as FirestoreUserData);

        // If not enough results, also search by name (prefix match)
        if (users.length < limitCount) {
            const qName = query(
                usersRef,
                where('name', '>=', queryText),
                where('name', '<=', queryText + '\uf8ff'),
                limit(limitCount)
            );
            const nameSnapshot = await getDocs(qName);
            const nameUsers = nameSnapshot.docs.map(doc => doc.data() as FirestoreUserData);

            // Merge and deduplicate
            const existingUids = new Set(users.map(u => u.uid));
            nameUsers.forEach(u => {
                if (!existingUids.has(u.uid)) {
                    users.push(u);
                }
            });
        }

        return users.slice(0, limitCount);
    } catch (error) {
        console.error('Error searching users:', error);
        return [];
    }
}

export async function searchPosts(queryText: string, limitCount: number = 10): Promise<Post[]> {
    try {
        if (!queryText.trim()) return [];

        // Note: Firestore doesn't support full-text search natively.
        // This is a basic implementation that only works for exact prefix matches on the text field.
        // For production, use Algolia or ElasticSearch.

        const postsRef = collection(db, 'posts');

        // We can't easily search nested fields with range operators if we also want to sort by something else
        // So we'll do a client-side filter on recent posts for now as a fallback
        // or just search for exact matches if we can.

        // Strategy: Get recent posts and filter client-side (not efficient but works for small apps)
        const q = query(
            postsRef,
            orderBy('createdAt', 'desc'),
            limit(50) // Fetch last 50 posts
        );

        const snapshot = await getDocs(q);
        const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));

        const lowerQuery = queryText.toLowerCase();
        return allPosts.filter(post =>
            post.content.text?.toLowerCase().includes(lowerQuery) ||
            post.content.roadmapTitle?.toLowerCase().includes(lowerQuery) ||
            post.content.projectTitle?.toLowerCase().includes(lowerQuery) ||
            post.content.achievementTitle?.toLowerCase().includes(lowerQuery)
        ).slice(0, limitCount);

    } catch (error) {
        console.error('Error searching posts:', error);
        return [];
    }
}

export async function searchRoadmaps(queryText: string, limitCount: number = 10): Promise<Post[]> {
    try {
        if (!queryText.trim()) return [];

        const postsRef = collection(db, 'posts');

        // Similar strategy: Get recent roadmap posts and filter
        const q = query(
            postsRef,
            where('type', '==', 'roadmap'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const snapshot = await getDocs(q);
        const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));

        const lowerQuery = queryText.toLowerCase();
        return allPosts.filter(post =>
            post.content.roadmapTitle?.toLowerCase().includes(lowerQuery) ||
            post.content.text?.toLowerCase().includes(lowerQuery)
        ).slice(0, limitCount);

    } catch (error) {
        console.error('Error searching roadmaps:', error);
        return [];
    }
}

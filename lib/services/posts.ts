import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, increment } from 'firebase/firestore';

export interface Post {
    id: string;
    userId: string;
    username: string;
    userPhoto?: string;
    userName: string;
    type: 'roadmap' | 'achievement' | 'project' | 'text';
    content: {
        text?: string;
        roadmapId?: string;
        roadmapTitle?: string;
        achievementId?: string;
        achievementTitle?: string;
        projectId?: string;
        projectTitle?: string;
        images?: string[];
    };
    likes: number;
    saves: number;
    comments: number;
});

return postId;
    } catch (error) {
    console.error('Error creating post:', error);
    throw error;
}
}

export async function deletePost(postId: string, userId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'posts', postId));

        // Update user's post count
        await updateDoc(doc(db, 'users', userId), {
            postsCount: increment(-1),
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

export async function getUserPosts(userId: string, limitCount: number = 50): Promise<Post[]> {
    try {
        const q = query(
            collection(db, 'posts'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Post);
    } catch (error) {
        console.error('Error getting user posts:', error);
        return [];
    }
}

export async function getFeedPosts(followingIds: string[], limitCount: number = 50): Promise<Post[]> {
    try {
        if (followingIds.length === 0) return [];

        const q = query(
            collection(db, 'posts'),
            where('userId', 'in', followingIds.slice(0, 10)), // Firestore limit
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as Post);
    } catch (error) {
        console.error('Error getting feed posts:', error);
        return [];
    }
}

export async function likePost(userId: string, postId: string): Promise<void> {
    try {
        const likeId = `${userId}_${postId}`;
        const likeDoc = await getDoc(doc(db, 'likes', likeId));

        if (likeDoc.exists()) {
            // Unlike
            await deleteDoc(doc(db, 'likes', likeId));
            await updateDoc(doc(db, 'posts', postId), {
                likes: increment(-1),
            });
        } else {
            // Like
            await setDoc(doc(db, 'likes', likeId), {
                userId,
                postId,
                createdAt: new Date().toISOString(),
            });
            await updateDoc(doc(db, 'posts', postId), {
                likes: increment(1),
            });
        }
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
}

export async function savePost(userId: string, postId: string): Promise<void> {
    try {
        const saveId = `${userId}_${postId}`;
        const saveDoc = await getDoc(doc(db, 'saves', saveId));

        if (saveDoc.exists()) {
            // Unsave
            await deleteDoc(doc(db, 'saves', saveId));
            await updateDoc(doc(db, 'posts', postId), {
                saves: increment(-1),
            });
        } else {
            // Save
            await setDoc(doc(db, 'saves', saveId), {
                userId,
                postId,
                createdAt: new Date().toISOString(),
            });
            await updateDoc(doc(db, 'posts', postId), {
                saves: increment(1),
            });
        }
    } catch (error) {
        console.error('Error saving post:', error);
        throw error;
    }
}

export async function isPostLiked(userId: string, postId: string): Promise<boolean> {
    try {
        const likeId = `${userId}_${postId}`;
        const likeDoc = await getDoc(doc(db, 'likes', likeId));
        return likeDoc.exists();
    } catch (error) {
        console.error('Error checking if post is liked:', error);
        return false;
    }
}

export async function isPostSaved(userId: string, postId: string): Promise<boolean> {
    try {
        const saveId = `${userId}_${postId}`;
        const saveDoc = await getDoc(doc(db, 'saves', saveId));
        return saveDoc.exists();
    } catch (error) {
        console.error('Error checking if post is saved:', error);
        return false;
    }
}

export async function getSavedPosts(userId: string): Promise<Post[]> {
    try {
        const q = query(
            collection(db, 'saves'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const postIds = snapshot.docs.map(doc => doc.data().postId);

        // Fetch posts
        const posts: Post[] = [];
        for (const postId of postIds) {
            const postDoc = await getDoc(doc(db, 'posts', postId));
            if (postDoc.exists()) {
                posts.push(postDoc.data() as Post);
            }
        }

        return posts;
    } catch (error) {
        console.error('Error getting saved posts:', error);
        return [];
    }
}

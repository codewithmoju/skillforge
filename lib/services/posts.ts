import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, increment, addDoc } from 'firebase/firestore';

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
    createdAt: string;
}

export async function createPost(userId: string, username: string, userName: string, userPhoto: string | undefined, type: Post['type'], postContent: Post['content']): Promise<string> {
    try {
        // Construct the content object, only adding fields if they exist and have a value
        const contentData: Post['content'] = {};

        if (postContent.text) {
            contentData.text = postContent.text;
        }
        if (postContent.roadmapId) {
            contentData.roadmapId = postContent.roadmapId;
        }
        if (postContent.roadmapTitle) {
            contentData.roadmapTitle = postContent.roadmapTitle;
        }
        if (postContent.achievementId) {
            contentData.achievementId = postContent.achievementId;
        }
        if (postContent.achievementTitle) {
            contentData.achievementTitle = postContent.achievementTitle;
        }
        if (postContent.projectId) {
            contentData.projectId = postContent.projectId;
        }
        if (postContent.projectTitle) {
            contentData.projectTitle = postContent.projectTitle;
        }
        if (postContent.images && postContent.images.length > 0) {
            contentData.images = postContent.images;
        }

        const postData = {
            userId,
            username,
            userName,
            userPhoto,
            type,
            content: contentData, // Use the carefully constructed contentData
            likes: 0,
            saves: 0,
            comments: 0,
            createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, 'posts'), postData);
        const postId = docRef.id;

        // Update user's post count
        await updateDoc(doc(db, 'users', userId), {
            postsCount: increment(1),
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
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    } catch (error) {
        console.error('Error getting user posts:', error);
        return [];
    }
}

export async function getFeedPosts(followingIds: string[], limitCount: number = 50): Promise<Post[]> {
    try {
        let followedPosts: Post[] = [];

        // 1. Fetch posts from followed users (if any)
        if (followingIds.length > 0) {
            // Firestore 'in' query is limited to 10. For now, we take the top 10 followed users.
            const q = query(
                collection(db, 'posts'),
                where('userId', 'in', followingIds.slice(0, 10)),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            followedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        }

        // 2. Fetch trending/recent posts to fill the feed
        const trendingPosts = await getTrendingPosts(limitCount);

        // 3. Combine: Followed posts first, then trending posts
        // Filter out duplicates
        const followedPostIds = new Set(followedPosts.map(p => p.id));
        const uniqueTrendingPosts = trendingPosts.filter(p => !followedPostIds.has(p.id));

        return [...followedPosts, ...uniqueTrendingPosts];
    } catch (error) {
        console.error('Error getting feed posts:', error);
        return [];
    }
}

export async function getTrendingPosts(limitCount: number = 20): Promise<Post[]> {
    try {
        // Try to get posts with most likes first
        const q = query(
            collection(db, 'posts'),
            orderBy('likes', 'desc'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);

        // If we don't have enough trending posts (e.g. new app), fallback to recent posts
        if (snapshot.empty || snapshot.docs.length < 5) {
            const recentQ = query(
                collection(db, 'posts'),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );
            const recentSnapshot = await getDocs(recentQ);
            return recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        }

        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    } catch (error) {
        console.error('Error getting trending posts:', error);
        // Fallback to recent posts on error (e.g. missing index)
        try {
            const recentQ = query(
                collection(db, 'posts'),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );
            const recentSnapshot = await getDocs(recentQ);
            return recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        } catch (fallbackError) {
            console.error('Error getting fallback posts:', fallbackError);
            return [];
        }
    }
}

export async function likePost(userId: string, postId: string, postOwnerId: string, userDetails: { name: string, photo?: string }): Promise<void> {
    try {
        // Verify post exists first
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error("Post does not exist");
        }

        const likeId = `${userId}_${postId}`;
        const likeDoc = await getDoc(doc(db, 'likes', likeId));

        if (likeDoc.exists()) {
            // Unlike
            await deleteDoc(doc(db, 'likes', likeId));
            await updateDoc(postRef, {
                likes: increment(-1),
            });
        } else {
            // Like
            await setDoc(doc(db, 'likes', likeId), {
                userId,
                postId,
                createdAt: new Date().toISOString(),
            });
            await updateDoc(postRef, {
                likes: increment(1),
            });

            // Send notification
            if (userId !== postOwnerId) { // Don't notify if liking own post
                const { createNotification } = await import('./notifications');
                await createNotification(
                    postOwnerId,
                    'like',
                    userId,
                    userDetails.name,
                    userDetails.photo,
                    postId
                );
            }
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
                posts.push({ id: postDoc.id, ...postDoc.data() } as Post);
            }
        }

        return posts;
    } catch (error) {
        console.error('Error getting saved posts:', error);
        return [];
    }
}
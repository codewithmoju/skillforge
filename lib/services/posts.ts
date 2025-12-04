import { db } from '../firebase';
import { collection, doc, addDoc, deleteDoc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, increment, startAfter, QueryDocumentSnapshot, DocumentData, setDoc, documentId } from 'firebase/firestore';

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

export async function createPost(
    userId: string,
    username: string,
    authorName: string,
    authorPhoto: string | undefined,
    data: {
        type: 'roadmap' | 'achievement' | 'project' | 'text';
        content: {
            text?: string;
            images?: string[];
            roadmapId?: string;
            roadmapTitle?: string;
            achievementId?: string;
            achievementTitle?: string;
            projectId?: string;
            projectTitle?: string;
        };
    }
): Promise<string> {
    try {
        // Prepare post data
        const postData: any = {
            userId,
            username,
            userName: authorName,
            userPhoto: authorPhoto,
            type: data.type,
            content: {
                text: data.content.text,
            },
            likes: 0,
            comments: 0,
            saves: 0,
            createdAt: new Date().toISOString(),
        };

        // Only add images if they exist and are not empty
        if (data.content.images && data.content.images.length > 0) {
            postData.content.images = data.content.images;
        }

        // Add other optional fields if they exist
        if (data.content.roadmapId) postData.content.roadmapId = data.content.roadmapId;
        if (data.content.roadmapTitle) postData.content.roadmapTitle = data.content.roadmapTitle;
        if (data.content.achievementId) postData.content.achievementId = data.content.achievementId;
        if (data.content.achievementTitle) postData.content.achievementTitle = data.content.achievementTitle;
        if (data.content.projectId) postData.content.projectId = data.content.projectId;
        if (data.content.projectTitle) postData.content.projectTitle = data.content.projectTitle;

        const docRef = await addDoc(collection(db, "posts"), postData);

        // Update user's post count
        await updateDoc(doc(db, 'users', userId), {
            postsCount: increment(1),
        });

        return docRef.id;
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

export async function updatePost(postId: string, userId: string, content: string): Promise<void> {
    try {
        // Verify ownership (optional but recommended)
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
            throw new Error("Post not found");
        }

        if (postSnap.data().userId !== userId) {
            throw new Error("Unauthorized");
        }

        await updateDoc(postRef, {
            "content.text": content,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating post:', error);
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
        if (followingIds.length === 0) return [];

        const q = query(
            collection(db, 'posts'),
            where('userId', 'in', followingIds.slice(0, 10)), // Firestore limit
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
    } catch (error) {
        console.error('Error getting feed posts:', error);
        return [];
    }
}

export async function getTrendingPosts(limitCount: number = 50): Promise<Post[]> {
    try {
        const q = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));

        // Sort by engagement (likes + comments) in memory
        return posts.sort((a, b) => {
            const engagementA = (a.likes || 0) + (a.comments || 0);
            const engagementB = (b.likes || 0) + (b.comments || 0);
            return engagementB - engagementA;
        });
    } catch (error) {
        console.error('Error getting trending posts:', error);
        return [];
    }
}

export async function likePost(userId: string, postId: string): Promise<void> {
    try {
        const likeId = `${userId}_${postId}`;
        const likeRef = doc(db, 'likes', likeId);
        const likeDocSnap = await getDoc(likeRef);

        if (likeDocSnap.exists()) {
            // Unlike
            await deleteDoc(likeRef);
            await updateDoc(doc(db, 'posts', postId), {
                likes: increment(-1),
            });
        } else {
            // Like - use setDoc with explicit document ID to prevent duplicates
            await setDoc(likeRef, {
                userId,
                postId,
                createdAt: new Date().toISOString(),
            });
            await updateDoc(doc(db, 'posts', postId), {
                likes: increment(1),
            });

            // Create notification
            const postDoc = await getDoc(doc(db, 'posts', postId));
            if (postDoc.exists()) {
                const postData = postDoc.data();
                const userDoc = await getDoc(doc(db, 'users', userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const { createNotification } = await import('./notifications');
                    await createNotification(
                        postData.userId,
                        'like',
                        userId,
                        userData.displayName || 'User',
                        userData.photoURL,
                        postId
                    );
                }
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
        const saveRef = doc(db, 'saves', saveId);
        const saveDocSnap = await getDoc(saveRef);

        if (saveDocSnap.exists()) {
            // Unsave
            await deleteDoc(saveRef);
            await updateDoc(doc(db, 'posts', postId), {
                saves: increment(-1),
            });
        } else {
            // Save - use setDoc with explicit document ID to prevent duplicates
            await setDoc(saveRef, {
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
export interface PaginatedResult<T> {
    items: T[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
}

export async function getFeedPostsPaginated(
    followingIds: string[],
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResult<Post>> {
    try {
        if (followingIds.length === 0) return { items: [], lastDoc: null, hasMore: false };

        let q = query(
            collection(db, 'posts'),
            where('userId', 'in', followingIds.slice(0, 10)),
            orderBy('createdAt', 'desc'),
            limit(pageSize + 1)
        );

        if (lastDoc) {
            q = query(
                collection(db, 'posts'),
                where('userId', 'in', followingIds.slice(0, 10)),
                orderBy('createdAt', 'desc'),
                startAfter(lastDoc),
                limit(pageSize + 1)
            );
        }

        const snapshot = await getDocs(q);
        const docs = snapshot.docs;
        const hasMore = docs.length > pageSize;
        const items = docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as Post));
        const newLastDoc = docs.length > 0 ? docs[Math.min(docs.length - 1, pageSize - 1)] : null;

        return { items, lastDoc: newLastDoc, hasMore };
    } catch (error) {
        console.error('Error getting paginated feed posts:', error);
        return { items: [], lastDoc: null, hasMore: false };
    }
}
export async function getAllPostsPaginated(
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedResult<Post>> {
    try {
        let q = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc'),
            limit(pageSize + 1)
        );

        if (lastDoc) {
            q = query(
                collection(db, 'posts'),
                orderBy('createdAt', 'desc'),
                startAfter(lastDoc),
                limit(pageSize + 1)
            );
        }

        const snapshot = await getDocs(q);
        const docs = snapshot.docs;
        const hasMore = docs.length > pageSize;
        const items = docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as Post));
        const newLastDoc = docs.length > 0 ? docs[Math.min(docs.length - 1, pageSize - 1)] : null;

        return { items, lastDoc: newLastDoc, hasMore };
    } catch (error) {
        console.error('Error getting paginated all posts:', error);
        return { items: [], lastDoc: null, hasMore: false };
    }
}
export async function checkPostInteractions(
    userId: string,
    postIds: string[]
): Promise<{ liked: Set<string>; saved: Set<string> }> {
    try {
        if (postIds.length === 0) return { liked: new Set(), saved: new Set() };

        // Firestore 'in' query limit is 10 (or 30 depending on context, but safe bet is 10 for documentId in)
        // Since our page size is 10, this works perfectly.
        // If postIds > 10, we would need to batch.

        const liked = new Set<string>();
        const saved = new Set<string>();

        // Process in chunks of 10 just in case
        for (let i = 0; i < postIds.length; i += 10) {
            const chunk = postIds.slice(i, i + 10);
            const likeIds = chunk.map(id => `${userId}_${id}`);
            const saveIds = chunk.map(id => `${userId}_${id}`);

            const likesQuery = query(
                collection(db, 'likes'),
                where(documentId(), 'in', likeIds)
            );

            const savesQuery = query(
                collection(db, 'saves'),
                where(documentId(), 'in', saveIds)
            );

            const [likesSnap, savesSnap] = await Promise.all([
                getDocs(likesQuery),
                getDocs(savesQuery)
            ]);

            likesSnap.docs.forEach(doc => {
                // ID is userId_postId, so we extract postId
                const postId = doc.id.split('_')[1];
                liked.add(postId);
            });

            savesSnap.docs.forEach(doc => {
                const postId = doc.id.split('_')[1];
                saved.add(postId);
            });
        }

        return { liked, saved };
    } catch (error) {
        console.error('Error checking post interactions:', error);
        return { liked: new Set(), saved: new Set() };
    }
}

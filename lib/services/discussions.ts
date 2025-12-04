import { db } from '../firebase';
import { collection, doc, addDoc, getDocs, getDoc, query, where, orderBy, limit, updateDoc, increment, deleteDoc, Timestamp, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

export interface GroupDiscussion {
    id: string;
    groupId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    likes: number;
    likedBy: string[];
    comments: number;
    createdAt: string;
    updatedAt: string;
}

export interface DiscussionComment {
    id: string;
    discussionId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt: string;
}

export async function createDiscussion(
    groupId: string,
    authorId: string,
    authorName: string,
    content: string,
    authorAvatar?: string
): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, 'groupDiscussions'), {
            groupId,
            authorId,
            authorName,
            authorAvatar: authorAvatar || '',
            content,
            likes: 0,
            likedBy: [],
            comments: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating discussion:', error);
        throw error;
    }
}

export async function getGroupDiscussions(groupId: string, limitCount: number = 20): Promise<GroupDiscussion[]> {
    try {
        const q = query(
            collection(db, 'groupDiscussions'),
            where('groupId', '==', groupId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GroupDiscussion));
    } catch (error) {
        console.error('Error getting discussions:', error);
        return [];
    }
}

export async function likeDiscussion(discussionId: string, userId: string): Promise<void> {
    try {
        const docRef = doc(db, 'groupDiscussions', discussionId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return;

        const data = docSnap.data();
        const likedBy = data.likedBy || [];

        if (likedBy.includes(userId)) {
            // Unlike
            await updateDoc(docRef, {
                likes: increment(-1),
                likedBy: likedBy.filter((id: string) => id !== userId),
            });
        } else {
            // Like
            await updateDoc(docRef, {
                likes: increment(1),
                likedBy: [...likedBy, userId],
            });
        }
    } catch (error) {
        console.error('Error liking discussion:', error);
        throw error;
    }
}

export async function deleteDiscussion(discussionId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'groupDiscussions', discussionId));
    } catch (error) {
        console.error('Error deleting discussion:', error);
        throw error;
    }
}

// Comments
export async function addComment(
    discussionId: string,
    authorId: string,
    authorName: string,
    content: string,
    authorAvatar?: string
): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, 'discussionComments'), {
            discussionId,
            authorId,
            authorName,
            authorAvatar: authorAvatar || '',
            content,
            createdAt: new Date().toISOString(),
        });

        // Update comment count
        await updateDoc(doc(db, 'groupDiscussions', discussionId), {
            comments: increment(1),
        });

        return docRef.id;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}

export async function getDiscussionComments(discussionId: string): Promise<DiscussionComment[]> {
    try {
        const q = query(
            collection(db, 'discussionComments'),
            where('discussionId', '==', discussionId),
            orderBy('createdAt', 'asc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiscussionComment));
    } catch (error) {
        console.error('Error getting comments:', error);
        return [];
    }
}

export interface PaginatedDiscussions {
    items: GroupDiscussion[];
    lastDoc: QueryDocumentSnapshot<DocumentData> | null;
    hasMore: boolean;
}

export async function getGroupDiscussionsPaginated(
    groupId: string, 
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedDiscussions> {
    try {
        let q = query(
            collection(db, 'groupDiscussions'),
            where('groupId', '==', groupId),
            orderBy('createdAt', 'desc'),
            limit(pageSize + 1)
        );

        if (lastDoc) {
            q = query(
                collection(db, 'groupDiscussions'),
                where('groupId', '==', groupId),
                orderBy('createdAt', 'desc'),
                startAfter(lastDoc),
                limit(pageSize + 1)
            );
        }

        const snapshot = await getDocs(q);
        const docs = snapshot.docs;
        const hasMore = docs.length > pageSize;
        const items = docs.slice(0, pageSize).map(doc => ({ id: doc.id, ...doc.data() } as GroupDiscussion));
        const newLastDoc = docs.length > 0 ? docs[Math.min(docs.length - 1, pageSize - 1)] : null;

        return { items, lastDoc: newLastDoc, hasMore };
    } catch (error) {
        console.error('Error getting paginated discussions:', error);
        return { items: [], lastDoc: null, hasMore: false };
    }
}

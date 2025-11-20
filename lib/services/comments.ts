import { db } from '../firebase';
import { collection, doc, addDoc, deleteDoc, getDocs, query, where, orderBy, updateDoc, increment, getDoc } from 'firebase/firestore';

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    username: string;
    userPhoto?: string;
    userName: string;
    text: string;
    createdAt: string;
}

export async function addComment(postId: string, userId: string, username: string, userName: string, userPhoto: string | undefined, text: string): Promise<Comment> {
    try {
        const commentData = {
            postId,
            userId,
            username,
            userName,
            userPhoto,
            text,
            createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, 'comments'), commentData);

        // Update post comment count
        await updateDoc(doc(db, 'posts', postId), {
            comments: increment(1),
        });

        return { id: docRef.id, ...commentData };
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}

export async function getComments(postId: string): Promise<Comment[]> {
    try {
        const q = query(
            collection(db, 'comments'),
            where('postId', '==', postId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
    } catch (error) {
        console.error('Error getting comments:', error);
        return [];
    }
}

export async function deleteComment(commentId: string, postId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'comments', commentId));

        // Update post comment count
        await updateDoc(doc(db, 'posts', postId), {
            comments: increment(-1),
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
}

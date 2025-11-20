import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where, updateDoc, increment } from 'firebase/firestore';

export interface FollowRelationship {
    followerId: string;
    followingId: string;
    status: 'pending' | 'accepted';
    createdAt: string;
}

export async function followUser(followerId: string, followingId: string, isPrivate: boolean): Promise<void> {
    try {
        const followId = `${followerId}_${followingId}`;
        const status = isPrivate ? 'pending' : 'accepted';

        await setDoc(doc(db, 'followers', followId), {
            followerId,
            followingId,
            status,
            createdAt: new Date().toISOString(),
        });

        // Update counts only if accepted
        if (status === 'accepted') {
            await updateDoc(doc(db, 'users', followerId), {
                following: increment(1),
            });
            await updateDoc(doc(db, 'users', followingId), {
                followers: increment(1),
            });
        }
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
    try {
        const followId = `${followerId}_${followingId}`;
        const followDoc = await getDoc(doc(db, 'followers', followId));

        if (followDoc.exists()) {
            const data = followDoc.data();
            await deleteDoc(doc(db, 'followers', followId));

            // Update counts only if was accepted
            if (data.status === 'accepted') {
                await updateDoc(doc(db, 'users', followerId), {
                    following: increment(-1),
                });
                await updateDoc(doc(db, 'users', followingId), {
                    followers: increment(-1),
                });
            }
        }
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
}

export async function acceptFollowRequest(followerId: string, followingId: string): Promise<void> {
    try {
        const followId = `${followerId}_${followingId}`;
        await updateDoc(doc(db, 'followers', followId), {
            status: 'accepted',
        });

        // Update counts
        await updateDoc(doc(db, 'users', followerId), {
            following: increment(1),
        });
        await updateDoc(doc(db, 'users', followingId), {
            followers: increment(1),
        });
    } catch (error) {
        console.error('Error accepting follow request:', error);
        throw error;
    }
}

export async function getFollowStatus(followerId: string, followingId: string): Promise<'none' | 'pending' | 'following'> {
    try {
        const followId = `${followerId}_${followingId}`;
        const followDoc = await getDoc(doc(db, 'followers', followId));

        if (!followDoc.exists()) return 'none';

        const data = followDoc.data();
        return data.status === 'accepted' ? 'following' : 'pending';
    } catch (error) {
        console.error('Error getting follow status:', error);
        return 'none';
    }
}

export async function getFollowers(userId: string): Promise<string[]> {
    try {
        const q = query(
            collection(db, 'followers'),
            where('followingId', '==', userId),
            where('status', '==', 'accepted')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data().followerId);
    } catch (error) {
        console.error('Error getting followers:', error);
        return [];
    }
}

export async function getFollowing(userId: string): Promise<string[]> {
    try {
        const q = query(
            collection(db, 'followers'),
            where('followerId', '==', userId),
            where('status', '==', 'accepted')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data().followingId);
    } catch (error) {
        console.error('Error getting following:', error);
        return [];
    }
}

export async function getPendingRequests(userId: string): Promise<string[]> {
    try {
        const q = query(
            collection(db, 'followers'),
            where('followingId', '==', userId),
            where('status', '==', 'pending')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data().followerId);
    } catch (error) {
        console.error('Error getting pending requests:', error);
        return [];
    }
}

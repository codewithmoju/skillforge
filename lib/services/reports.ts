import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ReportData {
    targetId: string;
    targetType: 'post' | 'comment' | 'user';
    reason: string;
    description?: string;
    reportedBy: string;
}

export async function submitReport(data: ReportData): Promise<void> {
    try {
        await addDoc(collection(db, 'reports'), {
            ...data,
            status: 'pending',
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error submitting report:', error);
        throw error;
    }
}

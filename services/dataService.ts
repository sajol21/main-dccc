import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { firestoreDB } from '../firebase';
import { Member, Event, ContactMessage } from '../types';

/**
 * Fetches an entire collection from Firestore and maps document IDs to the data objects.
 * @param path The path to the collection.
 * @returns A promise that resolves to an array of data objects, each including its Firestore document ID.
 */
export const fetchCollectionWithIds = async <T>(path: string): Promise<T[]> => {
    try {
        const collectionRef = collection(firestoreDB, path);
        const querySnapshot = await getDocs(collectionRef);
        if (querySnapshot.empty) {
            return [];
        }
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
        console.error(`Firestore fetch error from ${path}:`, error);
        throw error;
    }
};

export const fetchAndGroupCommitteesByYear = async (): Promise<{ [year: string]: Member[] }> => {
    try {
        const querySnapshot = await getDocs(collection(firestoreDB, 'committees'));
        if (querySnapshot.empty) {
            console.log('No data available in collection: committees');
            return {};
        }
        const committees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
        
        return committees.reduce((acc, member) => {
            if (!member.year) return acc;
            const year = String(member.year);
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(member);
            return acc;
        }, {} as { [year: string]: Member[] });

    } catch (error) {
        console.error("Firestore fetch error:", error);
        throw error;
    }
};

// --- Event Management ---
export const addEvent = (eventData: Omit<Event, 'id'>) => addDoc(collection(firestoreDB, 'events'), eventData);
export const updateEvent = (eventId: string, eventData: Partial<Event>) => updateDoc(doc(firestoreDB, 'events', eventId), eventData);
export const deleteEvent = (eventId: string) => deleteDoc(doc(firestoreDB, 'events', eventId));

// --- Committee Management ---
export const addCommitteeMember = (memberData: Omit<Member, 'id'>) => addDoc(collection(firestoreDB, 'committees'), memberData);
export const updateCommitteeMember = (memberId: string, memberData: Partial<Member>) => updateDoc(doc(firestoreDB, 'committees', memberId), memberData);
export const deleteCommitteeMember = (memberId: string) => deleteDoc(doc(firestoreDB, 'committees', memberId));

// --- Contact Messages ---
export const postContactMessage = async (name: string, email: string, message: string): Promise<void> => {
    try {
        const messagesCollectionRef = collection(firestoreDB, 'messages');
        await addDoc(messagesCollectionRef, {
            name,
            email,
            message,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Firestore post error:", error);
        throw error;
    }
};

export const fetchMessages = async (): Promise<ContactMessage[]> => {
    const messagesRef = collection(firestoreDB, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
};
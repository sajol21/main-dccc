import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { firestoreDB } from '../firebase';
import { Member } from '../types';

export const fetchDataAsArray = async <T>(path: string): Promise<T[]> => {
  try {
    const collectionRef = collection(firestoreDB, path);
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      console.log(`No data available in collection: ${path}`);
      return [];
    }
    return querySnapshot.docs.map(doc => doc.data() as T);
  } catch (error) {
    console.error("Firestore fetch error:", error);
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
        const committees = querySnapshot.docs.map(doc => doc.data() as Member);
        
        // Group by year
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
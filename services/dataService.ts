import { get, ref, push, set, child } from 'firebase/database';
import { database } from '../firebase';

const dbRef = ref(database);

// Helper to convert Firebase object-as-array back to an array
const firebaseObjectToArray = <T>(data: Record<string, T> | undefined | null): T[] => {
    if (!data) return [];
    return Object.values(data);
};

export const fetchDataAsArray = async <T>(path: string): Promise<T[]> => {
  try {
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      return firebaseObjectToArray(snapshot.val());
    } else {
      console.log(`No data available at path: ${path}`);
      return [];
    }
  } catch (error) {
    console.error("Firebase fetch error:", error);
    throw error;
  }
};

export const fetchDataAsObject = async <T>(path: string): Promise<T | null> => {
  try {
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      return snapshot.val() as T;
    } else {
      console.log(`No data available at path: ${path}`);
      return null;
    }
  } catch (error) {
    console.error("Firebase fetch error:", error);
    throw error;
  }
};

export const postContactMessage = async (name: string, email: string, message: string): Promise<void> => {
    try {
        const messagesRef = ref(database, 'messages');
        const newMessageRef = push(messagesRef);
        await set(newMessageRef, {
            name,
            email,
            message,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Firebase post error:", error);
        throw error;
    }
};

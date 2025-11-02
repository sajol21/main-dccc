import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestoreDB } from '../firebase';

// --- Core Auth Functions ---

export const handleRegister = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const handleLogin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const handleLogout = () => {
  return signOut(auth);
};

export const onAuthChanged = (callback: (user: User | null) => void) => {
    return onFirebaseAuthStateChanged(auth, callback);
};

export { auth };

// --- Role Management ---

/**
 * Checks if a user is an administrator.
 * This function checks for the user's UID in a document within the `/admins` collection in Firestore.
 * @param {string} uid The user's unique ID.
 * @returns {Promise<boolean>} True if the user is an admin, false otherwise.
 */
export const checkAdminStatus = async (uid: string): Promise<boolean> => {
    if (!uid) return false;
    try {
        const adminDocRef = doc(firestoreDB, 'admins', uid);
        const docSnap = await getDoc(adminDocRef);
        
        if (docSnap.exists()) {
            // You can add more specific checks here, e.g., docSnap.data().isAdmin === true
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed to check admin status:", error);
        return false;
    }
};
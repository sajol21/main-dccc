import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  User,
} from 'firebase/auth';
import { get, ref, child } from 'firebase/database';
import { auth, database } from '../firebase';

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
 * This function checks for the user's UID in a `/admins` node in your Realtime Database.
 * @param {string} uid The user's unique ID.
 * @returns {Promise<boolean>} True if the user is an admin, false otherwise.
 */
export const checkAdminStatus = async (uid: string): Promise<boolean> => {
    if (!uid) return false;
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `admins/${uid}`));
        return snapshot.exists() && snapshot.val() === true;
    } catch (error) {
        console.error("Failed to check admin status:", error);
        return false;
    }
};

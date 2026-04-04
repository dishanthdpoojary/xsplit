import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';

// ─────────────────────────────────────────────────────────────────────────────
// SIGN UP
// Creates a Firebase Auth account, then saves the user profile in Firestore.
// ─────────────────────────────────────────────────────────────────────────────
export const signUp = async (name, email, password) => {
  try {
    if (!name || !email || !password) {
      return { success: false, error: 'Name, email and password are required.' };
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = credential.user;

    const userData = {
      userId: uid,
      name: name.trim(),
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', uid), userData);

    return { success: true, data: userData };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const credential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;

    // Fetch extended profile from Firestore
    const profile = await getCurrentUser(firebaseUser.uid);

    return {
      success: true,
      data: profile ?? {
        userId: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.email.split('@')[0],
      },
    };
  } catch (err) {
    let message = err.message;
    if (
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/invalid-credential'
    ) {
      message = 'Invalid email or password.';
    }
    return { success: false, error: message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────────────────────
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET CURRENT USER (by UID from Firestore)
// ─────────────────────────────────────────────────────────────────────────────
export const getCurrentUser = async (uid) => {
  if (!uid) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
};

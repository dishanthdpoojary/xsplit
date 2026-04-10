import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

export const signUp = async (name, email, password) => {
  try {
    if (!name || !email || !password) {
      throw new Error('Name, email and password are required.');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userData = {
      userId: user.uid,
      name: name.trim(),
      email: email.toLowerCase(),
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);

    return userData;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Fetch extended profile from Firestore
    const profile = await getCurrentUser(userCredential.user.uid);
    
    return profile ?? {
      userId: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.email.split('@')[0],
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (uid) => {
  if (!uid) return null;
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

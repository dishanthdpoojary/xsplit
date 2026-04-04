import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase isn't correctly configured yet, stop loading and return
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch custom user doc from Firestore
        const userDoc = await getCurrentUser(user.uid);
        if (userDoc) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            name: userDoc.name,
            ...userDoc
          });
        } else {
          // Fallback if doc doesn't exist yet but user is logged in
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            name: user.email.split('@')[0]
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

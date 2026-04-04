import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthScreen from '../screens/AuthScreen';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthScreen />;
  }

  return children;
};

export default ProtectedRoute;

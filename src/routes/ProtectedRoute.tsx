import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';


type Props = { children: React.ReactNode };

const ProtectedRoute = ({ children }: Props) => {
  const { isLoggedIn } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      setIsAuthenticated(loggedIn);
    };

    checkAuth();
  }, [isLoggedIn]);

  if (isAuthenticated === null) {
    return <div>Verificando autenticação...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;

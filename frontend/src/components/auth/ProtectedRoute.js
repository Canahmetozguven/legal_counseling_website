import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authed = await isAuthenticated();
        setIsAuthed(authed);
      } catch (error) {
        console.error('[AUTH] Error in ProtectedRoute:', error);
        setIsAuthed(false);
      } finally {
        setChecking(false);
      }
    };

    if (!loading) {
      checkAuth();
    }
  }, [isAuthenticated, loading]);

  if (loading || checking) {
    return <div>Loading...</div>;
  }

  return isAuthed ? children : <Navigate to="/login" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;

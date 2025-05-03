import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  // If user is not authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If user is authenticated, render the protected component
  return children;
};

export default PrivateRoute;
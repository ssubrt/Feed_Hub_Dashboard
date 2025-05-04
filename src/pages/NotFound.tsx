
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const NotFound: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-7xl font-bold text-creator-purple mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you were looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-creator-purple hover:bg-creator-darkPurple">
          <Link to={isAuthenticated ? '/dashboard' : '/'}>
            Return to {isAuthenticated ? 'Dashboard' : 'Home'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

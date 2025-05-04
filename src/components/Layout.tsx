
import React from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CreditCard, Home, LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = false, adminOnly = false }) => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-creator-purple"></div>
      </div>
    );
  }
  
  // Check authentication requirements
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Check admin requirements
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If on auth pages and already logged in, redirect to dashboard
  if (['/login', '/register'].includes(location.pathname) && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Public layout (for login/register pages)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-creator-purple">Creator Dashboard</Link>
            <nav className="flex space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-creator-purple transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-creator-purple transition-colors">
                Register
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        
        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-6 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Creator Dashboard. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }
  
  // Authenticated layout with sidebar
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
        <div className="p-5">
          <Link to="/dashboard" className="text-xl font-bold text-creator-purple">Creator Dashboard</Link>
        </div>
        
        <nav className="mt-8">
          <Link 
            to="/dashboard" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-creator-lightPurple hover:bg-opacity-10 hover:text-creator-purple transition-colors ${location.pathname === '/dashboard' ? 'bg-creator-lightPurple bg-opacity-10 text-creator-purple border-r-4 border-creator-purple' : ''}`}
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/feed" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-creator-lightPurple hover:bg-opacity-10 hover:text-creator-purple transition-colors ${location.pathname === '/feed' ? 'bg-creator-lightPurple bg-opacity-10 text-creator-purple border-r-4 border-creator-purple' : ''}`}
          >
            <Bell className="h-5 w-5 mr-3" />
            <span>Content Feed</span>
          </Link>
          
          <Link 
            to="/credits" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-creator-lightPurple hover:bg-opacity-10 hover:text-creator-purple transition-colors ${location.pathname === '/credits' ? 'bg-creator-lightPurple bg-opacity-10 text-creator-purple border-r-4 border-creator-purple' : ''}`}
          >
            <CreditCard className="h-5 w-5 mr-3" />
            <span>Credits</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-creator-lightPurple hover:bg-opacity-10 hover:text-creator-purple transition-colors ${location.pathname === '/profile' ? 'bg-creator-lightPurple bg-opacity-10 text-creator-purple border-r-4 border-creator-purple' : ''}`}
          >
            <User className="h-5 w-5 mr-3" />
            <span>Profile</span>
          </Link>
          
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-creator-lightPurple hover:bg-opacity-10 hover:text-creator-purple transition-colors ${location.pathname.startsWith('/admin') ? 'bg-creator-lightPurple bg-opacity-10 text-creator-purple border-r-4 border-creator-purple' : ''}`}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Admin</span>
            </Link>
          )}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-creator-purple text-white flex items-center justify-center">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{user?.username}</div>
              <div className="text-sm text-gray-500">{user?.credits} credits</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center" 
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="flex items-center justify-between p-4">
          <Link to="/dashboard" className="text-xl font-bold text-creator-purple">Creator Dashboard</Link>
          <div className="flex items-center space-x-3">
            <div className="text-sm">{user?.credits} credits</div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      
      {/* Mobile navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center px-3 py-2 ${location.pathname === '/dashboard' ? 'text-creator-purple' : 'text-gray-600'}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link 
          to="/feed" 
          className={`flex flex-col items-center px-3 py-2 ${location.pathname === '/feed' ? 'text-creator-purple' : 'text-gray-600'}`}
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs mt-1">Feed</span>
        </Link>
        <Link 
          to="/credits" 
          className={`flex flex-col items-center px-3 py-2 ${location.pathname === '/credits' ? 'text-creator-purple' : 'text-gray-600'}`}
        >
          <CreditCard className="h-6 w-6" />
          <span className="text-xs mt-1">Credits</span>
        </Link>
        <Link 
          to="/profile" 
          className={`flex flex-col items-center px-3 py-2 ${location.pathname === '/profile' ? 'text-creator-purple' : 'text-gray-600'}`}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;

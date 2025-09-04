import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  User, 
  Lightbulb, 
  Users, 
  Wrench, 
  MessageSquare, 
  LogOut,
  Search,
  Bell
} from 'lucide-react';

const Layout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Generate Ideas', href: '/generate-idea', icon: Lightbulb },
    { name: 'Collaborate', href: '/collaborate', icon: Users },
    { name: 'AI Tools', href: '/tools', icon: Wrench },
    { name: 'Forum', href: '/forum', icon: MessageSquare },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 
                className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                KalaSetu
              </h1>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    className="flex items-center space-x-2"
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {currentUser?.email}
                </span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden mt-4 flex space-x-2 overflow-x-auto pb-2">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={isActive(item.href) ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-1 whitespace-nowrap"
                onClick={() => navigate(item.href)}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.name}</span>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
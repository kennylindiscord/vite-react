import { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Menu,
  X,
  Home as HomeIcon,
  Calendar,
  MessageSquare,
  Award,
  User,
  LogOut,
} from 'lucide-react';

type LayoutProps = {
  children: ReactNode;
  currentPageName: string; // "Home" | "Events" | "Community" | "Tokens" | "Profile"
};

const DEMO_USER = {
  id: 'demo-user-1',
  email: 'demo.resident@example.com',
  full_name: 'Demo Resident',
  token_balance: 2450,
  role: 'resident',
  created_date: '2024-01-15T00:00:00Z',
};

export default function Layout({ children, currentPageName }: LayoutProps) {
  const [user, setUser] = useState<typeof DEMO_USER | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // In a real app, replace this with a call to your auth API (e.g., /api/me)
    setUser(DEMO_USER);
  }, []);

  const navigation = [
    { name: 'Home', href: createPageUrl('Home'), icon: HomeIcon },
    { name: 'Events', href: createPageUrl('Events'), icon: Calendar },
    { name: 'Community', href: createPageUrl('Community'), icon: MessageSquare },
    { name: 'Tokens', href: createPageUrl('Tokens'), icon: Award },
  ];

  const handleSignOut = () => {
    // Replace with real logout logic later
    setUser(null);
  };

  const handleSignIn = () => {
    // Replace with redirect to login page later
    setUser(DEMO_USER);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                County Community
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.name;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full">
                    <Award className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold text-amber-900">
                      {user.token_balance || 0} Tokens
                    </span>
                  </div>
                  <Link to={createPageUrl('Profile')}>
                    <button
                      type="button"
                      className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-5 w-5" />
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="hidden md:flex rounded-full p-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign In
                </button>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.name;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2024 County Community. Building stronger neighborhoods together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


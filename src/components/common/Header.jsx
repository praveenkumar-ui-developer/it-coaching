import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, BookOpen, Settings, Moon, Sun } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../ThemeProvider';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDark, toggleTheme, getThemeStyles } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/instructor';
      default:
        return '/dashboard';
    }
  };

  return (
    <header 
      style={getThemeStyles(
        { backgroundColor: '#ffffff', borderBottomColor: '#e2e8f0' },
        { backgroundColor: '#0f172a', borderBottomColor: '#374151' }
      )}
      className="fixed top-0 left-0 right-0 shadow-sm border-b z-50 transition-colors"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 max-w-none">
          <Link to="/" className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span 
              className="text-xl font-bold hidden sm:block"
              style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
            >
              IT Coach
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              style={getThemeStyles({ color: '#64748b' }, { color: '#cbd5e1' })}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 min-w-0"
                  style={getThemeStyles({ color: '#64748b' }, { color: '#cbd5e1' })}
                >
                  <User className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium hidden sm:block truncate">{user?.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1"
                    style={getThemeStyles(
                      { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                      { backgroundColor: '#1e293b', borderColor: '#475569' }
                    )}
                  >
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                      style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                      style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link 
                  to="/login" 
                  className="font-medium hover:text-indigo-600 text-sm sm:text-base"
                  style={getThemeStyles({ color: '#64748b' }, { color: '#cbd5e1' })}
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm sm:text-base px-3 sm:px-4 py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
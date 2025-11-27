import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Users, 
  Settings, 
  ChevronLeft,
  GraduationCap,
  Trophy,
  DollarSign,
  MessageSquare,
  FileText,
  Cloud,
  X
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../ThemeProvider';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, isAuthenticated } = useAuthStore();
  const { getThemeStyles } = useTheme();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowMobileSidebar(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isAuthenticated) return null;

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/admin' },
          { icon: BookOpen, label: 'Course Management', path: '/admin/courses' },
          { icon: BookOpen, label: 'Create Course', path: '/admin/create-course' },
          { icon: Users, label: 'User Management', path: '/admin/users' },
          { icon: Cloud, label: 'Cloud Management', path: '/admin/cloud' },
          { icon: DollarSign, label: 'Financial', path: '/admin/financial' },
          { icon: Settings, label: 'Settings', path: '/settings' }
        ];
      case 'instructor':
        return [
          { icon: Home, label: 'Dashboard', path: '/instructor' },
          { icon: BookOpen, label: 'My Courses', path: '/instructor/courses' },
          { icon: MessageSquare, label: 'Q&A', path: '/instructor/questions' },
          { icon: FileText, label: 'Grading', path: '/instructor/grading' },
          { icon: Settings, label: 'Settings', path: '/settings' }
        ];
      default:
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: BookOpen, label: 'Courses', path: '/courses' },
          { icon: GraduationCap, label: 'My Learning', path: '/my-learning' },
          { icon: Trophy, label: 'Achievements', path: '/achievements' },
          { icon: BarChart3, label: 'Progress', path: '/progress' },
          { icon: Settings, label: 'Settings', path: '/settings' }
        ];
    }
  };
  
  const navigationItems = getNavigationItems();

  const isActive = (path) => location.pathname === path;

  // Mobile sidebar overlay
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg shadow-lg"
          style={getThemeStyles(
            { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
            { backgroundColor: '#1e293b', borderColor: '#475569' }
          )}
        >
          <BookOpen className="w-5 h-5" style={getThemeStyles({ color: '#64748b' }, { color: '#cbd5e1' })} />
        </button>

        {/* Mobile sidebar overlay */}
        {showMobileSidebar && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSidebar(false)}></div>
            <div 
              className="relative w-64 h-full overflow-y-auto"
              style={getThemeStyles(
                { backgroundColor: '#ffffff' },
                { backgroundColor: '#0f172a' }
              )}
            >
              <div className="p-4 border-b" style={getThemeStyles({}, { borderColor: '#374151' })}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Menu</h2>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" style={getThemeStyles({ color: '#64748b' }, { color: '#cbd5e1' })} />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMobileSidebar(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
                      style={active 
                        ? getThemeStyles(
                            { backgroundColor: '#eef2ff', color: '#4338ca' },
                            { backgroundColor: '#312e81', color: '#a5b4fc' }
                          )
                        : getThemeStyles(
                            { color: '#64748b' },
                            { color: '#cbd5e1' }
                          )
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <div 
      className={`hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] border-r shadow-sm transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={getThemeStyles(
        { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
        { backgroundColor: '#0f172a', borderColor: '#374151' }
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 border rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow"
        style={getThemeStyles(
          { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
          { backgroundColor: '#1e293b', borderColor: '#475569' }
        )}
      >
        <ChevronLeft 
          className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          style={getThemeStyles({ color: '#64748b' }, { color: '#cbd5e1' })}
        />
      </button>

      <nav className={`${isCollapsed ? 'p-2' : 'p-4'} space-y-2`}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-lg transition-colors ${
                isCollapsed 
                  ? 'justify-center p-3' 
                  : 'space-x-3 px-3 py-2.5'
              }`}
              style={active 
                ? getThemeStyles(
                    { backgroundColor: '#eef2ff', color: '#4338ca', borderColor: '#c7d2fe' },
                    { backgroundColor: '#312e81', color: '#a5b4fc', borderColor: '#4338ca' }
                  )
                : getThemeStyles(
                    { color: '#64748b' },
                    { color: '#cbd5e1' }
                  )
              }
              title={item.label}
              onMouseEnter={(e) => {
                if (!active) {
                  const styles = getThemeStyles(
                    { backgroundColor: '#f8fafc', color: '#0f172a' },
                    { backgroundColor: '#1e293b', color: '#f1f5f9' }
                  );
                  Object.assign(e.target.style, styles);
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  const styles = getThemeStyles(
                    { backgroundColor: 'transparent', color: '#64748b' },
                    { backgroundColor: 'transparent', color: '#cbd5e1' }
                  );
                  Object.assign(e.target.style, styles);
                }
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`absolute bottom-4 ${isCollapsed ? 'left-2 right-2' : 'left-4 right-4'}`}>
        <div 
          className={`rounded-lg ${isCollapsed ? 'p-2' : 'p-3'}`}
          style={getThemeStyles(
            { backgroundColor: '#f8fafc' },
            { backgroundColor: '#1e293b' }
          )}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0" title={user?.name}>
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-medium truncate"
                  style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
                >
                  {user?.name}
                </p>
                <p 
                  className="text-xs capitalize"
                  style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
                >
                  {user?.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
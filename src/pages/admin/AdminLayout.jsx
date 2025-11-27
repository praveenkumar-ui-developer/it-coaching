import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Users, DollarSign, Settings, Bell, Search, Cloud } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import useAuthStore from '../../store/authStore';

const AdminLayout = () => {
  const { user } = useAuthStore();
  const { getThemeStyles } = useTheme();
  const location = useLocation();
  const [notifications] = useState(3);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Cloud, label: 'Cloud Management', path: '/admin/cloud' },
    { icon: DollarSign, label: 'Financial', path: '/admin/financial' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
      {/* Top Header */}
      <header className="h-16 border-b flex items-center justify-between px-6" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
            Admin Panel
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={getThemeStyles({ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="w-5 h-5" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{user?.name?.charAt(0)}</span>
            </div>
            <span className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              {user?.name}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 border-r min-h-[calc(100vh-4rem)]" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  style={!isActive ? getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' }) : {}}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
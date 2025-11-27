import { useState, useEffect } from 'react';
import { BarChart3, Settings, Menu, X } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import SystemOverview from './components/SystemOverview';
import AdminPanel from './AdminPanel';
import { AdminDashboardSkeleton } from '../../components/common/Skeleton';

const AdminDashboard = () => {
  const { getThemeStyles } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  const views = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, shortLabel: 'Overview' },
    { id: 'management', label: 'Management Panel', icon: Settings, shortLabel: 'Management' }
  ];

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base mt-1 text-gray-600 dark:text-gray-300">
              Monitor system performance and manage platform operations
            </p>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* View Toggle Navigation */}
        <div className="relative">
          {/* Desktop View Toggle */}
          <div className="hidden sm:flex space-x-1">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => handleViewChange(view.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeView === view.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">{view.label}</span>
                  <span className="lg:hidden">{view.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile View Toggle */}
          <div className={`sm:hidden ${showMobileMenu ? 'block' : 'hidden'} absolute top-0 left-0 right-0 z-20 p-4 rounded-lg border shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
            <div className="space-y-2">
              {views.map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => handleViewChange(view.id)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeView === view.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {view.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active View Indicator for Mobile */}
          <div className="sm:hidden flex items-center justify-center py-3">
            <div className="flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              {(() => {
                const activeViewData = views.find(view => view.id === activeView);
                const Icon = activeViewData.icon;
                return (
                  <>
                    <Icon className="w-5 h-5 mr-2 text-indigo-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {activeViewData.label}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-200">
          {activeView === 'overview' && <SystemOverview />}
          {activeView === 'management' && <AdminPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
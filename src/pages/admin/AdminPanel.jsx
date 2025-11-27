import { useState } from 'react';
import { Users, BookOpen, TrendingUp, Settings, Menu, X } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import UserManagement from './components/UserManagement';
import EnhancedCourseManagement from './EnhancedCourseManagement';
import InstructorManagement from './components/InstructorManagement';
import StudentProgress from './components/StudentProgress';

const AdminPanel = () => {
  const { getThemeStyles } = useTheme();
  const [activeTab, setActiveTab] = useState('users');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users, shortLabel: 'Users' },
    { id: 'courses', label: 'Course Management', icon: BookOpen, shortLabel: 'Courses' },
    { id: 'instructors', label: 'Instructor Management', icon: Settings, shortLabel: 'Instructors' },
    { id: 'progress', label: 'Student Progress', icon: TrendingUp, shortLabel: 'Progress' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowMobileMenu(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Admin Management Panel
        </h1>
        
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
        >
          {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="relative">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Tabs */}
        <div className={`sm:hidden ${showMobileMenu ? 'block' : 'hidden'} absolute top-0 left-0 right-0 z-10 p-4 rounded-lg border shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Indicator for Mobile */}
        <div className="sm:hidden flex items-center justify-center py-3">
          <div className="flex items-center px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
            {(() => {
              const activeTabData = tabs.find(tab => tab.id === activeTab);
              const Icon = activeTabData.icon;
              return (
                <>
                  <Icon className="w-5 h-5 mr-2 text-indigo-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {activeTabData.label}
                  </span>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 sm:p-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'courses' && <EnhancedCourseManagement />}
          {activeTab === 'instructors' && <InstructorManagement />}
          {activeTab === 'progress' && <StudentProgress />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
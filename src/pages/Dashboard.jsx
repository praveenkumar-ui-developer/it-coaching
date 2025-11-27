import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import { useTheme } from '../components/ThemeProvider';
import { StatsSkeleton } from '../components/common/Skeleton';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { getThemeStyles } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.getUserDashboard();
      
      // If no recent activity, fetch available courses to show as suggestions
      if (!response.recentActivity || response.recentActivity.length === 0) {
        try {
          const coursesResponse = await api.getCourses();
          const availableCourses = coursesResponse.courses || [];
          
          if (availableCourses.length > 0) {
            response.recentActivity = availableCourses.slice(0, 2).map(course => ({
              courseId: course._id,
              courseTitle: course.title,
              courseThumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=100',
              progress: 0,
              lastAccessed: new Date().toISOString(),
              timeSpent: 0,
              isEnrolled: false
            }));
          }
        } catch (error) {
          console.log('Could not fetch courses for suggestions');
        }
      }
      
      setDashboardData(response);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        stats: {
          totalCourses: 2,
          completedCourses: 0,
          inProgressCourses: 2,
          totalTimeSpent: 5,
          currentStreak: 3,
          completionRate: 45
        },
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <StatsSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mb-1 animate-pulse"></div>
                      <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-lg shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track your learning progress and continue your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpen, label: 'Total Courses', value: stats.totalCourses || 0, color: '#4f46e5' },
            { icon: Award, label: 'Completed', value: stats.completedCourses || 0, color: '#059669' },
            { icon: Clock, label: 'Hours Learned', value: stats.totalTimeSpent || 0, color: '#2563eb' },
            { icon: TrendingUp, label: 'Current Streak', value: `${stats.currentStreak || 0} days`, color: '#ea580c' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <stat.icon className="w-8 h-8 mr-3" style={{ color: stat.color }} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Link 
                to="/my-learning"
                className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 3).map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <img 
                      src={activity.courseThumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'} 
                      alt={activity.courseTitle}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {activity.courseTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Progress: {activity.progress}%
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last accessed: {new Date(activity.lastAccessed).toLocaleDateString()}
                      </p>
                    </div>
                    <Link 
                      to={activity.isEnrolled === false ? `/course/${activity.courseId}` : `/course/${activity.courseId}/learn`}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
                    >
                      {activity.isEnrolled === false ? 'View Course' : activity.progress > 0 ? 'Continue' : 'Start'}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300">
                    No enrolled courses yet
                  </p>
                  <Link to="/courses" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors mt-4 inline-block">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Progress Overview
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    Overall Completion
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {stats.completionRate || 0}%
                  </span>
                </div>
                <div className="w-full rounded-full h-2 bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${stats.completionRate || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{stats.inProgressCourses || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    In Progress
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.completedCourses || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Play, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../components/ThemeProvider';
import { CardSkeleton } from '../components/common/Skeleton';

const Learning = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getThemeStyles } = useTheme();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // Also fetch when component becomes visible (for navigation)
  useEffect(() => {
    const handleFocus = () => {
      console.log('Learning page focused, refetching courses');
      fetchEnrolledCourses();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  


  const fetchEnrolledCourses = async () => {
    try {
      console.log('Fetching enrolled courses...');
      const response = await api.getEnrolledCourses();
      console.log('Enrolled courses response:', response);
      
      const courses = response.courses || response || [];
      console.log('Processed courses:', courses);
      
      const coursesWithProgress = courses.map(course => ({
        ...course,
        lastAccessed: new Date(course.enrolledAt || Date.now()),
        progress: course.progress || 0,
        completedLessons: course.completedLessons || 0,
        totalLessons: course.totalLessons || 8,
        timeSpent: course.timeSpent || 0
      }));
      
      console.log('Final courses with progress:', coursesWithProgress);
      setEnrolledCourses(coursesWithProgress);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            My Learning
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Continue your learning journey with your enrolled courses
          </p>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <div 
                key={course._id}
                className="p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="flex space-x-4">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold mb-2 truncate text-gray-900 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-sm mb-3 line-clamp-2 text-gray-600 dark:text-gray-300">
                      {course.shortDescription}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm mb-3">
                      <span className="flex items-center text-gray-600 dark:text-gray-300">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.completedLessons || 0}/{course.totalLessons || 8} lessons
                      </span>
                      <span className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 mr-1" />
                        {Math.floor((course.timeSpent || 0) / 60)}h {(course.timeSpent || 0) % 60}m
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-300">
                          Progress
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {course.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full rounded-full h-2 bg-gray-200 dark:bg-gray-700">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                      </span>
                      <Link 
                        to={`/course/${course._id}/learn`}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        {(course.progress || 0) > 0 ? (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Continue
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              No enrolled courses yet
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Start your learning journey by enrolling in a course
            </p>
            <Link 
              to="/courses" 
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Code, CheckCircle, Clock, Users, ChevronDown, BookOpen, Lock, Unlock, Star } from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../components/ThemeProvider';
import { CourseDetailSkeleton } from '../../components/common/Skeleton';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getThemeStyles } = useTheme();
  const [course, setCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showEnrollNotification, setShowEnrollNotification] = useState(false);

  // Sort modules by order
  const sortedModules = course?.modules ? [...course.modules].sort((a, b) => (a.order || 0) - (b.order || 0)) : [];

  useEffect(() => {
    fetchCourse();
    checkEnrollmentStatus();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.getCourse(courseId);
      console.log('Course API response:', response);
      
      // Handle both direct course data and wrapped response
      const courseData = response.course || response;
      console.log('Course data:', courseData);
      
      setCourse(courseData);
      
      // Set first available module
      if (courseData.modules?.length > 0) {
        const sortedModules = [...courseData.modules].sort((a, b) => (a.order || 0) - (b.order || 0));
        setSelectedModule(sortedModules[0]);
        console.log('Selected first module:', sortedModules[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      if (!user) {
        setIsEnrolled(false);
        return;
      }
      const response = await api.getEnrolledCourses();
      const enrolled = response.courses?.some(c => c._id === courseId);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setIsEnrolled(false);
    }
  };

  const handleModuleClick = (module) => {
    const isModuleLocked = !isEnrolled && !module.isPreview;
    if (isModuleLocked) {
      setShowEnrollNotification(true);
      setTimeout(() => setShowEnrollNotification(false), 3000);
    } else {
      setSelectedModule(module);
    }
  };

  const handleEnrollClick = () => {
    navigate(`/course/${courseId}/payment`);
  };

  const handleStartLearning = () => {
    navigate(`/course/${courseId}/learn`);
  };

  if (!course) {
    return <CourseDetailSkeleton />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
      {/* Enrollment Notification */}
      {showEnrollNotification && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          🔒 You need to enroll to access this module.
        </div>
      )}
      
      {/* Course Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{course?.title}</h1>
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>{course?.stats?.totalEnrollments || 0} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{course?.stats?.averageRating || 0} ({course?.stats?.totalRatings || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span>{course?.duration || 0} minutes</span>
                </div>
                <span>Instructor: {course?.instructor}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isEnrolled ? (
                <button
                  onClick={handleStartLearning}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Learning</span>
                </button>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Enroll Now - ${course?.price || 299}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Course Modules */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Course Modules</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isEnrolled ? 'Full Access' : 'Preview Mode'}
            </p>
          </div>
          
          <div className="overflow-y-auto h-full p-2">
            <div className="space-y-2">
              {sortedModules.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4" />
                  <p>No modules available</p>
                </div>
              )}
              {sortedModules.map((module, moduleIndex) => {
                const isModuleLocked = !isEnrolled && !module.isPreview;
                const isSelected = selectedModule?._id === module._id;
                
                return (
                  <button
                    key={module._id}
                    onClick={() => handleModuleClick(module)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      isModuleLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    style={isSelected 
                      ? getThemeStyles(
                          { backgroundColor: '#eef2ff', borderColor: '#c7d2fe', color: '#4338ca' },
                          { backgroundColor: '#312e81', borderColor: '#4338ca', color: '#a5b4fc' }
                        )
                      : getThemeStyles(
                          { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                          { backgroundColor: '#1e293b', borderColor: '#374151' }
                        )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isModuleLocked ? (
                          <Lock className="w-5 h-5 text-red-500" />
                        ) : (
                          <Unlock className="w-5 h-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{module.title}</p>
                          <p className="text-xs text-gray-500">{module.topics?.length || 0} topics</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        {isModuleLocked && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            🔒
                          </span>
                        )}
                        {module.isPreview && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Preview
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedModule ? (
            <>
              {/* Module Header */}
              <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedModule.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">{selectedModule.description}</p>
              </div>

              {/* Module Topics */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Topics in this Module</h3>
                
                {selectedModule.topics && selectedModule.topics.length > 0 ? (
                  <div className="space-y-4">
                    {selectedModule.topics
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((topic, index) => {
                        const canAccessTopic = isEnrolled || selectedModule.isPreview;
                        return (
                        <div
                          key={topic._id || index}
                          className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {topic.videoUrl ? (
                                <div className="w-16 h-12 bg-indigo-100 dark:bg-indigo-900 rounded flex items-center justify-center">
                                  <Play className="w-6 h-6 text-indigo-600" />
                                </div>
                              ) : (
                                <div className="w-16 h-12 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                                  <Code className="w-6 h-6 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{topic.title}</h4>
                              <p className="text-sm mb-3 text-gray-600 dark:text-gray-300">{topic.description}</p>
                              
                              {/* Topic Content - Show for preview modules or enrolled users */}
                              {canAccessTopic && topic.content && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Lesson Content:</h5>
                                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {topic.content}
                                  </div>
                                </div>
                              )}
                              
                              {/* Locked content message */}
                              {!canAccessTopic && (
                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <Lock className="w-4 h-4 text-yellow-600" />
                                    <span className="text-sm text-yellow-800 dark:text-yellow-200">Enroll to access full lesson content</span>
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center space-x-4 text-xs mt-3">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-600 dark:text-gray-300">{topic.duration || 10} min</span>
                                </div>
                                {topic.cloudProvider && (
                                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                                    {topic.cloudProvider}
                                  </span>
                                )}
                                {selectedModule.isPreview && (
                                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
                                    Preview Available
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )})}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-600 dark:text-gray-300">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">No topics available in this module.</p>
                    <p className="text-sm mt-2">Check back later for new content!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Select a Module</h3>
                <p className="text-gray-600 dark:text-gray-300">Choose a module from the sidebar to view its content and topics.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
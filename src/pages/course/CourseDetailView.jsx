import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Lock, CheckCircle, Clock, Users, Star, BookOpen, ArrowRight } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import useAuthStore from '../../store/authStore';

const CourseDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getThemeStyles } = useTheme();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('introduction');

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`);
      const data = await response.json();
      setCourse(data);
      
      // Check if user is enrolled
      if (user) {
        const enrollmentResponse = await fetch(`http://localhost:5000/api/courses/${id}/enrollment-status`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const enrollmentData = await enrollmentResponse.json();
        setIsEnrolled(enrollmentData.isEnrolled);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        setIsEnrolled(true);
        alert('Successfully enrolled in the course!');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Error enrolling in course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const previewModules = course?.modules?.filter(m => m.isPreview) || [];
  const allModules = course?.modules || [];
  const visibleModules = isEnrolled ? allModules : previewModules;

  return (
    <div className="min-h-screen py-8" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <img 
              src={course?.thumbnail} 
              alt={course?.title}
              className="w-full lg:w-80 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course?.title}</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">By {course?.instructor}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl font-bold text-indigo-600">${course?.price}</span>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-gray-600 dark:text-gray-300">4.8 (1,234 reviews)</span>
                </div>
              </div>
              {!isEnrolled ? (
                <button 
                  onClick={handleEnroll}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Enroll Now
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Enrolled</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/course/${id}/learn`)}
                    className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {['introduction', 'basics', 'content'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab === 'introduction' && 'Introduction'}
                {tab === 'basics' && 'Learn Basics'}
                {tab === 'content' && 'Course Content'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Introduction Tab */}
            {activeTab === 'introduction' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {course?.introduction?.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {course?.introduction?.description}
                </p>
                {course?.introduction?.videoUrl && (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center h-64">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-indigo-600 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-300">Introduction Video</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{course?.introduction?.duration} minutes</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Learn Basics Tab */}
            {activeTab === 'basics' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {course?.learnBasics?.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {course?.learnBasics?.description}
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {course?.learnBasics?.content}
                  </p>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Learning Points:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course?.learnBasics?.keyPoints?.map((point, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content Tab */}
            {activeTab === 'content' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Content</h2>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {visibleModules.length} of {allModules.length} modules
                    {!isEnrolled && ' (Preview)'}
                  </div>
                </div>

                <div className="space-y-6">
                  {visibleModules.map((module, index) => (
                    <div key={module._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img 
                              src={module.image} 
                              alt={module.title}
                              className="w-16 h-16 object-cover rounded-lg mr-4"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Module {index + 1}: {module.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300">{module.description}</p>
                            </div>
                          </div>
                          {!isEnrolled && !module.isPreview && (
                            <Lock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-3">
                          {module.topics?.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center">
                                <Play className="w-4 h-4 text-indigo-600 mr-3" />
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">{topic.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{topic.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                {topic.duration}m
                                {!isEnrolled && !module.isPreview && (
                                  <Lock className="w-4 h-4 ml-2" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!isEnrolled && allModules.length > previewModules.length && (
                  <div className="mt-8 text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {allModules.length - previewModules.length} More Modules Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Enroll in this course to access all modules and start your learning journey.
                    </p>
                    <button 
                      onClick={handleEnroll}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Enroll Now for ${course?.price}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;
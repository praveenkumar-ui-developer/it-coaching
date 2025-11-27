import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, BookOpen, Play, Award, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../components/ThemeProvider';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getThemeStyles } = useTheme();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      navigate(`/course/${courseId}`);
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}
      >
        <div className="text-center">
          <h2 
            className="text-2xl font-bold mb-2"
            style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
          >
            Course not found
          </h2>
          <button onClick={() => navigate('/courses')} className="btn-primary">
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="flex items-center space-x-2 mb-6 transition-colors"
          style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div 
              className="p-6 rounded-lg shadow-sm border"
              style={getThemeStyles(
                { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                { backgroundColor: '#1e293b', borderColor: '#374151' }
              )}
            >
              <img 
                src={course.thumbnail || 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800'} 
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              
              <div className="flex items-center space-x-4 mb-4">
                <span 
                  className="px-3 py-1 text-sm font-medium rounded-full"
                  style={getThemeStyles(
                    { backgroundColor: '#eef2ff', color: '#4338ca' },
                    { backgroundColor: '#312e81', color: '#a5b4fc' }
                  )}
                >
                  {course.category}
                </span>
                <span 
                  className="px-3 py-1 text-sm font-medium rounded-full"
                  style={getThemeStyles(
                    { backgroundColor: '#dcfce7', color: '#166534' },
                    { backgroundColor: '#14532d', color: '#86efac' }
                  )}
                >
                  {course.level}
                </span>
              </div>

              <h1 
                className="text-3xl font-bold mb-4"
                style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
              >
                {course.title}
              </h1>
              
              <div 
                className="flex items-center space-x-6 mb-6 text-sm"
                style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
              >
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span 
                    className="font-medium"
                    style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
                  >
                    {course.stats?.averageRating || 4.8}
                  </span>
                  <span>({course.stats?.totalRatings || 150} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.stats?.totalEnrollments || 500} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round((course.duration || 1800) / 60)}h total</span>
                </div>
              </div>

              <p 
                className="leading-relaxed"
                style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}
              >
                {course.description}
              </p>
            </div>

            <div 
              className="p-6 rounded-lg shadow-sm border"
              style={getThemeStyles(
                { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                { backgroundColor: '#1e293b', borderColor: '#374151' }
              )}
            >
              <h2 
                className="text-2xl font-bold mb-6"
                style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
              >
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(course.learningObjectives || [
                  'Master the fundamentals',
                  'Build real-world projects',
                  'Industry best practices',
                  'Problem-solving skills'
                ]).map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}>
                      {objective}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="p-6 rounded-lg shadow-sm border"
              style={getThemeStyles(
                { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                { backgroundColor: '#1e293b', borderColor: '#374151' }
              )}
            >
              <h2 
                className="text-2xl font-bold mb-6"
                style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
              >
                Course Modules
              </h2>
              <div className="space-y-4">
                {(course.modules || [
                  { id: 1, title: 'Introduction & Setup', lessons: course.lessons?.slice(0, 3) || [] },
                  { id: 2, title: 'Core Fundamentals', lessons: course.lessons?.slice(3, 6) || [] },
                  { id: 3, title: 'Advanced Concepts', lessons: course.lessons?.slice(6, 9) || [] },
                  { id: 4, title: 'Projects & Practice', lessons: course.lessons?.slice(9) || [] }
                ]).map((module, moduleIndex) => (
                  <div 
                    key={module.id}
                    className="border rounded-lg overflow-hidden"
                    style={getThemeStyles({ borderColor: '#e2e8f0' }, { borderColor: '#374151' })}
                  >
                    <div 
                      className="p-4 font-semibold"
                      style={getThemeStyles(
                        { backgroundColor: '#f8fafc', color: '#374151' },
                        { backgroundColor: '#334155', color: '#cbd5e1' }
                      )}
                    >
                      Module {moduleIndex + 1}: {module.title}
                      <span 
                        className="ml-2 text-sm font-normal"
                        style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
                      >
                        ({module.lessons?.length || 0} lessons)
                      </span>
                    </div>
                    <div className="space-y-0">
                      {(module.lessons || []).map((lesson, index) => (
                        <div 
                          key={lesson._id || index}
                          className="flex items-center justify-between p-4 border-t"
                          style={getThemeStyles({ borderColor: '#f1f5f9' }, { borderColor: '#475569' })}
                        >
                          <div className="flex items-center space-x-3">
                            {lesson.type === 'video' ? (
                              <Play className="w-5 h-5 text-indigo-600" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-indigo-600" />
                            )}
                            <div>
                              <h3 
                                className="font-medium"
                                style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
                              >
                                {lesson.title}
                              </h3>
                              <p 
                                className="text-sm"
                                style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
                              >
                                {lesson.description || 'Learn the fundamentals'}
                              </p>
                            </div>
                          </div>
                          <div 
                            className="text-sm font-medium"
                            style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
                          >
                            {lesson.duration || 10} min
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )) || (
                  <div 
                    className="text-center py-8"
                    style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
                  >
                    Course modules will be available after enrollment
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div 
              className="p-6 rounded-lg shadow-sm border sticky top-24"
              style={getThemeStyles(
                { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                { backgroundColor: '#1e293b', borderColor: '#374151' }
              )}
            >
              <div className="text-center mb-6">
                <div 
                  className="text-3xl font-bold mb-2"
                  style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
                >
                  ${course.price || 99}
                </div>
                {course.originalPrice && course.originalPrice > course.price && (
                  <div 
                    className="text-lg line-through"
                    style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
                  >
                    ${course.originalPrice}
                  </div>
                )}
              </div>

              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full btn-primary text-lg py-4 mb-4 disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>

              <div 
                className="text-center text-sm mb-6"
                style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}
              >
                30-day money-back guarantee
              </div>

              <div className="space-y-4">
                <h3 
                  className="font-semibold"
                  style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
                >
                  This course includes:
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { icon: Play, text: `${Math.round((course.duration || 1800) / 60)} hours of video content` },
                    { icon: BookOpen, text: `${course.lessons?.length || 10} lessons` },
                    { icon: Award, text: 'Certificate of completion' },
                    { icon: Users, text: 'Lifetime access' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 text-slate-400" />
                      <span style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
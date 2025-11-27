import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, DollarSign, Plus, Edit, MessageSquare, Award, Clock } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import { InstructorDashboardSkeleton } from '../../components/common/Skeleton';

const InstructorDashboard = () => {
  const { user } = useAuthStore();
  const { getThemeStyles } = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, coursesRes, questionsRes, submissionsRes] = await Promise.all([
        api.get('/instructor/analytics'),
        api.get('/instructor/courses'),
        api.get('/instructor/questions'),
        api.get('/instructor/submissions')
      ]);
      
      setAnalytics(analyticsRes.data);
      setCourses(coursesRes.data.courses);
      setQuestions(questionsRes.data.questions);
      setSubmissions(submissionsRes.data.submissions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <InstructorDashboardSkeleton />;
  }

  return (
    <div 
      className="min-h-screen py-8"
      style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 
              className="text-3xl font-bold"
              style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
            >
              Instructor Dashboard
            </h1>
            <p style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
              Welcome back, {user?.name}!
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {['overview', 'courses', 'questions', 'grading'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Students', value: analytics?.totalStudents || 0, color: '#059669' },
            { icon: TrendingUp, label: 'Avg Rating', value: analytics?.averageRating || 0, color: '#ea580c' },
            { icon: DollarSign, label: 'Total Earnings', value: `$${analytics?.totalEarnings || 0}`, color: '#2563eb' },
            { icon: BookOpen, label: 'Courses', value: analytics?.coursesCount || 0, color: '#4f46e5' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg shadow-sm border"
              style={getThemeStyles(
                { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
                { backgroundColor: '#1e293b', borderColor: '#374151' }
              )}
            >
              <div className="flex items-center">
                <stat.icon className="w-8 h-8 mr-3" style={{ color: stat.color }} />
                <div>
                  <p className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
              <h2 className="text-xl font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Student Progress Overview</h2>
              <div className="space-y-4">
                {analytics?.studentProgress?.map((progress, index) => (
                  <div key={index} className="p-4 rounded-lg" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#334155' })}>
                    <h3 className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{progress.courseName}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Completion Rate: {progress.completionRate}%</span>
                      <span className="text-sm text-red-600">Struggling: {progress.strugglingStudents}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${progress.completionRate}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
              <h2 className="text-xl font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Recent Questions</h2>
              <div className="space-y-3">
                {questions.slice(0, 5).map((question) => (
                  <div key={question._id} className="p-3 rounded-lg" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#334155' })}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{question.student}</h4>
                        <p className="text-sm mt-1" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>{question.question}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        question.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{question.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>My Courses</h2>
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}>
                  <h3 className="font-medium mb-2" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{course.title}</h3>
                  <div className="space-y-1 text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                    <p>Students: {course.enrollments}</p>
                    <p>Rating: ⭐ {course.rating}</p>
                    <p>Earnings: ${course.earnings}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{course.status}</span>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h2 className="text-xl font-semibold mb-6" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Student Questions</h2>
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question._id} className="p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{question.student}</h3>
                      <p className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>{question.course}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      question.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{question.status}</span>
                  </div>
                  <p className="mb-3" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{question.question}</p>
                  {question.status === 'pending' && (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                      Answer Question
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'grading' && (
          <div className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h2 className="text-xl font-semibold mb-6" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Student Submissions</h2>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission._id} className="p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{submission.student}</h3>
                      <p className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>{submission.assignment}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{submission.status}</span>
                      {submission.grade && (
                        <p className="text-sm mt-1 font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Grade: {submission.grade}%</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                  {submission.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        Review Submission
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Grade
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
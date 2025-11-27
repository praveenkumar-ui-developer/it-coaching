import { useState, useEffect } from 'react';
import { Users, BookOpen, TrendingUp, Award, Search, Filter, X } from 'lucide-react';
import { useTheme } from '../../../components/ThemeProvider';
import api from '../../../utils/api';

const StudentProgress = () => {
  const { getThemeStyles } = useTheme();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [progressFilter, setProgressFilter] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    loadStudentProgress();
  }, []);

  const loadStudentProgress = async () => {
    setLoading(true);
    try {
      const response = await api.getStudentProgress();
      setStudents(response.students || []);
    } catch (error) {
      console.error('Failed to load student progress:', error);
      setStudents([]);
    }
    setLoading(false);
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressLabel = (progress) => {
    if (progress >= 80) return 'Excellent';
    if (progress >= 60) return 'Good';
    if (progress >= 40) return 'Average';
    if (progress >= 20) return 'Needs Improvement';
    return 'Just Started';
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (progressFilter === 'all') return true;
    
    const avgProgress = student.courses.length > 0 
      ? student.courses.reduce((sum, course) => sum + course.progress, 0) / student.courses.length 
      : 0;

    switch (progressFilter) {
      case 'excellent': return avgProgress >= 80;
      case 'good': return avgProgress >= 60 && avgProgress < 80;
      case 'average': return avgProgress >= 40 && avgProgress < 60;
      case 'poor': return avgProgress < 40;
      default: return true;
    }
  });

  const studentStats = {
    total: students.length,
    enrolled: students.filter(s => s.courses.length > 0).length,
    completed: students.filter(s => s.courses.some(c => c.progress === 100)).length,
    avgProgress: students.length > 0 
      ? Math.round(students.reduce((sum, student) => {
          const studentAvg = student.courses.length > 0 
            ? student.courses.reduce((courseSum, course) => courseSum + course.progress, 0) / student.courses.length 
            : 0;
          return sum + studentAvg;
        }, 0) / students.length)
      : 0
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
          Student Progress Tracking
        </h2>
        <p className="text-sm mt-1" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
          Monitor student learning progress and course completion
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="text-lg sm:text-2xl font-bold text-indigo-600">{studentStats.total}</div>
          <div className="text-xs sm:text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Total Students</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="text-lg sm:text-2xl font-bold text-blue-600">{studentStats.enrolled}</div>
          <div className="text-xs sm:text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Enrolled</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="text-lg sm:text-2xl font-bold text-green-600">{studentStats.completed}</div>
          <div className="text-xs sm:text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Completed Courses</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="text-lg sm:text-2xl font-bold text-purple-600">{studentStats.avgProgress}%</div>
          <div className="text-xs sm:text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Avg Progress</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
            style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#d1d5db' }, { backgroundColor: '#334155', borderColor: '#475569' })}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="sm:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg"
            style={getThemeStyles({ backgroundColor: '#f1f5f9', color: '#374151' }, { backgroundColor: '#334155', color: '#cbd5e1' })}
          >
            <span className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Progress
            </span>
            {showMobileFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          </button>
        </div>

        {/* Filters */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
          <div className="flex flex-col sm:flex-row gap-2">
            {[
              { value: 'all', label: 'All Progress Levels' },
              { value: 'excellent', label: 'Excellent (80%+)' },
              { value: 'good', label: 'Good (60-79%)' },
              { value: 'average', label: 'Average (40-59%)' },
              { value: 'poor', label: 'Needs Improvement (<40%)' }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => {
                  setProgressFilter(filterOption.value);
                  setShowMobileFilters(false);
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  progressFilter === filterOption.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={progressFilter !== filterOption.value ? getThemeStyles(
                  { backgroundColor: '#f1f5f9', color: '#374151' },
                  { backgroundColor: '#334155', color: '#cbd5e1' }
                ) : {}}
              >
                <span className="hidden sm:inline">{filterOption.label}</span>
                <span className="sm:hidden">{filterOption.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-8" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
            {searchTerm || progressFilter !== 'all' ? 'No students match your search criteria' : 'No student progress data available'}
          </div>
        ) : (
          filteredStudents.map((student) => {
            const avgProgress = student.courses.length > 0 
              ? Math.round(student.courses.reduce((sum, course) => sum + course.progress, 0) / student.courses.length)
              : 0;

            return (
              <div key={student._id} className="p-4 sm:p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold truncate" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                        {student.name}
                      </h3>
                      <p className="text-sm truncate" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                        {student.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xl sm:text-2xl font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                        {avgProgress}%
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        avgProgress >= 80 ? 'bg-green-100 text-green-800' :
                        avgProgress >= 60 ? 'bg-blue-100 text-blue-800' :
                        avgProgress >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getProgressLabel(avgProgress)}
                      </span>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(avgProgress)}`}
                        style={{ width: `${avgProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                    <span className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                      {student.courses.length} Enrolled Courses
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                    <span className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                      {student.courses.filter(c => c.progress === 100).length} Completed
                    </span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                    <span className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                      {student.courses.filter(c => c.progress > 0 && c.progress < 100).length} In Progress
                    </span>
                  </div>
                </div>

                {student.courses.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium mb-3" style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}>
                      Course Progress:
                    </h4>
                    <div className="space-y-3">
                      {student.courses.map((course) => (
                        <div key={course.courseId} className="p-3 rounded-lg" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#334155' })}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <span className="text-sm font-medium truncate" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                              {course.courseTitle}
                            </span>
                            <span className="text-sm font-medium" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                              {course.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                            <span>Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</span>
                            {course.completedAt && (
                              <span>Completed: {new Date(course.completedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                    No courses enrolled yet
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentProgress;
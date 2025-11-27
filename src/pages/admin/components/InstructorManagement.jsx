import { useState, useEffect } from 'react';
import { GraduationCap, Users, BookOpen, DollarSign, UserPlus, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../components/ThemeProvider';
import api from '../../../utils/api';

const InstructorManagement = () => {
  const { getThemeStyles } = useTheme();
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [instructorsResponse, coursesResponse] = await Promise.all([
        api.get('/admin/instructors'),
        api.get('/admin/courses')
      ]);
      
      setInstructors(instructorsResponse.instructors || []);
      setCourses(coursesResponse.courses || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const handleAssignInstructor = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedInstructor) {
      alert('Please select both course and instructor');
      return;
    }

    try {
      await api.post('/admin/assign-instructor', {
        courseId: selectedCourse,
        instructorId: selectedInstructor
      });
      
      setShowAssignForm(false);
      setSelectedCourse('');
      setSelectedInstructor('');
      loadData();
      alert('Instructor assigned successfully!');
    } catch (error) {
      alert(error.message || 'Failed to assign instructor');
    }
  };

  const instructorStats = {
    total: instructors.length,
    active: instructors.filter(i => i.isActive).length,
    totalCourses: instructors.reduce((sum, instructor) => sum + instructor.courses.length, 0),
    totalStudents: instructors.reduce((sum, instructor) => 
      sum + instructor.courses.reduce((courseSum, course) => courseSum + (course.enrollmentCount || 0), 0), 0
    )
  };

  const unassignedCourses = courses.filter(course => 
    !instructors.some(instructor => 
      instructor.courses.some(instructorCourse => instructorCourse._id === course._id)
    )
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
            Instructor Management
          </h2>
          <p className="text-sm mt-1" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
            Manage instructors and course assignments
          </p>
        </div>
        <button
          onClick={() => setShowAssignForm(true)}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Instructor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="text-lg sm:text-2xl font-bold text-indigo-600">{instructorStats.total}</div>
          <div className="text-xs sm:text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Total Instructors</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="text-lg sm:text-2xl font-bold text-green-600">{instructorStats.active}</div>
          <div className="text-xs sm:text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Active</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="text-lg sm:text-2xl font-bold text-blue-600">{instructorStats.totalCourses}</div>
          <div className="text-xs sm:text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Assigned Courses</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="text-lg sm:text-2xl font-bold text-purple-600">{instructorStats.totalStudents}</div>
          <div className="text-xs sm:text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Total Students</div>
        </div>
      </div>

      {/* Assignment Form Modal */}
      {showAssignForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full p-4 sm:p-6 rounded-lg" style={getThemeStyles({ backgroundColor: '#ffffff' }, { backgroundColor: '#1e293b' })}>
            <h3 className="text-lg font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Assign Instructor to Course
            </h3>
            
            <form onSubmit={handleAssignInstructor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}>
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#d1d5db' }, { backgroundColor: '#334155', borderColor: '#475569' })}
                  required
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}>
                  Select Instructor
                </label>
                <select
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#d1d5db' }, { backgroundColor: '#334155', borderColor: '#475569' })}
                  required
                >
                  <option value="">Choose an instructor...</option>
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name} ({instructor.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                >
                  Assign Instructor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignForm(false);
                    setSelectedCourse('');
                    setSelectedInstructor('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unassigned Courses Alert */}
      {unassignedCourses.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg" style={getThemeStyles({}, { backgroundColor: '#451a03', borderColor: '#92400e' })}>
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" style={getThemeStyles({}, { color: '#fbbf24' })} />
            <div className="flex-1">
              <div className="text-yellow-800 text-sm sm:text-base" style={getThemeStyles({}, { color: '#fbbf24' })}>
                <strong>Notice:</strong> {unassignedCourses.length} course(s) need instructor assignment:
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {unassignedCourses.map((course) => (
                  <span key={course._id} className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs sm:text-sm">
                    {course.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructors List */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : instructors.length === 0 ? (
          <div className="text-center py-8" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
            No instructors found. Create instructor accounts in User Management.
          </div>
        ) : (
          instructors.map((instructor) => (
            <div key={instructor._id} className="p-4 sm:p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold truncate" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                      {instructor.name}
                    </h3>
                    <p className="text-sm truncate" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                      {instructor.email}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full flex-shrink-0 ${
                  instructor.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {instructor.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  <span className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                    {instructor.courses.length} Courses
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                  <span className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                    {instructor.courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0)} Students
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                  <span className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                    ${instructor.courses.reduce((sum, course) => sum + ((course.enrollmentCount || 0) * 50), 0)} Revenue
                  </span>
                </div>
              </div>

              {instructor.courses.length > 0 ? (
                <div>
                  <h4 className="text-sm font-medium mb-2" style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}>
                    Assigned Courses:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.courses.map((course) => (
                      <div
                        key={course._id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
                      >
                        <span className="truncate max-w-[150px] sm:max-w-none">{course.title}</span>
                        {course.status && (
                          <span className={`ml-2 px-1 py-0.5 text-xs rounded flex-shrink-0 ${
                            course.status === 'published' 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {course.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                  No courses assigned yet
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstructorManagement;
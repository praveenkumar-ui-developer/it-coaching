import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Users, DollarSign, Calendar, Menu, X, Filter } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import api from '../../utils/api';

const CourseManagement = () => {
  const { getThemeStyles } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    price: 0,
    thumbnail: '',
    status: 'draft',
    level: 'beginner',
    duration: 0,
    tags: '',
    prerequisites: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/courses');
      console.log('CourseManagement - API Response:', response);
      console.log('CourseManagement - Courses:', response.courses);
      response.courses?.forEach(course => {
        console.log(`CourseManagement - ${course.title}: ${course.modules?.length || 0} modules`);
      });
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!courseForm.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!courseForm.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    
    if (!courseForm.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (courseForm.price < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const courseData = {
        ...courseForm,
        tags: courseForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        prerequisites: courseForm.prerequisites.split(',').map(prereq => prereq.trim()).filter(prereq => prereq)
      };
      
      await api.post('/admin/courses', courseData);
      resetForm();
      loadCourses();
      alert('Course created successfully!');
    } catch (error) {
      alert(error.message || 'Failed to create course');
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const courseData = {
        ...courseForm,
        tags: courseForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        prerequisites: courseForm.prerequisites.split(',').map(prereq => prereq.trim()).filter(prereq => prereq)
      };
      
      await api.put(`/admin/courses/${editingCourse._id}`, courseData);
      resetForm();
      loadCourses();
      alert('Course updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete course "${courseTitle}"? This action cannot be undone.`)) {
      try {
        await api.delete(`/admin/courses/${courseId}`);
        loadCourses();
        alert('Course deleted successfully!');
      } catch (error) {
        alert(error.message || 'Failed to delete course');
      }
    }
  };

  const editCourse = (course) => {
    console.log('Editing course in CourseManagement:', course);
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      shortDescription: course.shortDescription || '',
      category: course.category || '',
      price: course.price || 0,
      thumbnail: course.thumbnail || '',
      status: course.status || 'draft',
      level: course.level || 'beginner',
      duration: course.duration || 0,
      tags: Array.isArray(course.tags) ? course.tags.join(', ') : (course.tags || ''),
      prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.join(', ') : (course.prerequisites || '')
    });
    setShowForm(true);
    setErrors({});
  };

  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      shortDescription: '',
      category: '',
      price: 0,
      thumbnail: '',
      status: 'draft',
      level: 'beginner',
      duration: 0,
      tags: '',
      prerequisites: ''
    });
    setEditingCourse(null);
    setShowForm(false);
    setErrors({});
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'intermediate': return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'advanced': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.status === filter;
  });

  const courseStats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    archived: courses.filter(c => c.status === 'archived').length
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            Course Management
          </h2>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
            Create, edit, and manage courses
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-lg sm:text-2xl font-bold text-indigo-600">{courseStats.total}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Courses</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-lg sm:text-2xl font-bold text-green-600">{courseStats.published}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Published</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-lg sm:text-2xl font-bold text-yellow-600">{courseStats.draft}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Drafts</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-lg sm:text-2xl font-bold text-gray-600">{courseStats.archived}</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Archived</div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200"
        >
          <span className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter Courses
          </span>
          {showMobileFilters ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Filters */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
        <div className="flex flex-col sm:flex-row gap-2">
          {['all', 'published', 'draft', 'archived'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => {
                setFilter(filterType);
                setShowMobileFilters(false);
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors capitalize text-sm sm:text-base ${
                filter === filterType
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterType === 'all' ? 'All Courses' : filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h3>
            
            <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter course title"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.category ? 'border-red-500' : ''}`}
                    placeholder="e.g., Programming, Design"
                  />
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={courseForm.status}
                    onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Short Description *
                </label>
                <textarea
                  value={courseForm.shortDescription}
                  onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white ${errors.shortDescription ? 'border-red-500' : ''}`}
                  rows="2"
                  placeholder="Brief description for course cards"
                />
                {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Full Description
                </label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  rows="3"
                  placeholder="Detailed course description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={courseForm.tags}
                    onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="javascript, react, frontend"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Prerequisites
                  </label>
                  <input
                    type="text"
                    value={courseForm.prerequisites}
                    onChange={(e) => setCourseForm({ ...courseForm, prerequisites: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="Basic HTML, CSS knowledge"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 sm:p-6 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                    <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-6">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-300">
            No courses found
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course._id} className="p-4 sm:p-6 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {course.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(course.status)}`}>
                        {course.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3 text-gray-600 dark:text-gray-300">
                    {course.shortDescription}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.category}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${course.price}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {course.enrollments || 0} enrolled
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.modulesCount || course.modules?.length || 0} modules
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(course.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 sm:ml-4">
                  <button
                    onClick={() => editCourse(course)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Edit Course"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id, course.title)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
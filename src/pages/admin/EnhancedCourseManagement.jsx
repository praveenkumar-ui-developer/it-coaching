import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Video, Upload, Save, X, Image, Play } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';

const EnhancedCourseManagement = () => {
  const { getThemeStyles } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: 0,
    thumbnail: '',
    category: '',
    level: 'beginner',
    tags: [],
    prerequisites: [],
    introduction: {
      title: '',
      description: '',
      videoUrl: '',
      duration: 0
    },
    learnBasics: {
      title: '',
      description: '',
      content: '',
      keyPoints: ['']
    },
    modules: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/courses');
      const data = await response.json();
      console.log('API Response:', data);
      console.log('Courses received:', data.courses);
      data.courses?.forEach(course => {
        console.log(`Course: ${course.title}, Modules: ${course.modules?.length || 0}`);
      });
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleVideoUpload = async (file, moduleIndex, topicIndex) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('courseId', editingCourse?._id || 'new');
    formData.append('moduleIndex', moduleIndex);
    formData.append('topicIndex', topicIndex);

    try {
      const response = await fetch('http://localhost:5000/api/admin/upload-video', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (data.success) {
        // Update the video URL in the form
        const updatedModules = [...courseForm.modules];
        updatedModules[moduleIndex].topics[topicIndex].videoUrl = data.videoUrl;
        updatedModules[moduleIndex].topics[topicIndex].cloudProvider = data.cloudProvider;
        setCourseForm({ ...courseForm, modules: updatedModules });
        showToast('Video uploaded successfully!', 'success');
      } else {
        showToast('Video upload failed: ' + (data.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      showToast('Error uploading video', 'error');
    }
  };

  const addModule = () => {
    const newModule = {
      title: '',
      description: '',
      image: '',
      order: courseForm.modules.length + 1,
      isPreview: false,
      topics: []
    };
    setCourseForm({
      ...courseForm,
      modules: [...courseForm.modules, newModule]
    });
  };

  const addTopic = (moduleIndex) => {
    const newTopic = {
      title: '',
      description: '',
      content: '',
      videoUrl: '',
      videoId: '',
      cloudProvider: 'cloudinary',
      duration: 0,
      order: courseForm.modules[moduleIndex].topics.length + 1,
      isPublished: false
    };
    const updatedModules = [...courseForm.modules];
    updatedModules[moduleIndex].topics.push(newTopic);
    setCourseForm({ ...courseForm, modules: updatedModules });
  };

  const updateModule = (moduleIndex, field, value) => {
    const updatedModules = [...courseForm.modules];
    updatedModules[moduleIndex][field] = value;
    setCourseForm({ ...courseForm, modules: updatedModules });
  };

  const updateTopic = (moduleIndex, topicIndex, field, value) => {
    console.log(`Updating topic field: ${field}, value:`, value);
    const updatedModules = [...courseForm.modules];
    updatedModules[moduleIndex].topics[topicIndex][field] = value;
    console.log('Updated topic:', updatedModules[moduleIndex].topics[topicIndex]);
    setCourseForm({ ...courseForm, modules: updatedModules });
  };

  const removeModule = (moduleIndex) => {
    const updatedModules = courseForm.modules.filter((_, index) => index !== moduleIndex);
    setCourseForm({ ...courseForm, modules: updatedModules });
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    const updatedModules = [...courseForm.modules];
    updatedModules[moduleIndex].topics = updatedModules[moduleIndex].topics.filter((_, index) => index !== topicIndex);
    setCourseForm({ ...courseForm, modules: updatedModules });
  };

  const handleSaveCourse = async () => {
    try {
      // Ensure content field is properly set for all topics
      const processedCourseForm = {
        ...courseForm,
        modules: courseForm.modules.map(module => ({
          ...module,
          topics: module.topics.map(topic => ({
            ...topic,
            content: topic.content || '', // Ensure content field exists
            description: topic.description || ''
          }))
        }))
      };
      
      console.log('=== SAVING COURSE DATA ===');
      console.log('Processed courseForm:', JSON.stringify(processedCourseForm, null, 2));
      
      const url = editingCourse 
        ? `http://localhost:5000/api/admin/courses/${editingCourse._id}`
        : 'http://localhost:5000/api/admin/courses';
      
      const response = await fetch(url, {
        method: editingCourse ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedCourseForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast(`Course ${editingCourse ? 'updated' : 'created'} successfully!`, 'success');
        resetForm();
        fetchCourses();
      } else {
        showToast('Error saving course: ' + (data.message || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course');
    }
  };

  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      shortDescription: '',
      price: 0,
      thumbnail: '',
      category: '',
      level: 'beginner',
      tags: [],
      prerequisites: [],
      introduction: { title: '', description: '', videoUrl: '', duration: 0 },
      learnBasics: { title: '', description: '', content: '', keyPoints: [''] },
      modules: []
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const deleteCourse = async (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          showToast('Course deleted successfully!', 'success');
          fetchCourses();
        } else {
          showToast('Error deleting course: ' + (data.message || 'Unknown error'), 'error');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        showToast('Error deleting course', 'error');
      }
    }
  };

  const editCourse = async (course) => {
    try {
      // Fetch complete course data for editing
      const response = await fetch(`http://localhost:5000/api/admin/courses/${course._id}`);
      const data = await response.json();
      
      if (data.success) {
        const fullCourse = data.course;
        console.log('Full course data:', fullCourse);
        console.log('Modules:', fullCourse.modules);
        fullCourse.modules?.forEach((module, mIndex) => {
          console.log(`Module ${mIndex}:`, module);
          module.topics?.forEach((topic, tIndex) => {
            console.log(`Topic ${tIndex} content:`, topic.content);
          });
        });
        setEditingCourse(fullCourse);
        
        const formData = {
          title: fullCourse.title || '',
          description: fullCourse.description || '',
          shortDescription: fullCourse.shortDescription || '',
          price: fullCourse.price || 0,
          thumbnail: fullCourse.thumbnail || '',
          category: fullCourse.category || '',
          level: fullCourse.level || 'beginner',
          tags: fullCourse.tags || [],
          prerequisites: fullCourse.prerequisites || [],
          introduction: {
            title: fullCourse.introduction?.title || '',
            description: fullCourse.introduction?.description || '',
            videoUrl: fullCourse.introduction?.videoUrl || '',
            duration: fullCourse.introduction?.duration || 0
          },
          learnBasics: {
            title: fullCourse.learnBasics?.title || '',
            description: fullCourse.learnBasics?.description || '',
            content: fullCourse.learnBasics?.content || '',
            keyPoints: Array.isArray(fullCourse.learnBasics?.keyPoints) ? fullCourse.learnBasics.keyPoints : ['']
          },
          modules: Array.isArray(fullCourse.modules) ? fullCourse.modules.map(module => ({
            title: module.title || '',
            description: module.description || '',
            image: module.image || '',
            order: module.order || 0,
            isPreview: module.isPreview || false,
            topics: Array.isArray(module.topics) ? module.topics.map((topic, tIndex) => {
              console.log(`Processing topic ${tIndex}:`, topic);
              console.log(`Topic ${tIndex} content from DB:`, topic.content);
              return {
                title: topic.title || '',
                description: topic.description || '',
                content: topic.content || '',
                videoUrl: topic.videoUrl || '',
                videoId: topic.videoId || '',
                cloudProvider: topic.cloudProvider || 'cloudinary',
                duration: topic.duration || 0,
                order: topic.order || 0,
                isPublished: topic.isPublished || false
              };
            }) : []
          })) : []
        };
        
        console.log('Form data being set:', formData);
        console.log('Form modules:', formData.modules);
        formData.modules?.forEach((module, mIndex) => {
          console.log(`Setting Module ${mIndex}:`, module);
          module.topics?.forEach((topic, tIndex) => {
            console.log(`Setting Topic ${tIndex} - Content:`, topic.content);
            console.log(`Setting Topic ${tIndex} - Description:`, topic.description);
          });
        });
        setCourseForm(formData);
        setShowForm(true);
      } else {
        showToast('Error fetching course data', 'error');
      }
    } catch (error) {
      console.error('Error fetching course for edit:', error);
      showToast('Error loading course data', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
            Enhanced Course Management
          </h1>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </button>
        </div>

        {/* Course Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Course Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Course Title"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({...courseForm, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                <textarea
                  placeholder="Course Description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-24"
                />

                {/* Introduction Section */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Introduction</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Introduction Title"
                      value={courseForm.introduction.title}
                      onChange={(e) => setCourseForm({
                        ...courseForm,
                        introduction: {...courseForm.introduction, title: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <textarea
                      placeholder="Introduction Description"
                      value={courseForm.introduction.description}
                      onChange={(e) => setCourseForm({
                        ...courseForm,
                        introduction: {...courseForm.introduction, description: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-20"
                    />
                  </div>
                </div>

                {/* Learn Basics Section */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learn Basics</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Basics Title"
                      value={courseForm.learnBasics.title}
                      onChange={(e) => setCourseForm({
                        ...courseForm,
                        learnBasics: {...courseForm.learnBasics, title: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <textarea
                      placeholder="Basics Content"
                      value={courseForm.learnBasics.content}
                      onChange={(e) => setCourseForm({
                        ...courseForm,
                        learnBasics: {...courseForm.learnBasics, content: e.target.value}
                      })}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-20"
                    />
                  </div>
                </div>

                {/* Modules Section */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Modules</h3>
                    <button
                      onClick={addModule}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Module
                    </button>
                  </div>

                  {courseForm.modules.map((module, moduleIndex) => (
                    <div key={moduleIndex} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">Module {moduleIndex + 1}</h4>
                        <button
                          onClick={() => removeModule(moduleIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="Module Title"
                          value={module.title}
                          onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={module.isPreview}
                            onChange={(e) => updateModule(moduleIndex, 'isPreview', e.target.checked)}
                            className="mr-2"
                          />
                          <label className="text-sm text-gray-700 dark:text-gray-300">Preview Module</label>
                        </div>
                      </div>

                      <textarea
                        placeholder="Module Description"
                        value={module.description}
                        onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white h-16 mb-3"
                      />

                      {/* Topics */}
                      <div className="ml-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-gray-800 dark:text-gray-200">Topics</h5>
                          <button
                            onClick={() => addTopic(moduleIndex)}
                            className="flex items-center px-2 py-1 bg-blue-600 text-white rounded text-sm"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Topic
                          </button>
                        </div>

                        {module.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="border border-gray-200 dark:border-gray-600 rounded p-3 mb-2">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic {topicIndex + 1}</span>
                              <button
                                onClick={() => removeTopic(moduleIndex, topicIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Topic Title"
                                value={topic.title}
                                onChange={(e) => updateTopic(moduleIndex, topicIndex, 'title', e.target.value)}
                                className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
                              />
                              <input
                                type="number"
                                placeholder="Duration (min)"
                                value={topic.duration}
                                onChange={(e) => updateTopic(moduleIndex, topicIndex, 'duration', Number(e.target.value))}
                                className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
                              />
                            </div>

                            <div className="mb-2">
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Short Description</label>
                              <textarea
                                placeholder="Brief topic description..."
                                value={topic.description}
                                onChange={(e) => updateTopic(moduleIndex, topicIndex, 'description', e.target.value)}
                                className="w-full px-2 py-1 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm h-12"
                              />
                            </div>

                            <div className="mb-2">
                              <label className="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">📝 Lesson Content (Markdown)</label>
                              <textarea
                                placeholder="# Lesson Title&#10;&#10;Write your detailed lesson content here using markdown syntax.&#10;&#10;## Code Example&#10;```javascript&#10;console.log('Hello World');&#10;```&#10;&#10;- Point 1&#10;- Point 2"
                                value={topic.content || ''}
                                onChange={(e) => {
                                  console.log(`Updating content for module ${moduleIndex}, topic ${topicIndex}:`, e.target.value);
                                  updateTopic(moduleIndex, topicIndex, 'content', e.target.value);
                                }}
                                className="w-full px-2 py-1 border-2 border-blue-300 dark:border-blue-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono h-32"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleVideoUpload(e.target.files[0], moduleIndex, topicIndex);
                                  }
                                }}
                                className="hidden"
                                id={`video-${moduleIndex}-${topicIndex}`}
                              />
                              <label
                                htmlFor={`video-${moduleIndex}-${topicIndex}`}
                                className="flex items-center px-2 py-1 bg-purple-600 text-white rounded text-sm cursor-pointer hover:bg-purple-700"
                              >
                                <Upload className="w-3 h-3 mr-1" />
                                Upload Video
                              </label>
                              {topic.videoUrl && (
                                <span className="text-xs text-green-600">✓ Video uploaded</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCourse}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Courses</h3>
          </div>
          
          {courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Modules</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{course.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{course.instructor}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {course.modulesCount || course.modules?.length || 0} modules
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">${course.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => editCourse(course)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCourse(course._id, course.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses found</p>
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              <span>{toast.message}</span>
              <button 
                onClick={() => setToast({ show: false, message: '', type: 'success' })}
                className="ml-2 text-white hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCourseManagement;
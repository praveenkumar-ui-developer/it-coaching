import { useState } from 'react';
import { useTheme } from '../../components/ThemeProvider';
import { Plus, Upload, X, Save } from 'lucide-react';

const CreateCourse = () => {
  const { getThemeStyles } = useTheme();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: 'beginner',
    introduction: {
      title: '',
      description: '',
      videoFile: null,
      videoUrl: ''
    },
    learnBasics: {
      title: '',
      description: '',
      videoFile: null,
      videoUrl: ''
    },
    modules: [
      {
        title: '',
        description: '',
        topics: [
          {
            title: '',
            description: '',
            content: '',
            videoFile: null,
            videoUrl: ''
          }
        ]
      }
    ]
  });

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (section, field, value) => {
    setCourseData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleModuleChange = (moduleIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex ? { ...module, [field]: value } : module
      )
    }));
  };

  const handleTopicChange = (moduleIndex, topicIndex, field, value) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((module, mIndex) =>
        mIndex === moduleIndex
          ? {
              ...module,
              topics: module.topics.map((topic, tIndex) =>
                tIndex === topicIndex ? { ...topic, [field]: value } : topic
              )
            }
          : module
      )
    }));
  };

  const handleVideoUpload = async (section, moduleIndex = null, topicIndex = null, file) => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('courseId', 'temp-' + Date.now());
    
    if (moduleIndex !== null) {
      formData.append('moduleIndex', moduleIndex);
      if (topicIndex !== null) {
        formData.append('topicIndex', topicIndex);
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/upload-video', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (section === 'introduction' || section === 'learnBasics') {
          handleSectionChange(section, 'videoUrl', result.videoUrl);
        } else if (moduleIndex !== null && topicIndex !== null) {
          handleTopicChange(moduleIndex, topicIndex, 'videoUrl', result.videoUrl);
        }
        showToast('Video uploaded successfully!', 'success');
      } else {
        showToast('Video upload failed: ' + result.message, 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Video upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, {
        title: '',
        description: '',
        topics: [{ title: '', description: '', content: '', videoFile: null, videoUrl: '' }]
      }]
    }));
  };

  const addTopic = (moduleIndex) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex
          ? {
              ...module,
              topics: [...module.topics, { title: '', description: '', content: '', videoFile: null, videoUrl: '' }]
            }
          : module
      )
    }));
  };

  const removeTopic = (moduleIndex, topicIndex) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map((module, mIndex) =>
        mIndex === moduleIndex
          ? {
              ...module,
              topics: module.topics.filter((_, tIndex) => tIndex !== topicIndex)
            }
          : module
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });

      const result = await response.json();
      
      if (result.success) {
        showToast('Course created successfully!', 'success');
        // Reset form or redirect
      } else {
        showToast('Failed to create course: ' + result.message, 'error');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      showToast('Failed to create course', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
          Create New Course
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Course Info */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h2 className="text-xl font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Course Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Course Title"
                value={courseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="p-3 border rounded-lg"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
                required
              />
              
              <select
                value={courseData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="p-3 border rounded-lg"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
                required
              >
                <option value="">Select Category</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="data-science">Data Science</option>
                <option value="ai-ml">AI & Machine Learning</option>
              </select>
              
              <input
                type="number"
                placeholder="Price ($)"
                value={courseData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="p-3 border rounded-lg"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
                required
              />
              
              <select
                value={courseData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="p-3 border rounded-lg"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <textarea
              placeholder="Course Description"
              value={courseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full mt-4 p-3 border rounded-lg"
              style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
              required
            />
          </div>

          {/* Introduction Section */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h2 className="text-xl font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Introduction
            </h2>
            
            <input
              type="text"
              placeholder="Introduction Title"
              value={courseData.introduction.title}
              onChange={(e) => handleSectionChange('introduction', 'title', e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
            />
            
            <textarea
              placeholder="Introduction Description"
              value={courseData.introduction.description}
              onChange={(e) => handleSectionChange('introduction', 'description', e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-lg mb-4"
              style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
            />
            
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload('introduction', null, null, e.target.files[0])}
                className="hidden"
                id="intro-video"
              />
              <label
                htmlFor="intro-video"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </label>
              {courseData.introduction.videoUrl && (
                <span className="text-green-600">✓ Video uploaded</span>
              )}
            </div>
          </div>

          {/* Learn Basics Section */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h2 className="text-xl font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Learn Basics
            </h2>
            
            <input
              type="text"
              placeholder="Learn Basics Title"
              value={courseData.learnBasics.title}
              onChange={(e) => handleSectionChange('learnBasics', 'title', e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
            />
            
            <textarea
              placeholder="Learn Basics Description"
              value={courseData.learnBasics.description}
              onChange={(e) => handleSectionChange('learnBasics', 'description', e.target.value)}
              rows={3}
              className="w-full p-3 border rounded-lg mb-4"
              style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
            />
            
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload('learnBasics', null, null, e.target.files[0])}
                className="hidden"
                id="basics-video"
              />
              <label
                htmlFor="basics-video"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </label>
              {courseData.learnBasics.videoUrl && (
                <span className="text-green-600">✓ Video uploaded</span>
              )}
            </div>
          </div>

          {/* Modules Section */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                Course Modules
              </h2>
              <button
                type="button"
                onClick={addModule}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </button>
            </div>

            {courseData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="mb-6 p-4 border rounded-lg" style={getThemeStyles({ borderColor: '#e2e8f0' }, { borderColor: '#4b5563' })}>
                <h3 className="font-semibold mb-3" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                  Module {moduleIndex + 1}
                </h3>
                
                <input
                  type="text"
                  placeholder="Module Title"
                  value={module.title}
                  onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                  className="w-full p-3 border rounded-lg mb-3"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
                />
                
                <textarea
                  placeholder="Module Description"
                  value={module.description}
                  onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                  rows={2}
                  className="w-full p-3 border rounded-lg mb-4"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
                />

                {/* Topics */}
                <div className="ml-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                      Topics
                    </h4>
                    <button
                      type="button"
                      onClick={() => addTopic(moduleIndex)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Topic
                    </button>
                  </div>

                  {module.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="mb-4 p-3 border rounded" style={getThemeStyles({ borderColor: '#e2e8f0' }, { borderColor: '#6b7280' })}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                          Topic {topicIndex + 1}
                        </span>
                        {module.topics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTopic(moduleIndex, topicIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Topic Title"
                        value={topic.title}
                        onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'title', e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
                      />
                      
                      <textarea
                        placeholder="Topic Description"
                        value={topic.description}
                        onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'description', e.target.value)}
                        rows={2}
                        className="w-full p-2 border rounded mb-3"
                        style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
                      />
                      
                      <textarea
                        placeholder="Lesson Content (Markdown supported)&#10;Example:&#10;# Introduction&#10;This is a paragraph.&#10;&#10;```javascript&#10;console.log('Hello World');&#10;```"
                        value={topic.content || ''}
                        onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'content', e.target.value)}
                        rows={6}
                        className="w-full p-2 border rounded mb-3 font-mono text-sm"
                        style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#374151', borderColor: '#4b5563', color: '#f1f5f9' })}
                      />
                      
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload('topic', moduleIndex, topicIndex, e.target.files[0])}
                          className="hidden"
                          id={`topic-video-${moduleIndex}-${topicIndex}`}
                        />
                        <label
                          htmlFor={`topic-video-${moduleIndex}-${topicIndex}`}
                          className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer text-sm"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Upload Video
                        </label>
                        {topic.videoUrl && (
                          <span className="text-green-600 text-sm">✓ Video uploaded</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>

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

export default CreateCourse;
import { useState } from 'react';
import { Plus, Trash2, GripVertical, Save, Eye } from 'lucide-react';
import { useTheme } from '../../../components/ThemeProvider';

const CourseEditor = ({ course, onSave, onCancel }) => {
  const { getThemeStyles } = useTheme();
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    shortDescription: course?.shortDescription || '',
    category: course?.category || '',
    price: course?.price || 0,
    thumbnail: course?.thumbnail || '',
    status: course?.status || 'draft',
    tags: course?.tags || [],
    prerequisites: course?.prerequisites || [],
    seoTitle: course?.seoTitle || '',
    seoDescription: course?.seoDescription || '',
    lessons: course?.lessons || []
  });

  const [newTag, setNewTag] = useState('');
  const [newPrereq, setNewPrereq] = useState('');

  const addLesson = () => {
    setFormData({
      ...formData,
      lessons: [...formData.lessons, {
        id: Date.now(),
        title: '',
        description: '',
        type: 'video',
        content: '',
        duration: 0,
        order: formData.lessons.length
      }]
    });
  };

  const updateLesson = (index, field, value) => {
    const updatedLessons = [...formData.lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const removeLesson = (index) => {
    const updatedLessons = formData.lessons.filter((_, i) => i !== index);
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
          {course ? 'Edit Course' : 'Create Course'}
        </h2>
        <div className="flex space-x-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={() => onSave(formData)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2 inline" />
            Save Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h3 className="text-lg font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Basic Information
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
              <textarea
                placeholder="Short Description"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={2}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
              <textarea
                placeholder="Full Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="DevOps">DevOps</option>
                </select>
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
                />
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                Lessons
              </h3>
              <button onClick={addLesson} className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-1" />
                Add Lesson
              </button>
            </div>
            <div className="space-y-4">
              {formData.lessons.map((lesson, index) => (
                <div key={lesson.id} className="p-4 border rounded-lg" style={getThemeStyles({ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">Lesson {index + 1}</span>
                    </div>
                    <button onClick={() => removeLesson(index)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) => updateLesson(index, 'title', e.target.value)}
                      className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                      style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#475569', borderColor: '#64748b' })}
                    />
                    <select
                      value={lesson.type}
                      onChange={(e) => updateLesson(index, 'type', e.target.value)}
                      className="p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                      style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#475569', borderColor: '#64748b' })}
                    >
                      <option value="video">Video</option>
                      <option value="text">Text</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Lesson Description"
                    value={lesson.description}
                    onChange={(e) => updateLesson(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full mt-3 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                    style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#475569', borderColor: '#64748b' })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h3 className="text-lg font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Status & Visibility
            </h3>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Tags */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h3 className="text-lg font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Tags
            </h3>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
              <button onClick={addTag} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 text-indigo-600 hover:text-indigo-800">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h3 className="text-lg font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              SEO Settings
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="SEO Title"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
              <textarea
                placeholder="SEO Description"
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                rows={3}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditor;
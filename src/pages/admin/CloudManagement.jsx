import { useState, useEffect } from 'react';
import { Cloud, HardDrive, Video, Edit, Trash2, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';

const CloudManagement = () => {
  const { getThemeStyles } = useTheme();
  const [cloudData, setCloudData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [editingVideo, setEditingVideo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchCloudData();
  }, []);

  const fetchCloudData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/cloud-storage');
      const data = await response.json();
      setCloudData(data);
    } catch (error) {
      console.error('Error fetching cloud data:', error);
      // Fallback data if API fails
      setCloudData({
        platforms: [
          {
            name: 'Cloudinary',
            type: 'cloudinary',
            totalStorage: 100,
            usedStorage: 65,
            status: 'connected',
            videos: [
              { id: '1', title: 'Course Introduction', course: 'Full Stack JavaScript Development', size: 25, uploadDate: '2024-01-15', url: 'https://res.cloudinary.com/demo/video/sample1.mp4', description: 'Introduction to the course' },
              { id: '2', title: 'React Basics', course: 'React Fundamentals', size: 40, uploadDate: '2024-01-10', url: 'https://res.cloudinary.com/demo/video/sample2.mp4', description: 'Basic React concepts' }
            ]
          },
          {
            name: 'Firebase Storage',
            type: 'firebase',
            totalStorage: 50,
            usedStorage: 30,
            status: 'connected',
            videos: [
              { id: '3', title: 'Python Fundamentals', course: 'Python for Data Science', size: 30, uploadDate: '2024-01-12', url: 'https://firebase.googleapis.com/demo/video3.mp4', description: 'Python basics for data science' }
            ]
          },
          {
            name: 'AWS S3',
            type: 'aws',
            totalStorage: 200,
            usedStorage: 0,
            status: 'disconnected',
            videos: []
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId, platform) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await fetch(`http://localhost:5000/api/admin/cloud-storage/${platform}/videos/${videoId}`, {
        method: 'DELETE'
      });
      fetchCloudData();
      alert('Video deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video');
    }
  };

  const handleEditVideo = (video, platform) => {
    setEditingVideo({ ...video, platform });
    setEditForm({ title: video.title, description: video.description || '' });
    setShowEditModal(true);
  };

  const handleUpdateVideo = async () => {
    if (!editForm.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/cloud-storage/${editingVideo.platform}/videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await response.json();

      if (data.success) {
        alert('Video updated successfully!');
        setShowEditModal(false);
        setEditingVideo(null);
        fetchCloudData();
      } else {
        alert(data.message || 'Failed to update video');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Error updating video');
    }
  };

  const resetEditForm = () => {
    setEditForm({ title: '', description: '' });
    setEditingVideo(null);
    setShowEditModal(false);
  };

  const getStoragePercentage = (used, total) => (used / total) * 100;
  
  const getStorageColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filteredPlatforms = selectedPlatform === 'all' 
    ? cloudData?.platforms || []
    : cloudData?.platforms?.filter(p => p.type === selectedPlatform) || [];

  return (
    <div className="min-h-screen py-8" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Cloud Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Monitor and manage your cloud storage platforms
            </p>
          </div>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={getThemeStyles(
              { backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' },
              { backgroundColor: '#1e293b', borderColor: '#374151', color: '#f1f5f9' }
            )}
          >
            <option value="all">All Platforms</option>
            <option value="cloudinary">Cloudinary</option>
            <option value="firebase">Firebase</option>
            <option value="aws">AWS S3</option>
          </select>
        </div>

        {/* Cloud Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {filteredPlatforms.map((platform) => {
            const percentage = getStoragePercentage(platform.usedStorage, platform.totalStorage);
            const colorClass = getStorageColor(percentage);
            
            return (
              <div key={platform.type} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Cloud className="w-8 h-8 text-indigo-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{platform.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        platform.status === 'connected' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {platform.status === 'connected' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                        {platform.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Storage Used</span>
                    <span>{platform.usedStorage}GB / {platform.totalStorage}GB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className={`${colorClass} h-2 rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {percentage.toFixed(1)}% used
                  </div>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Videos:</span>
                    <span>{platform.videos.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Videos by Platform */}
        {filteredPlatforms.map((platform) => (
          <div key={platform.type} className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Video className="w-5 h-5 mr-2 text-indigo-600" />
                  {platform.name} Videos ({platform.videos.length})
                </h3>
              </div>
              
              {platform.videos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Video</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Upload Date</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {platform.videos.map((video) => (
                        <tr key={video.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">{video.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{video.url}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{video.course}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{video.size}MB</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{new Date(video.uploadDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleEditVideo(video, platform.type)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit video"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteVideo(video.id, platform.type)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Delete video"
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
                  <p>No videos found for {platform.name}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Storage Alerts */}
        {cloudData?.platforms?.some(p => getStoragePercentage(p.usedStorage, p.totalStorage) >= 90) && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Storage Limit Warning</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  ⚠️ Cloud storage limit reached. Please delete old videos or upgrade your plan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Video Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Edit Video
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter video title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                      placeholder="Enter video description"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdateVideo}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Update Video
                    </button>
                    <button
                      onClick={resetEditForm}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudManagement;
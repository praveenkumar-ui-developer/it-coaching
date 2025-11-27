import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import api from '../../utils/api';

const AddUser = () => {
  const navigate = useNavigate();
  const { getThemeStyles } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/admin/users', formData);
      alert('User added successfully!');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen py-8"
      style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#0f172a' })}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}
          >
            Add New User
          </h1>
          <p style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
            Create a new user account for the platform
          </p>
        </div>

        <div 
          className="p-8 rounded-lg shadow-lg border"
          style={getThemeStyles(
            { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
            { backgroundColor: '#1e293b', borderColor: '#374151' }
          )}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles(
                    { backgroundColor: '#ffffff', borderColor: '#d1d5db' },
                    { backgroundColor: '#334155', borderColor: '#475569' }
                  )}
                  placeholder="Enter full name"
                />
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles(
                    { backgroundColor: '#ffffff', borderColor: '#d1d5db' },
                    { backgroundColor: '#334155', borderColor: '#475569' }
                  )}
                  placeholder="Enter email address"
                />
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles(
                    { backgroundColor: '#ffffff', borderColor: '#d1d5db' },
                    { backgroundColor: '#334155', borderColor: '#475569' }
                  )}
                  placeholder="Enter password"
                />
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={getThemeStyles({ color: '#374151' }, { color: '#cbd5e1' })}
              >
                Role
              </label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles(
                    { backgroundColor: '#ffffff', borderColor: '#d1d5db' },
                    { backgroundColor: '#334155', borderColor: '#475569' }
                  )}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                <UserCheck className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="flex-1 py-3 px-4 border rounded-lg hover:bg-gray-50 transition-colors"
                style={getThemeStyles(
                  { borderColor: '#d1d5db', color: '#374151' },
                  { borderColor: '#475569', color: '#cbd5e1' }
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Adding User...' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
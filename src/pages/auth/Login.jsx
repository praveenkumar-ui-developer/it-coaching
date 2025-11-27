import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';
import SEO from '../../components/common/SEO';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(formData);
      
      if (data.success) {
        const { user, token } = data;
        login(user, token);
        
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'instructor') navigate('/instructor');
        else navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <SEO 
        title="Login - IT Coaching Center | Access Your Programming Courses"
        description="Sign in to your IT Coaching Center account to access your programming courses, track progress, and continue learning web development, Python, React and more."
        keywords="login, sign in, programming courses, IT training, online learning platform"
        url="/login"
      />
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-slate-100">Sign in to your account</h2>
        </div>
        
        {!showForm ? (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="w-full mb-4 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login with Credentials
              </button>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Valid emails: admin@example.com, instructor@example.com, student@example.com</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Or <a href="/signup" className="text-indigo-600 hover:text-indigo-700">create new account</a></p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Or select a demo dashboard:</p>
            </div>
            <div className="space-y-4">

            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-100 text-blue-600"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-blue-100 text-blue-600"
                placeholder="Password"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 px-4 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : 'Sign in'}
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </>
  );
};

export default Login;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Courses from './pages/Courses';
import CourseDetail from './pages/course/CourseDetail';
import CourseDetails from './pages/course/CourseDetails';
import PaymentGateway from './pages/course/PaymentGateway';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import AdminPanel from './pages/admin/AdminPanel';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManagement from './pages/admin/CourseManagement';
import UserManagement from './pages/admin/UserManagement';
import AddUser from './pages/admin/AddUser';
import FinancialManagement from './pages/admin/FinancialManagement';
import CloudManagement from './pages/admin/CloudManagement';
import CreateCourse from './pages/admin/CreateCourse';
import EnhancedCourseManagement from './pages/admin/EnhancedCourseManagement';
import CourseDetailView from './pages/course/CourseDetailView';
import CourseLearning from './pages/course/CourseLearning';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuthStore from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-x-hidden">
            <Header />
            <div className="flex relative">
              <Sidebar 
                isCollapsed={sidebarCollapsed} 
                setIsCollapsed={setSidebarCollapsed} 
              />
              <main className={`flex-1 min-w-0 transition-all duration-300 pt-16 ${
                isAuthenticated 
                  ? sidebarCollapsed 
                    ? 'lg:ml-16' 
                    : 'lg:ml-64'
                  : ''
              }`}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/courses" element={<Courses />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/course/:courseId" element={
                    <ProtectedRoute>
                      <CourseDetail />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/course/:id/view" element={
                    <ProtectedRoute>
                      <CourseDetailView />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/course/:courseId/learn" element={
                    <ProtectedRoute>
                      <CourseLearning />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/course/:courseId/details" element={
                    <ProtectedRoute>
                      <CourseDetails />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/course/:courseId/payment" element={
                    <ProtectedRoute>
                      <PaymentGateway />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/courses" element={
                    <ProtectedRoute requiredRole="admin">
                      <EnhancedCourseManagement />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/create-course" element={
                    <ProtectedRoute requiredRole="admin">
                      <CreateCourse />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/cloud" element={
                    <ProtectedRoute requiredRole="admin">
                      <CloudManagement />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/users" element={
                    <ProtectedRoute requiredRole="admin">
                      <UserManagement />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/users/add" element={
                    <ProtectedRoute requiredRole="admin">
                      <AddUser />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/financial" element={
                    <ProtectedRoute requiredRole="admin">
                      <FinancialManagement />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/instructor" element={
                    <ProtectedRoute requiredRole="instructor">
                      <InstructorDashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/my-learning" element={
                    <ProtectedRoute>
                      <Learning />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/achievements" element={
                    <ProtectedRoute>
                      <div className="p-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Achievements</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Your certificates and badges</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/progress" element={
                    <ProtectedRoute>
                      <div className="p-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Progress</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Detailed learning analytics</p>
                      </div>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <div className="p-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">Account and preferences</p>
                      </div>
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </div>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
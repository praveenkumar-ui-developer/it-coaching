import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, BookOpen, AlertTriangle, CheckCircle, Clock, CreditCard, UserCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../../../utils/api';

const SystemOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/analytics');
      const result = await response.json();
      console.log('Analytics data received:', result);
      setAnalytics(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to empty data structure
      setAnalytics({
        totalRevenue: 0,
        activeStudents: 0,
        totalInstructors: 0,
        totalCourses: 0,
        pendingPayments: 0,
        totalDues: 0,
        courseEnrollments: [],
        instructorDetails: [],
        studentPayments: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: `$${analytics?.totalRevenue?.toLocaleString() || '0'}`, change: '+12.5%', trend: 'up', color: 'bg-gradient-to-r from-green-500 to-emerald-600' },
    { icon: Users, label: 'Active Students', value: analytics?.activeStudents?.toLocaleString() || '0', change: '+15.3%', trend: 'up', color: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
    { icon: UserCheck, label: 'Total Instructors', value: analytics?.totalInstructors || '0', change: '+2 new', trend: 'up', color: 'bg-gradient-to-r from-purple-500 to-violet-600' },
    { icon: BookOpen, label: 'Total Courses', value: analytics?.totalCourses || '0', change: '+5 new', trend: 'up', color: 'bg-gradient-to-r from-orange-500 to-red-600' },
    { icon: CreditCard, label: 'Pending Payments', value: analytics?.pendingPayments || '0', change: '-3 resolved', trend: 'down', color: 'bg-gradient-to-r from-red-500 to-pink-600' },
    { icon: TrendingUp, label: 'Total Dues', value: `$${analytics?.totalDues?.toLocaleString() || '0'}`, change: '-$2.1k', trend: 'down', color: 'bg-gradient-to-r from-yellow-500 to-amber-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={index} className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    <TrendIcon className="w-3 h-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    from last month
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 dark:to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          );
        })}
      </div>

      {/* Course Enrollments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
            Course Enrollments & Schedule
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Course</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Instructor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Students</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {analytics?.courseEnrollments?.length > 0 ? analytics.courseEnrollments.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{course.courseName}</td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{course.instructor}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {course.enrolledStudents} students
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-green-600 dark:text-green-400">${course.revenue.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">{course.schedule}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                    No course enrollments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructor Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-purple-600" />
            Instructor Details & Salaries
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Instructor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Students</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Monthly Salary</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Pending</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {analytics?.instructorDetails?.length > 0 ? analytics.instructorDetails.map((instructor, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{instructor.name}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {instructor.totalStudents} students
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-green-600 dark:text-green-400">${instructor.monthlySalary.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      instructor.pendingSalary > 0 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    }`}>
                      ${instructor.pendingSalary}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">⭐</span>
                      <span className="font-medium text-gray-900 dark:text-white">{instructor.performance}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                    No instructor data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Payments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-600">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-600" />
            Student Payments & Dues
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Student</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Course</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Paid</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Due</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {analytics?.studentPayments?.length > 0 ? analytics.studentPayments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{payment.name}</td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{payment.course}</td>
                  <td className="py-4 px-6 font-semibold text-green-600 dark:text-green-400">${payment.amountPaid}</td>
                  <td className="py-4 px-6 font-semibold text-red-600 dark:text-red-400">${payment.dueAmount}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      payment.status === 'partial' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center text-gray-500 dark:text-gray-400">
                    No student payment data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
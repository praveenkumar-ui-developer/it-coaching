import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Gift, Download, Filter, Search } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import api from '../../utils/api';

const FinancialManagement = () => {
  const { getThemeStyles } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const [transactionsRes, couponsRes] = await Promise.all([
        api.get('/admin/transactions'),
        api.get('/admin/coupons')
      ]);
      setTransactions(transactionsRes.transactions || []);
      setCoupons(couponsRes.coupons || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setTransactions([]);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateCoupon = async (couponData) => {
    try {
      await api.post('/admin/coupons', couponData);
      fetchFinancialData();
    } catch (error) {
      console.error('Error creating coupon:', error);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
            Financial Management
          </h1>
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, label: 'Total Revenue', value: '$125,750', color: '#059669' },
            { icon: CreditCard, label: 'This Month', value: '$15,420', color: '#2563eb' },
            { icon: TrendingUp, label: 'Growth', value: '+12.5%', color: '#ea580c' },
            { icon: Gift, label: 'Active Coupons', value: coupons.filter(c => c.isActive).length, color: '#7c3aed' }
          ].map((stat, index) => (
            <div key={index} className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
              <div className="flex items-center">
                <stat.icon className="w-8 h-8 mr-3" style={{ color: stat.color }} />
                <div>
                  <p className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>{stat.label}</p>
                  <p className="text-2xl font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {['transactions', 'coupons', 'payouts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'transactions' && (
          <div className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Transaction History</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }, { backgroundColor: '#334155', borderColor: '#475569', color: '#f1f5f9' })}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }, { backgroundColor: '#334155', borderColor: '#475569', color: '#f1f5f9' })}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={getThemeStyles({ borderColor: '#e2e8f0' }, { borderColor: '#374151' })}>
                    <th className="text-left py-3" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>User</th>
                    <th className="text-left py-3" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Course</th>
                    <th className="text-left py-3" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Amount</th>
                    <th className="text-left py-3" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Status</th>
                    <th className="text-left py-3" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b" style={getThemeStyles({ borderColor: '#f1f5f9' }, { borderColor: '#334155' })}>
                      <td className="py-3" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{transaction.user}</td>
                      <td className="py-3" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{transaction.course}</td>
                      <td className="py-3 font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>${transaction.amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Coupon Management</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Create Coupon
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{coupon.code}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                      Type: {coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`}
                    </p>
                    <p style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                      Usage: {coupon.usedCount}/{coupon.usageLimit}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="p-6 rounded-lg shadow-sm border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <h2 className="text-xl font-semibold mb-6" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>Instructor Payouts</h2>
            <div className="space-y-4">
              {[
                { instructor: 'John Smith', amount: 2500, status: 'pending', courses: 3 },
                { instructor: 'Sarah Johnson', amount: 1800, status: 'completed', courses: 2 },
                { instructor: 'Mike Chen', amount: 3200, status: 'pending', courses: 4 }
              ].map((payout, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#334155' })}>
                  <div>
                    <h3 className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{payout.instructor}</h3>
                    <p className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>{payout.courses} courses</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>${payout.amount}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payout.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payout.status}
                    </span>
                  </div>
                  {payout.status === 'pending' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialManagement;
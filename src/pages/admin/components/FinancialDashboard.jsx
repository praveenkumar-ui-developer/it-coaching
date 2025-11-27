import { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Gift, Download, Calendar } from 'lucide-react';
import { useTheme } from '../../../components/ThemeProvider';

const FinancialDashboard = ({ transactions, coupons, onCreateCoupon, onApprovePayout }) => {
  const { getThemeStyles } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30');
  const [showCouponModal, setShowCouponModal] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    usageLimit: 1,
    expiryDate: '',
    minAmount: 0
  });

  const totalRevenue = transactions?.reduce((sum, t) => t.status === 'completed' ? sum + t.amount : sum, 0) || 0;
  const pendingPayouts = [
    { instructor: 'John Smith', amount: 2500, courses: 3, period: 'March 2024' },
    { instructor: 'Sarah Johnson', amount: 1800, courses: 2, period: 'March 2024' },
    { instructor: 'Mike Chen', amount: 3200, courses: 4, period: 'March 2024' }
  ];

  const handleCreateCoupon = () => {
    onCreateCoupon(newCoupon);
    setNewCoupon({ code: '', type: 'percentage', value: 0, usageLimit: 1, expiryDate: '', minAmount: 0 });
    setShowCouponModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: DollarSign, label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', color: 'text-green-600' },
          { icon: CreditCard, label: 'This Month', value: '$15,420', change: '+8.2%', color: 'text-blue-600' },
          { icon: TrendingUp, label: 'Growth Rate', value: '+18.3%', change: '+2.1%', color: 'text-purple-600' },
          { icon: Gift, label: 'Active Coupons', value: coupons?.filter(c => c.isActive).length || 0, change: '3 new', color: 'text-orange-600' }
        ].map((stat, index) => (
          <div key={index} className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 ${stat.color}`}>
                  {stat.change} from last month
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {['overview', 'transactions', 'coupons', 'payouts'].map((tab) => (
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

      {/* Tab Content */}
      {activeTab === 'transactions' && (
        <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Transaction History
            </h3>
            <div className="flex space-x-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
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
                {transactions?.map((transaction) => (
                  <tr key={transaction._id} className="border-b" style={getThemeStyles({ borderColor: '#f1f5f9' }, { borderColor: '#334155' })}>
                    <td className="py-3" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{transaction.user}</td>
                    <td className="py-3" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{transaction.course}</td>
                    <td className="py-3 font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>${transaction.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Coupon Management
            </h3>
            <button 
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Coupon
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons?.map((coupon) => (
              <div key={coupon._id} className="p-4 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{coupon.code}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                    Discount: {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
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
        <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <h3 className="text-lg font-semibold mb-6" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
            Instructor Payouts
          </h3>
          <div className="space-y-4">
            {pendingPayouts.map((payout, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={getThemeStyles({ backgroundColor: '#f8fafc' }, { backgroundColor: '#334155' })}>
                <div className="flex-1">
                  <h4 className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>{payout.instructor}</h4>
                  <p className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                    {payout.courses} courses • {payout.period}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-lg" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>${payout.amount}</p>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </div>
                <button 
                  onClick={() => onApprovePayout(payout)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
              Create New Coupon
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Coupon Code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                <input
                  type="number"
                  placeholder="Value"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) })}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
                />
              </div>
              <input
                type="number"
                placeholder="Usage Limit"
                value={newCoupon.usageLimit}
                onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
              <input
                type="date"
                value={newCoupon.expiryDate}
                onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                onClick={() => setShowCouponModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateCoupon}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialDashboard;
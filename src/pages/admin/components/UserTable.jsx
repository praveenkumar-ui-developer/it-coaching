import { useState } from 'react';
import { Search, Filter, Edit, Trash2, UserPlus, Shield, User, UserCheck, Eye } from 'lucide-react';
import { useTheme } from '../../../components/ThemeProvider';

const UserTable = ({ users, onUpdateUser, onDeleteUser, onImpersonate }) => {
  const { getThemeStyles } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Shield;
      case 'instructor': return UserCheck;
      default: return User;
    }
  };

  const handleStatusToggle = (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    onUpdateUser(user._id, { status: newStatus });
  };

  const handleRoleChange = (user, newRole) => {
    onUpdateUser(user._id, { role: newRole });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <div className="p-6 rounded-lg border" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={getThemeStyles({ borderColor: '#e2e8f0' }, { borderColor: '#374151' })}>
                <th className="text-left py-3 px-4" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>User</th>
                <th className="text-left py-3 px-4" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Role</th>
                <th className="text-left py-3 px-4" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Status</th>
                <th className="text-left py-3 px-4" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Join Date</th>
                <th className="text-left py-3 px-4" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <tr key={user._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800" style={getThemeStyles({ borderColor: '#f1f5f9' }, { borderColor: '#334155' })}>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                            {user.name}
                          </h3>
                          <p className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-indigo-500"
                        style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#334155', borderColor: '#475569' })}
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="py-4 px-4" style={getThemeStyles({ color: '#0f172a' }, { color: '#f1f5f9' })}>
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onImpersonate(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Impersonate User"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-blue-600' },
          { label: 'Active Users', value: users.filter(u => u.status === 'active').length, color: 'text-green-600' },
          { label: 'Instructors', value: users.filter(u => u.role === 'instructor').length, color: 'text-purple-600' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'text-orange-600' }
        ].map((stat, index) => (
          <div key={index} className="p-4 rounded-lg border text-center" style={getThemeStyles({ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }, { backgroundColor: '#1e293b', borderColor: '#374151' })}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm" style={getThemeStyles({ color: '#64748b' }, { color: '#94a3b8' })}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
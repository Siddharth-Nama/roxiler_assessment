import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Store, Star, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        fetchData();
    }, [search, roleFilter]);

    const fetchData = async () => {
        try {
            const statsRes = await api.get('admin/dashboard-stats/');
            setStats(statsRes.data);

            const usersRes = await api.get('admin/users/', {
                params: { search: search, role: roleFilter }
            });
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-8 animate-fade">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'from-blue-500 to-cyan-400' },
                    { label: 'Total Stores', value: stats.total_stores, icon: Store, color: 'from-purple-500 to-pink-400' },
                    { label: 'Total Ratings', value: stats.total_ratings, icon: Star, color: 'from-orange-500 to-yellow-400' }
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                        className="glass p-6 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-text-muted text-sm">{stat.label}</p>
                            <h2 className="text-4xl font-bold mt-1">{stat.value}</h2>
                        </div>
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-black/20`}>
                            <stat.icon size={32} className="text-white" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Users Table */}
            <div className="glass p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold">User Management</h3>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input 
                                className="w-full pl-10 pr-4 py-2 text-sm" 
                                placeholder="Search by Name, Email, Address..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select 
                            className="text-sm py-2 px-4"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="User">Normal User</option>
                            <option value="StoreOwner">Store Owner</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-text-muted text-sm uppercase">
                            <tr>
                                <th className="px-4 py-3 border-b border-glass-border">Name</th>
                                <th className="px-4 py-3 border-b border-glass-border">Email</th>
                                <th className="px-4 py-3 border-b border-glass-border">Address</th>
                                <th className="px-4 py-3 border-b border-glass-border">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4">{u.name}</td>
                                    <td className="px-4 py-4">{u.email}</td>
                                    <td className="px-4 py-4 text-sm truncate max-w-[200px]">{u.address}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                            u.role === 'Admin' ? 'bg-blue-500/20 text-blue-400' :
                                            u.role === 'StoreOwner' ? 'bg-purple-500/20 text-purple-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && !loading && (
                        <p className="text-center py-10 text-text-muted">No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

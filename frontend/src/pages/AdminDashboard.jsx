import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Users, Store, Star, Search, Filter, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total_users: 0, total_stores: 0, total_ratings: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ 
        username: '', email: '', password: '', name: '', address: '', role: 'User' 
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('admin/users/', formData);
            setShowModal(false);
            setFormData({ username: '', email: '', password: '', name: '', address: '', role: 'User' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
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

            <div className="glass p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl font-bold">User Management</h3>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="btn-primary py-1 px-3 text-xs flex items-center gap-1"
                        >
                            <Plus size={14} /> Add User
                        </button>
                    </div>
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
                                <tr 
                                    key={u.id} 
                                    className="hover:bg-white/5 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/admin/users/${u.id}`)}
                                >
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

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass p-8 w-full max-w-md relative"
                        >
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-text-muted hover:text-white"
                            >
                                <X size={24} />
                            </button>
                            <h2 className="text-2xl font-bold mb-6">Add New User</h2>
                            <form onSubmit={handleAddUser} className="flex flex-col gap-4">
                                <input 
                                    placeholder="Username" 
                                    required 
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    required 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    required 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                                <input 
                                    placeholder="Full Name (Min 20 chars)" 
                                    required 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                                <textarea 
                                    placeholder="Address" 
                                    required 
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                                <select 
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="User">Normal User</option>
                                    <option value="Admin">Admin</option>
                                    <option value="StoreOwner">Store Owner</option>
                                </select>
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                <button type="submit" className="btn-primary mt-4">Create User</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

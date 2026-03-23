import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User as UserIcon, Store, Star, Search, Plus, X, Shield, Activity, Globe } from 'lucide-react';
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

    if (loading && users.length === 0) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-layout py-24 sm:py-32 animate-fade">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 mb-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
                    <Shield className="text-red-500/40 animate-pulse" size={16} />
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
                </div>
                <h1 className="text-6xl sm:text-7xl font-black tracking-[-0.05em] text-white italic uppercase text-center font-display flex items-center justify-center gap-6">
                    <Star className="text-red-500 animate-pulse" size={40} fill="currentColor" />
                    Control <span className="text-red-500">Center</span>
                    <Star className="text-red-500 animate-pulse" size={40} fill="currentColor" />
                </h1>
                <p className="text-text-muted font-medium tracking-[0.2em] text-[10px] uppercase opacity-40 text-center">Orchestrating system-wide operations and identity management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                    { label: 'System Entities', value: stats.total_users, icon: Users, color: 'red-500' },
                    { label: 'Active nodes', value: stats.total_stores, icon: Store, color: 'red-600' },
                    { label: 'Validation logs', value: stats.total_ratings, icon: Activity, color: 'rose-500' }
                ].map((stat, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.3 }}
                        key={stat.label}
                        className="glass p-12 flex flex-col gap-10 card-hover relative group overflow-hidden border-white/5"
                    >
                        <div className="absolute -right-6 -top-6 p-12 opacity-5 scale-110 group-hover:scale-125 transition-transform duration-1000">
                            <stat.icon size={160} />
                        </div>
                        
                        <div className="flex items-center justify-between relative z-10">
                            <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10 group-hover:border-red-500/50 transition-colors relative">
                                <stat.icon size={28} className={`text-${stat.color}`} />
                                <Star size={10} className="absolute -top-1 -right-1 text-red-400 animate-ping" fill="currentColor" />
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted opacity-60 mb-1">{stat.label}</p>
                                <div className="h-1 w-12 bg-gradient-to-r from-transparent to-primary/40 rounded-full"></div>
                            </div>
                        </div>

                        <h2 className="text-7xl font-black tracking-[-0.05em] text-white relative z-10 font-display italic">
                            {stat.value.toString().padStart(2, '0')}
                        </h2>
                    </motion.div>
                ))}
            </div>

            <div className="glass p-8 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-white/5 relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-16">
                    <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 relative">
                                <Users size={24} className="text-red-500" />
                                <Star size={10} className="absolute -top-1 -right-1 text-red-400 animate-pulse" fill="currentColor" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic font-display flex items-center gap-3">
                                <Star size={20} className="text-red-500" fill="currentColor" />
                                Registry
                                <Star size={20} className="text-red-500" fill="currentColor" />
                            </h3>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowModal(true)}
                            className="btn-primary flex items-center gap-3 px-10 py-5 text-sm w-full sm:w-auto"
                        >
                            <Plus size={20} /> Initialize Entity
                        </motion.button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-72 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-white transition-colors" size={18} />
                            <input 
                                className="w-full pl-16 pr-8 py-5 bg-black/40 border-white/5 focus:bg-black/60 rounded-2xl italic font-medium text-sm transition-all shadow-inner" 
                                placeholder="Locate entity signature..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select 
                            className="w-full sm:w-56 py-5 px-8 bg-black/40 border-white/5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:bg-black/60 transition-all shadow-inner appearance-none text-red-500"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">Full Range</option>
                            <option value="Admin">Architects</option>
                            <option value="User">Standard</option>
                            <option value="StoreOwner">Operators</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-4 px-8 sm:px-0">
                        <thead>
                            <tr className="text-text-muted text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">
                                <th className="px-10 py-4 text-left">Entity Designation</th>
                                <th className="px-10 py-4 text-left hidden md:table-cell">Comms Channel</th>
                                <th className="px-10 py-4 text-right">Clearance Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={u.id} 
                                    className="group hover:bg-white/[0.03] transition-all cursor-pointer relative"
                                    onClick={() => navigate(`/admin/users/${u.id}`)}
                                >
                                    <td className="px-10 py-8 rounded-l-[2rem] border-l-[4px] border-transparent group-hover:border-primary group-hover:bg-primary/5 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                                <UserIcon size={20} className="text-primary/60 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-2xl text-white group-hover:translate-x-2 transition-transform duration-500 italic uppercase font-display">{u.name}</span>
                                                <span className="text-[9px] uppercase font-bold text-primary/40 tracking-[0.3em] mt-1">ID // {u.id.toString().padStart(4, '0')}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-sm font-medium italic text-text-muted group-hover:text-white transition-colors hidden md:table-cell">{u.email}</td>
                                    <td className="px-10 py-8 rounded-r-[2rem] group-hover:bg-primary/5 text-right">
                                        <div className="flex items-center justify-end gap-6">
                                            <span className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] border ${
                                                u.role === 'Admin' ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(192,132,252,0.3)]' :
                                                u.role === 'StoreOwner' ? 'bg-accent/10 text-accent border-accent/20 shadow-[0_0_20px_rgba(251,113,133,0.3)]' :
                                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                            }`}>
                                                {u.role}
                                            </span>
                                            <Globe size={18} className="text-primary/40 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-[360deg] duration-1000" />
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && !loading && (
                        <div className="text-center py-32 grayscale opacity-20 flex flex-col items-center gap-8">
                            <div className="p-10 rounded-full border border-dashed border-white/20">
                                <Globe size={80} className="animate-spin-slow" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-3xl font-black uppercase tracking-[0.3em] italic font-display">Null Set identified</p>
                                <p className="text-sm font-medium uppercase tracking-widest">No spectral matches found in registry</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 100 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                            className="glass p-12 sm:p-16 w-full max-w-2xl relative border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.8)]"
                        >
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-10 right-10 p-4 rounded-3xl hover:bg-white/10 text-text-muted hover:text-white transition-all shadow-xl"
                            >
                                <X size={32} />
                            </button>
                            <div className="flex flex-col mb-12">
                                <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white font-display">Provision Entity</h2>
                                <p className="text-text-muted font-medium mt-2 tracking-[0.2em] text-[10px] uppercase opacity-40">Configure security profile and access clearance</p>
                            </div>
                            <form onSubmit={handleAddUser} className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Handle ID</label>
                                        <input 
                                            placeholder="entity_node_x" 
                                            required 
                                            className="bg-black/40 border-white/5 py-6 px-8 text-xl rounded-3xl italic font-medium focus:bg-black/80"
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Clearance</label>
                                        <select 
                                            className="bg-black/40 border-white/5 py-6 px-8 text-xs font-black uppercase tracking-[0.3em] rounded-3xl cursor-pointer hover:bg-black/80 appearance-none text-primary"
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        >
                                            <option value="User">Standard // Node</option>
                                            <option value="Admin">Architect // Master</option>
                                            <option value="StoreOwner">Operator // Cell</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Communication Channel</label>
                                    <input 
                                        type="email" 
                                        placeholder="primary_link@vault.io" 
                                        required 
                                        className="bg-black/40 border-white/5 py-6 px-8 text-xl rounded-3xl italic font-medium"
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Security Sequence</label>
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        required 
                                        className="bg-black/40 border-white/5 py-6 px-8 text-xl rounded-3xl"
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Full Legal Identity</label>
                                    <input 
                                        placeholder="Designation of entity (20+ chars)" 
                                        required 
                                        className="bg-black/40 border-white/5 py-6 px-8 text-xl rounded-3xl italic font-medium"
                                        minLength={20}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Physical Coordinate</label>
                                    <textarea 
                                        placeholder="Full geographic residential data..." 
                                        required 
                                        rows={2}
                                        className="bg-black/40 border-white/5 py-6 px-8 text-xl rounded-3xl italic font-medium resize-none"
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                                {error && <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest flex gap-4 items-center italic">
                                    <Shield size={20} /> {error}
                                </motion.div>}
                                <motion.button 
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    className="btn-primary mt-6 py-8 font-black text-2xl uppercase tracking-tighter italic font-display"
                                >
                                    Initialize Identification
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;

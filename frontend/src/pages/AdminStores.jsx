import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Store, Plus, Star, X, Mail, MapPin, User, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminStores = () => {
    const [stores, setStores] = useState([]);
    const [owners, setOwners] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', address: '', owner: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
        fetchOwners();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await api.get('admin/stores/');
            setStores(res.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchOwners = async () => {
        const res = await api.get('admin/users/', { params: { role: 'StoreOwner' } });
        setOwners(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('admin/stores/', formData);
            setShowModal(false);
            setFormData({ name: '', email: '', address: '', owner: '' });
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create store');
        }
    };

    if (loading && stores.length === 0) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-layout py-24 sm:py-32 animate-fade">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 mb-1">
                        <div className="h-px w-12 bg-primary/30"></div>
                        <Store className="text-primary/40" size={14} />
                        <div className="h-px w-12 bg-primary/30"></div>
                    </div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-[-0.05em] text-white italic uppercase font-display">
                        Store <span className="text-gradient">Registry</span>
                    </h1>
                    <p className="text-text-muted font-medium tracking-[0.2em] text-[10px] uppercase opacity-40">Managing the global network of active retail nodes</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-4 px-12 py-6 text-sm uppercase tracking-widest w-full lg:w-auto"
                >
                    <Plus size={22} /> Initialize Node
                </motion.button>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {stores.map((s, i) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.3 }}
                        key={s.id}
                        className="glass p-12 flex flex-col gap-10 card-hover relative group overflow-hidden border-white/5"
                    >
                        <div className="absolute -right-6 -top-6 p-12 opacity-5 scale-110 group-hover:scale-125 transition-transform duration-1000">
                            <Store size={160} />
                        </div>
                        
                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10 group-hover:border-red-500/50 transition-colors relative">
                                    <Store size={28} className="text-red-500" />
                                    <Star size={10} className="absolute -top-1 -right-1 text-red-400 animate-ping" fill="currentColor" />
                                </div>
                                <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                                    <Star size={20} className="text-amber-500" fill="currentColor" />
                                    <span className="font-black text-2xl text-white font-display italic">{s.overall_rating.toFixed(1)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-3xl font-black tracking-tighter text-white group-hover:text-red-500 transition-colors italic uppercase font-display leading-tight">{s.name}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="h-1 w-10 bg-red-500/40 rounded-full"></div>
                                    <span className="text-[9px] font-black tracking-[0.4em] text-text-muted uppercase">NID // {s.id.toString().padStart(4, '0')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 relative z-10">
                            <div className="flex items-center gap-4 text-sm font-medium text-text-muted group-hover:text-white/80 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                                    <Mail size={14} className="text-primary/60" />
                                </div>
                                <span className="truncate italic font-medium">{s.email}</span>
                            </div>
                            <div className="flex items-start gap-4 text-sm font-medium text-text-muted/70 group-hover:text-white/70 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                    <MapPin size={14} className="text-primary/60" />
                                </div>
                                <span className="leading-relaxed italic line-clamp-2">"{s.address}"</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <User size={16} className="text-red-500/60" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted opacity-40">Administrator</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white italic">{s.owner}</span>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <ShieldCheck size={24} className="text-red-500/30 group-hover:text-red-400 transition-all relative z-10" />
                            </div>
                        </div>
                    </motion.div>
                ))}
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
                                <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white font-display">Initialize Store</h2>
                                <p className="text-text-muted font-medium mt-2 tracking-[0.2em] text-[10px] uppercase opacity-40">Deploy a new retail node to the global registry</p>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Entity Name</label>
                                    <input 
                                        required 
                                        placeholder="Ex: Prime Dynamics"
                                        className="bg-black/40 border-white/5 py-6 px-8 text-xl rounded-3xl italic font-medium focus:bg-black/80"
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Communication Channel</label>
                                    <input 
                                        type="email" 
                                        required 
                                        placeholder="node@vault.io"
                                        className="bg-black/40 border-white/5 py-6 px-8 text-xl rounded-3xl italic font-medium"
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Geographic Coordinates</label>
                                    <textarea 
                                        required 
                                        rows={2}
                                        placeholder="Full geographic residential data..."
                                        className="bg-black/40 border-white/5 py-6 px-8 text-xl rounded-3xl italic font-medium resize-none"
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 ml-2 italic">Assigned Operator</label>
                                    <select 
                                        required 
                                        className="bg-black/40 border-white/5 py-6 px-8 text-xs font-black uppercase tracking-[0.3em] rounded-3xl cursor-pointer hover:bg-black/80 appearance-none text-primary"
                                        onChange={(e) => setFormData({...formData, owner: e.target.value})}
                                    >
                                        <option value="">Select cell operator</option>
                                        {owners.map(o => (
                                            <option key={o.id} value={o.id}>{o.name} [NODE_ID: {o.id}]</option>
                                        ))}
                                    </select>
                                </div>
                                {error && <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest flex gap-4 items-center italic">
                                    <ShieldCheck size={20} /> {error}
                                </div>}
                                <motion.button 
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit" 
                                    className="btn-primary mt-6 py-8 font-black text-2xl uppercase tracking-tighter italic font-display"
                                >
                                    Confirm Deployment
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminStores;

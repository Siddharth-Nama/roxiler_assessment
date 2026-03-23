import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Star, ArrowLeft, Mail, MapPin, User as UserIcon, Shield, Zap, Globe, Cpu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await api.get(`admin/users/${id}/`);
            setUser(res.data);
        } catch (error) {
            console.error("Failed to fetch user details", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 opacity-20">
            <Shield size={64} />
            <p className="text-2xl font-black uppercase tracking-widest">Entity Not Identified</p>
        </div>
    );

    return (
        <div className="max-layout py-24 sm:py-32 animate-fade">
            <motion.button 
                whileHover={{ x: -10 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-red-500/40 hover:text-red-500 transition-all w-fit group mb-10"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Return to Registry
            </motion.button>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-12 relative overflow-hidden border-white/5"
            >
                <div className="absolute right-0 top-0 p-20 opacity-5 -rotate-12 translate-x-1/4 -translate-y-1/4">
                    <Shield size={400} />
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start relative z-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-800 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-red-600 via-red-500 to-rose-700 shadow-2xl relative border border-white/10 group-hover:rotate-3 transition-transform duration-500">
                            <UserIcon size={80} className="text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 p-3 bg-black/80 rounded-2xl border border-white/10 backdrop-blur-xl">
                            <Cpu size={20} className="text-red-500" />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="flex flex-col gap-3 mb-8">
                            <h1 className="text-6xl sm:text-7xl font-black tracking-[-0.05em] text-white italic uppercase font-display leading-none flex items-center gap-4">
                                <Star className="text-red-500 animate-pulse" size={32} fill="currentColor" />
                                {user.name}
                                <Star className="text-red-500 animate-pulse" size={32} fill="currentColor" />
                            </h1>
                            <div className="flex items-center justify-center lg:justify-start gap-5 mt-4">
                                <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border shadow-2xl backdrop-blur-md ${
                                    user.role === 'Admin' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
                                    user.role === 'StoreOwner' ? 'bg-red-600/10 text-red-400 border-red-600/20 shadow-[0_0_20px_rgba(225,29,72,0.3)]' :
                                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                }`}>
                                    {user.role} Authorization
                                </span>
                                <span className="text-[10px] font-black text-text-muted/40 tracking-[0.4em] uppercase italic">REF // 00{user.id}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mt-6">
                            <div className="glass p-6 flex flex-col gap-3 group border-white/5 ring-1 ring-white/5">
                                <div className="flex items-center gap-3">
                                    <Mail className="text-primary" size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Communication Channel</span>
                                </div>
                                <span className="text-lg font-medium italic text-white group-hover:text-primary transition-colors">{user.email}</span>
                            </div>
                            <div className="glass p-6 flex flex-col gap-3 group border-white/5 ring-1 ring-white/5">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-primary" size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Geographic Coordinate</span>
                                </div>
                                <span className="text-lg font-medium text-white group-hover:text-primary transition-colors leading-snug">"{user.address}"</span>
                            </div>
                        </div>

                        {user.role === 'StoreOwner' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.2, type: 'spring', bounce: 0.3 }}
                                className="mt-16 w-full p-12 rounded-[3rem] bg-black/40 border border-white/5 shadow-inner relative overflow-hidden group"
                            >
                                <div className="absolute right-0 bottom-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                    <Zap size={160} className="text-amber-500" />
                                </div>
                                <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-red-500/40 mb-10 flex items-center gap-4 italic px-2">
                                    <Activity size={18} className="animate-pulse" /> Operational performance metrics
                                </h3>
                                <div className="flex flex-col xl:flex-row items-center gap-12 relative z-10">
                                    <div className="flex items-end gap-5 bg-black/60 p-12 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-md group-hover:border-red-500/30 transition-colors">
                                        <span className="text-8xl font-black text-white tracking-tighter italic font-display leading-none">
                                            {user.store_rating ? user.store_rating.toFixed(1) : '0.0'}
                                        </span>
                                        <div className="flex flex-col mb-3">
                                            <Star size={32} className="text-amber-500 mb-2" fill="currentColor" />
                                            <span className="text-[9px] font-black text-text-muted/40 uppercase tracking-[0.3em]">Avg. Score</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center xl:text-left">
                                        <p className="text-xl font-medium leading-relaxed italic text-text-muted/70">
                                            Aggregated satisfaction index derived from recursive consumer diagnostics. Current telemetry indicates a highly optimized retail node.
                                        </p>
                                        <div className="flex flex-wrap justify-center xl:justify-start gap-5 mt-8">
                                            <div className="flex items-center gap-3 bg-emerald-500/5 px-6 py-3 rounded-full border border-emerald-500/10 shadow-xl">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">Public Node</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-red-500/5 px-6 py-3 rounded-full border border-red-500/10 shadow-xl">
                                                <Shield size={16} className="text-red-500/60" />
                                                <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em]">Verified Operator</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserDetail;

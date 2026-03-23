import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Star, Users, TrendingUp, Inbox, Zap, Activity, ShieldCheck, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StoreOwnerDashboard = () => {
    const [data, setData] = useState({ average_rating: 0, reviews: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('store-owner/dashboard/');
            setData(res.data);
        } catch (error) {
            console.error("Failed to fetch store dashboard", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && data.reviews.length === 0) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-layout py-24 sm:py-32 animate-fade">
            <div className="flex flex-col gap-3 mb-16">
                <div className="flex items-center gap-4 mb-2">
                    <div className="h-px w-16 bg-red-500/30"></div>
                    <Zap className="text-red-500/40 animate-pulse" size={14} />
                    <div className="h-px w-16 bg-red-500/30"></div>
                </div>
                <h1 className="text-6xl sm:text-7xl font-black tracking-[-0.05em] text-white italic uppercase font-display leading-tight flex items-center justify-center gap-6">
                    <Star className="text-red-500 animate-pulse" size={40} fill="currentColor" />
                    Command <span className="text-red-500">Center</span>
                    <Star className="text-red-500 animate-pulse" size={40} fill="currentColor" />
                </h1>
                <p className="text-text-muted font-medium tracking-[0.2em] text-[10px] uppercase opacity-40 italic">High-fidelity performance analytics and operational intelligence</p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', bounce: 0.3 }}
                    className="glass p-16 flex flex-col justify-center items-center text-center card-hover relative overflow-hidden group border-white/5"
                >
                    <div className="absolute -right-10 -top-10 p-16 opacity-5 group-hover:opacity-10 transition-all duration-1000 rotate-12 group-hover:rotate-0">
                        <Star size={240} />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <p className="text-red-500 uppercase tracking-[0.5em] text-[10px] font-black mb-10 italic opacity-60">Satisfaction Index</p>
                        <div className="flex items-end gap-5">
                            <span className="text-9xl font-black text-white italic tracking-tighter font-display drop-shadow-[0_0_50px_rgba(239,68,68,0.4)] leading-none">
                                {data.average_rating.toFixed(1)}
                            </span>
                            <div className="flex flex-col mb-4">
                                <Star className="text-amber-500 animate-pulse mb-1" size={48} fill="currentColor" />
                                <span className="text-[9px] font-black text-red-500/40 uppercase tracking-[0.3em]">Score</span>
                            </div>
                        </div>
                        <div className="mt-16 flex items-center gap-4 text-emerald-400 bg-emerald-500/5 border border-emerald-400/20 px-10 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl backdrop-blur-xl group-hover:border-emerald-400/50 transition-colors">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                            Node Operations Optimized
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', bounce: 0.3 }}
                    className="glass p-16 flex flex-col justify-center items-center text-center card-hover relative overflow-hidden group border-white/5"
                >
                    <div className="absolute -right-10 -top-10 p-16 opacity-5 group-hover:opacity-10 transition-all duration-1000 -rotate-12 group-hover:rotate-0">
                        <Users size={240} />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/10 mb-10 shadow-3xl group-hover:scale-110 group-hover:border-red-500/50 transition-all duration-700">
                            <Users size={64} className="text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
                        </div>
                        <p className="text-red-500 uppercase tracking-[0.5em] text-[10px] font-black mb-6 italic opacity-60">Total Valuations</p>
                        <h2 className="text-9xl font-black tracking-tighter text-white italic font-display leading-none">
                            {data.reviews.length}
                        </h2>
                        <p className="text-text-muted mt-8 font-medium italic opacity-30 uppercase text-[9px] tracking-[0.4em]">Verified Registry Log Entries</p>
                    </div>
                </motion.div>
            </div>

            <div className="glass p-16 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/5 relative overflow-hidden rounded-[3rem]">
                <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-red-600 via-red-500 to-rose-700"></div>
                <div className="flex items-center gap-8 mb-20 px-4">
                    <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/10 group-hover:border-red-500/50 transition-colors shadow-2xl relative">
                        <Activity size={32} className="text-red-500" />
                        <Star size={10} className="absolute -top-1 -right-1 text-red-400 animate-ping" fill="currentColor" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white font-display">Registry Intelligence</h3>
                        <p className="text-[9px] font-black tracking-[0.5em] text-text-muted/40 uppercase italic">Sequential consumer diagnostic logs</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto -mx-8 sm:mx-0">
                    <table className="w-full border-separate border-spacing-y-8 px-8 sm:px-0">
                        <thead>
                            <tr className="text-text-muted text-[10px] font-black uppercase tracking-[0.5em] opacity-30 italic">
                                <th className="px-10 py-4 text-left">Validator</th>
                                <th className="px-10 py-4 text-left hidden md:table-cell">Communication channel</th>
                                <th className="px-10 py-4 text-right">Diagnostic Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.reviews.map((r, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={r.id} 
                                    className="group hover:bg-white/[0.03] transition-all cursor-default relative overflow-hidden"
                                >
                                    <td className="px-10 py-10 rounded-l-[2.5rem] border-l-[4px] border-transparent group-hover:border-red-500 group-hover:bg-red-500/5 transition-all">
                                        <div className="flex flex-col">
                                            <span className="font-black text-3xl text-white group-hover:translate-x-3 transition-transform duration-700 tracking-tighter uppercase italic font-display">{r.user_name}</span>
                                            <span className="text-[9px] uppercase font-bold text-red-500/40 tracking-[0.4em] mt-2 italic">SECURE_ID // {r.id.toString().padStart(4, '0')}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 text-sm font-medium italic text-text-muted group-hover:text-white/80 transition-colors hidden md:table-cell font-sans opacity-60 group-hover:opacity-100">{r.user_email}</td>
                                    <td className="px-10 py-10 rounded-r-[2.5rem] group-hover:bg-red-500/5 text-right">
                                        <div className="flex items-center justify-end gap-10">
                                            <div className="flex items-center gap-4 bg-black/40 px-8 py-4 rounded-2xl border border-white/5 shadow-3xl group-hover:border-red-500/20 transition-all backdrop-blur-md">
                                                <span className="font-black text-3xl text-amber-500 italic tracking-tighter font-display leading-none">{r.value}.0</span>
                                                <Star size={24} className="text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]" fill="currentColor" />
                                            </div>
                                            <div className="flex gap-2">
                                                {[...Array(5)].map((_, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-1000 ${
                                                            idx < r.value ? 'bg-red-500 scale-150 shadow-[0_0_25px_rgba(239,68,68,0.8)] border border-white/20' : 'bg-white/5 scale-75'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <AnimatePresence>
                        {data.reviews.length === 0 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-48 gap-12 grayscale opacity-20"
                            >
                                <div className="p-12 rounded-full border border-dashed border-white/20">
                                    <Inbox size={100} className="animate-pulse" />
                                </div>
                                <div className="flex flex-col gap-4 text-center">
                                    <p className="text-4xl font-black tracking-[0.3em] uppercase italic font-display">Registry Empty</p>
                                    <p className="text-[10px] font-black tracking-[0.5em] uppercase opacity-60">Waiting for consumer diagnostic input</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StoreOwnerDashboard;

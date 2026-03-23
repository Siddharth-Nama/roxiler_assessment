import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, MapPin, Star, Globe, Zap, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserStores = () => {
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, [search]);

    const fetchStores = async () => {
        try {
            const res = await api.get('stores/', { params: { search } });
            setStores(res.data);
        } catch (error) {
            console.error("Failed to fetch stores", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (storeId, value) => {
        try {
            await api.post('ratings/', { store: storeId, value });
            fetchStores();
        } catch (error) {
            alert(error.response?.data?.non_field_errors?.[0] || "Failed to submit rating");
        }
    };

    if (loading && stores.length === 0) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-layout py-24 sm:py-32 animate-fade">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-px w-16 bg-red-500/30"></div>
                        <Globe className="text-red-500/40 animate-pulse" size={14} />
                        <div className="h-px w-16 bg-red-500/30"></div>
                    </div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-[-0.05em] text-white italic uppercase font-display leading-none flex items-center gap-4">
                        <Star className="text-red-500 animate-pulse" size={40} fill="currentColor" />
                        Market<span className="text-red-500">place</span>
                        <Star className="text-red-500 animate-pulse" size={40} fill="currentColor" />
                    </h1>
                    <p className="text-text-muted font-medium tracking-[0.2em] text-[10px] uppercase opacity-40 italic">Discover and evaluate premier retail establishments</p>
                </div>
                <div className="relative w-full lg:w-[540px] group">
                    <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-white transition-colors" size={20} />
                    <input 
                        className="w-full pl-16 pr-8 py-6 bg-black/40 border-white/5 text-lg rounded-3xl focus:bg-black/60 shadow-inner italic font-medium transition-all" 
                        placeholder="Locate node or coordinate..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {stores.map((s, i) => (
                    <motion.div 
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.05, type: 'spring', bounce: 0.3 }}
                        className="glass p-12 group card-hover flex flex-col h-full relative overflow-hidden border-white/5"
                    >
                        <div className="absolute -right-6 -top-6 p-12 opacity-5 scale-110 group-hover:scale-125 transition-transform duration-1000">
                            <Globe size={160} />
                        </div>

                        <div className="flex-1 relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/10 group-hover:border-red-500/50 transition-colors relative">
                                    <Zap size={24} className="text-red-500 relative z-10" />
                                    <Star size={10} className="absolute -top-1 -right-1 text-red-400 animate-ping" fill="currentColor" />
                                </div>
                                <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                                    <Star size={20} className="text-amber-500" fill="currentColor" />
                                    <span className="font-black text-2xl text-white font-display italic">{s.overall_rating.toFixed(1)}</span>
                                </div>
                            </div>
                            
                            <h3 className="text-3xl font-black mb-4 group-hover:text-red-500 transition-colors duration-500 uppercase tracking-tighter italic leading-none font-display">
                                {s.name}
                            </h3>
                            <div className="flex items-start gap-3 text-text-muted/60 text-sm font-medium mb-10">
                                <MapPin size={18} className="text-red-500/60 mt-0.5 shrink-0" />
                                <span className="italic leading-relaxed overflow-hidden text-ellipsis line-clamp-2">"{s.address}"</span>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-black/40 border border-white/5 flex flex-col items-center justify-center transition-all group-hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] mb-10 overflow-hidden relative">
                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-3 mb-3 relative z-10">
                                    <Activity size={14} className="text-red-500/60 animate-pulse" />
                                    <p className="text-[9px] uppercase text-text-muted/40 font-black tracking-[0.4em]">Personal Index</p>
                                </div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <span className="text-5xl font-black text-white italic tracking-tighter font-display leading-none">{s.user_rating || '--'}</span>
                                    {s.user_rating && (
                                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                            <Star size={18} className="text-red-500" fill="currentColor" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 shadow-inner relative z-10">
                            <p className="text-[8px] font-black text-primary/30 uppercase tracking-[0.5em] text-center italic mb-2">Dispatch Evaluation</p>
                            <div className="flex justify-between items-center gap-2">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <motion.button 
                                        whileHover={{ scale: 1.2, y: -8 }}
                                        whileTap={{ scale: 0.85 }}
                                        key={val}
                                        onClick={() => handleRate(s.id, val)}
                                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-all duration-700 font-display italic ${
                                            s.user_rating === val 
                                            ? 'bg-gradient-to-br from-red-500 to-red-900 text-white shadow-[0_0_35px_rgba(239,68,68,0.4)] border border-white/20' 
                                            : 'bg-black/40 hover:bg-white/10 text-white/10 hover:text-white border border-white/5'
                                        }`}
                                    >
                                        {val}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between opacity-30 relative z-10 group-hover:opacity-100 transition-all duration-1000">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-text-muted">Node Status: Operational</span>
                            <div className="flex items-center gap-2">
                                <Star size={12} className="text-red-500 animate-spin-slow" fill="currentColor" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <ShieldCheck size={18} className="text-emerald-500/60" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {stores.length === 0 && !loading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-48 flex flex-col items-center gap-10 opacity-20 grayscale"
                    >
                        <div className="p-12 rounded-full border border-dashed border-white/20">
                            <Globe size={100} className="animate-spin-slow" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-5xl font-black uppercase tracking-[0.3em] italic font-display">Zero Nodes Identified</p>
                            <p className="text-lg font-medium tracking-widest uppercase opacity-60">No establishments match your discovery parameters</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserStores;

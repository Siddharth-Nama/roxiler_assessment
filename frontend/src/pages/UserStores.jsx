import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
            fetchStores(); // Refresh to see updated ratings
        } catch (error) {
            alert(error.response?.data?.non_field_errors?.[0] || "Failed to submit rating");
        }
    };

    return (
        <div className="p-4 animate-fade">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <h1 className="text-3xl font-bold">Discover Stores</h1>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input 
                        className="w-full pl-12 pr-4 py-3 glass" 
                        placeholder="Search by Name or Address..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stores.map((s, i) => (
                    <motion.div 
                        key={s.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass p-6 group hover:border-primary/50 transition-all"
                    >
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{s.name}</h3>
                        <div className="flex items-center gap-2 text-text-muted text-sm mb-6">
                            <MapPin size={16} />
                            <span>{s.address}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-3 rounded-xl bg-white/5 border border-glass-border text-center">
                                <p className="text-[10px] uppercase text-text-muted font-bold tracking-wider">Overall</p>
                                <div className="flex items-center justify-center gap-1 mt-1 text-yellow-400">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-lg font-black">{s.overall_rating.toFixed(1)}</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                                <p className="text-[10px] uppercase text-primary font-bold tracking-wider">Your Rating</p>
                                <div className="flex items-center justify-center gap-1 mt-1 text-primary">
                                    <span className="text-lg font-black">{s.user_rating || '-'}</span>
                                    {s.user_rating && <Star size={16} fill="currentColor" />}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest text-center">Rate this store</p>
                            <div className="flex justify-between items-center gap-1 bg-black/20 p-2 rounded-xl border border-glass-border">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button 
                                        key={val}
                                        onClick={() => handleRate(s.id, val)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                                            s.user_rating === val 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' 
                                            : 'hover:bg-white/10 text-text-muted'
                                        }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {stores.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-text-muted text-lg">No stores found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default UserStores;

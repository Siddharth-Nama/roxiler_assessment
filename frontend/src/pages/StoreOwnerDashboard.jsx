import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Star, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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

    if (loading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="p-4 flex flex-col gap-8 animate-fade">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Store Insights</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 flex flex-col justify-center items-center text-center"
                >
                    <p className="text-text-muted uppercase tracking-widest text-sm font-bold mb-2">Average Rating</p>
                    <div className="flex items-end gap-3">
                        <span className="text-7xl font-black bg-gradient-to-br from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            {data.average_rating.toFixed(1)}
                        </span>
                        <Star className="text-yellow-500 mb-4" size={40} fill="currentColor" />
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-sm">
                        <TrendingUp size={16} /> 
                        <span>Performance is stable</span>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 flex flex-col justify-center items-center text-center"
                >
                    <div className="p-4 rounded-full bg-primary/20 text-primary mb-4">
                        <Users size={32} />
                    </div>
                    <p className="text-text-muted uppercase tracking-widest text-sm font-bold mb-2">Total Reviews</p>
                    <h2 className="text-5xl font-black">{data.reviews.length}</h2>
                    <p className="text-text-muted mt-2">Verified customer feedbacks</p>
                </motion.div>
            </div>

            <div className="glass p-6">
                <h3 className="text-xl font-bold mb-6">Recent Feedbacks</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-text-muted text-sm uppercase">
                            <tr>
                                <th className="px-4 py-3 border-b border-glass-border">Customer Name</th>
                                <th className="px-4 py-3 border-b border-glass-border">Email</th>
                                <th className="px-4 py-3 border-b border-glass-border">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.reviews.map((r) => (
                                <tr key={r.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4 font-medium">{r.user_name}</td>
                                    <td className="px-4 py-4 text-text-muted">{r.user_email}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={14} 
                                                    fill={i < r.value ? "currentColor" : "none"} 
                                                    className={i < r.value ? "" : "text-gray-600"}
                                                />
                                            ))}
                                            <span className="ml-2 font-bold">{r.value}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {data.reviews.length === 0 && (
                        <p className="text-center py-10 text-text-muted">No reviews yet for your store.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreOwnerDashboard;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Star, ArrowLeft, Mail, MapPin, User as UserIcon } from 'lucide-react';
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

    if (loading) return <div className="p-20 text-center">Loading...</div>;
    if (!user) return <div className="p-20 text-center">User not found</div>;

    return (
        <div className="p-4 animate-fade">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 max-w-4xl mx-auto"
            >
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary to-accent shadow-xl">
                        <UserIcon size={64} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold mb-6 inline-block ${
                            user.role === 'Admin' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            user.role === 'StoreOwner' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                            {user.role}
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="flex items-center gap-3 text-text-muted">
                                <Mail className="text-primary" size={20} />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-text-muted">
                                <MapPin className="text-primary" size={20} />
                                <span>{user.address}</span>
                            </div>
                        </div>

                        {user.role === 'StoreOwner' && (
                            <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-glass-border">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Star className="text-yellow-400" size={24} fill="currentColor" />
                                    Store Performance
                                </h3>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black text-white">
                                        {user.store_rating ? user.store_rating.toFixed(1) : 'No Ratings'}
                                    </span>
                                    <span className="text-text-muted mb-2 font-medium">/ 5.0 Average Rating</span>
                                </div>
                                <p className="text-sm text-text-muted mt-4">
                                    This is the overall average rating calculated from all user reviews for this owner's registered store.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UserDetail;

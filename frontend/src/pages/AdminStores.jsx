import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Store, Plus, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminStores = () => {
    const [stores, setStores] = useState([]);
    const [owners, setOwners] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', address: '', owner: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStores();
        fetchOwners();
    }, []);

    const fetchStores = async () => {
        const res = await api.get('admin/stores/');
        setStores(res.data);
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

    return (
        <div className="p-4 animate-fade">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Store Management</h1>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} /> Add Store
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((s) => (
                    <motion.div 
                        key={s.id}
                        layoutId={s.id}
                        className="glass p-6 flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">{s.name}</h3>
                            <div className="flex items-center gap-1 text-yellow-400">
                                <Star size={18} fill="currentColor" />
                                <span className="font-bold">{s.overall_rating.toFixed(1)}</span>
                            </div>
                        </div>
                        <div className="text-sm text-text-muted">
                            <p>📧 {s.email}</p>
                            <p className="mt-1">📍 {s.address}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-glass-border">
                            <p className="text-xs text-text-muted">Owner ID: {s.owner}</p>
                        </div>
                    </motion.div>
                ))}
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
                            <h2 className="text-2xl font-bold mb-6">Add New Store</h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Store Name</label>
                                    <input 
                                        required 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Store Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Address</label>
                                    <textarea 
                                        required 
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm">Select Owner</label>
                                    <select 
                                        required 
                                        onChange={(e) => setFormData({...formData, owner: e.target.value})}
                                    >
                                        <option value="">Choose an owner</option>
                                        {owners.map(o => (
                                            <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                                        ))}
                                    </select>
                                </div>
                                {error && <p className="text-red-400 text-sm">{error}</p>}
                                <button type="submit" className="btn-primary mt-4">Create Store</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminStores;

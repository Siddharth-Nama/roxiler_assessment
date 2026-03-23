import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, User, Mail, MapPin, Lock, AtSign, AlertCircle, Shield, ArrowRight, Sparkles, Star } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        address: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('signup/', formData);
            navigate('/login');
        } catch (err) {
            setErrors(err.response?.data || { message: 'Provisioning failed' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-[80vmax] h-[80vmax] bg-red-600/5 rounded-full blur-[100px] -bottom-1/4 -left-1/4"
            ></motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                className="absolute w-[60vmax] h-[60vmax] bg-red-900/5 rounded-full blur-[120px] -top-1/4 -right-1/4"
            ></motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="glass p-16 w-full max-w-[1000px] relative z-20 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
                
                <div className="flex flex-col items-center mb-16">
                    <motion.div 
                        whileHover={{ scale: 1.15, rotate: -10 }}
                        className="p-8 bg-gradient-to-br from-red-600 via-red-500 to-rose-700 rounded-[2.5rem] mb-10 shadow-[0_0_50px_rgba(239,68,68,0.3)] relative group"
                    >
                        <UserPlus size={56} className="text-white relative z-10" />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-[2.5rem] transition-opacity"></div>
                    </motion.div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-[-0.05em] text-white uppercase italic text-center font-display leading-tight flex items-center gap-4">
                        <Star className="text-red-500 animate-pulse" size={40} fill="currentColor" />
                        Provision <span className="text-red-500">Terminal</span>
                        <Star className="text-red-500 animate-pulse" size={40} fill="currentColor" />
                    </h1>
                    <p className="text-text-muted mt-4 font-medium tracking-[0.3em] text-[10px] uppercase opacity-40 italic">Initialize your unique signature in the global registry</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="flex flex-col gap-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/60 ml-1 italic">Handle ID</label>
                        <div className="relative group">
                            <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input 
                                name="username" 
                                onChange={handleChange} 
                                required 
                                className="pl-16 pr-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem] italic font-medium" 
                                placeholder="unique_node_id" 
                            />
                        </div>
                        {errors.username && <span className="text-[10px] text-rose-400 font-bold px-4 italic flex items-center gap-2"><AlertCircle size={14} /> {errors.username[0]}</span>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/60 ml-1 italic">Legal Auth. Name</label>
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input 
                                name="name" 
                                onChange={handleChange} 
                                required 
                                minLength={20} 
                                maxLength={60} 
                                className="pl-16 pr-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem] italic font-medium" 
                                placeholder="Full designation (20+ chars)" 
                            />
                        </div>
                        {errors.name && <span className="text-[10px] text-rose-400 font-bold px-4 italic flex items-center gap-2"><AlertCircle size={14} /> {errors.name[0]}</span>}
                    </div>

                    <div className="flex flex-col gap-3 md:col-span-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/60 ml-1 italic">Communication Link</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input 
                                name="email" 
                                type="email" 
                                onChange={handleChange} 
                                required 
                                className="pl-16 pr-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem] italic font-medium" 
                                placeholder="primary_link@vault.io" 
                            />
                        </div>
                        {errors.email && <span className="text-[10px] text-rose-400 font-bold px-4 italic flex items-center gap-2"><AlertCircle size={14} /> {errors.email[0]}</span>}
                    </div>

                    <div className="flex flex-col gap-3 md:col-span-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/60 ml-1 italic">Geographic Sector</label>
                        <div className="relative group">
                            <MapPin className="absolute left-6 top-6 text-red-500/40 group-focus-within:text-red-500 transition-colors" size={20} />
                            <textarea 
                                name="address" 
                                onChange={handleChange} 
                                required 
                                maxLength={400} 
                                rows={3} 
                                className="pl-16 pr-8 pt-6 pb-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem] italic font-medium resize-none min-h-[140px]" 
                                placeholder="Full coordinate data..." 
                            />
                        </div>
                        {errors.address && <span className="text-[10px] text-rose-400 font-bold px-4 italic flex items-center gap-2"><AlertCircle size={14} /> {errors.address[0]}</span>}
                    </div>

                    <div className="flex flex-col gap-3 md:col-span-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/60 ml-1 italic">Secured String</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input 
                                name="password" 
                                type="password" 
                                onChange={handleChange} 
                                required 
                                minLength={8} 
                                maxLength={16} 
                                className="pl-16 pr-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem]" 
                                placeholder="••••••••" 
                            />
                        </div>
                        <div className="flex items-center gap-3 px-2 opacity-40">
                            <Sparkles size={12} className="text-red-500" />
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white italic">Complexity required: 8-16 chars, Uppercase, Symbol</p>
                        </div>
                        {errors.password && <span className="text-[10px] text-rose-400 font-bold px-4 italic flex items-center gap-2"><AlertCircle size={14} /> {errors.password[0]}</span>}
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit" 
                        className="btn-primary md:col-span-2 mt-10 py-8 font-black text-2xl uppercase tracking-tighter italic flex items-center justify-center gap-5 bg-gradient-to-br from-accent to-rose-700 shadow-[0_30px_60px_rgba(244,63,94,0.3)] border border-white/10"
                    >
                        Initialize Synchronization <ArrowRight size={32} className="animate-pulse" />
                        <Star size={20} className="absolute top-2 right-2 text-white/10" fill="currentColor" />
                    </motion.button>
                    
                    <p className="text-center text-xs font-black uppercase tracking-widest md:col-span-2 mt-4 opacity-60">
                        Already in registry? <Link to="/login" className="text-red-500 hover:text-white transition-all underline underline-offset-8 decoration-red-500/20 hover:decoration-red-500 italic">Access Gateway</Link>
                    </p>
                </form>
            </motion.div>

            <div className="fixed bottom-10 right-12 flex flex-col items-end gap-1 opacity-20">
                <div className="flex items-center gap-2">
                    <Star size={10} className="text-red-500 animate-spin-slow" fill="currentColor" />
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white italic text-right">Vault OS v4.0.2</span>
                </div>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] text-right">Identity Service Layer</span>
            </div>
        </div>
    );
};

export default Signup;

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ShieldCheck, Zap, ArrowRight, Shield, Star } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = await login(email, password);
            if (role === 'Admin') navigate('/admin');
            else if (role === 'User') navigate('/user');
            else if (role === 'StoreOwner') navigate('/store');
        } catch (err) {
            setError('Authorization failed. Check your security parameters.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-[80vmax] h-[80vmax] bg-red-600/5 rounded-full blur-[100px] -top-1/4 -left-1/4"
            ></motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                className="absolute w-[60vmax] h-[60vmax] bg-red-900/5 rounded-full blur-[120px] -bottom-1/4 -right-1/4"
            ></motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 50, rotateY: 15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="glass p-16 w-full max-w-xl relative z-20 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                
                <div className="flex flex-col items-center mb-16">
                    <motion.div 
                        whileHover={{ rotate: 360, scale: 1.15 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="p-8 bg-gradient-to-br from-red-600 via-red-500 to-rose-700 rounded-[2.5rem] mb-10 shadow-[0_0_50px_rgba(239,68,68,0.3)] relative group"
                    >
                        <ShieldCheck size={56} className="text-white relative z-10" />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-[2.5rem] transition-opacity"></div>
                    </motion.div>
                    <h1 className="text-6xl sm:text-7xl font-black tracking-[-0.05em] text-white uppercase italic text-center font-display leading-tight flex items-center gap-4">
                        <Star className="text-red-500 hidden sm:block" size={32} fill="currentColor" />
                        Identity <span className="text-red-500">Terminal</span>
                        <Star className="text-red-500 hidden sm:block" size={32} fill="currentColor" />
                    </h1>
                    <p className="text-text-muted mt-4 font-medium tracking-[0.3em] text-[10px] uppercase opacity-40 italic">Secure authorization required to access registry</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/60 ml-1 italic">Voucher Identity</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="pl-16 pr-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem] italic font-medium"
                                placeholder="node@vault.io"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/60 ml-1 italic">Security Sequence</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500/40 group-focus-within:text-red-500 transition-colors" size={20} />
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="pl-16 pr-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs font-black uppercase tracking-widest flex items-center gap-4 italic"
                        >
                            <Shield size={18} className="shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <motion.button 
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit" 
                        className="btn-primary mt-8 py-8 font-black text-2xl uppercase tracking-tighter italic flex items-center justify-center gap-5 shadow-[0_30px_60px_rgba(239,68,68,0.3)] border border-white/10 bg-gradient-to-r from-red-600 to-red-800"
                    >
                        Initialize Port <ArrowRight size={32} className="animate-pulse" />
                    </motion.button>

                    <div className="flex items-center gap-6 mt-6 opacity-20">
                        <Star size={10} className="text-white" fill="currentColor" />
                        <div className="flex-1 h-px bg-white"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Join Registry</span>
                        <div className="flex-1 h-px bg-white"></div>
                        <Star size={10} className="text-white" fill="currentColor" />
                    </div>

                    <p className="text-center text-xs font-black uppercase tracking-widest opacity-60">
                        New Entity identified? <Link to="/signup" className="text-red-500 hover:text-white transition-all underline underline-offset-8 decoration-red-500/20 hover:decoration-red-500 italic">Provision Identity</Link>
                    </p>
                </form>
            </motion.div>

            <div className="fixed bottom-10 left-12 flex flex-col gap-1 opacity-20">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white italic">Vault OS v4.0.2</span>
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em]">Kernel: DRF-REACT-102</span>
            </div>
        </div>
    );
};

export default Login;

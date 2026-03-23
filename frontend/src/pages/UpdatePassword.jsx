import { useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        try {
            await api.post('update-password/', {
                old_password: oldPassword,
                new_password: newPassword
            });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || err.response?.data?.new_password?.[0] || 'Failed to update password' 
            });
        }
    };

    return (
        <div className="max-layout py-24 sm:py-32 animate-fade flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="glass p-16 w-full max-w-xl relative overflow-hidden border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
                <div className="absolute right-0 top-0 p-16 opacity-5 -rotate-12 translate-x-1/4 -translate-y-1/4">
                    <KeyRound size={240} />
                </div>

                <div className="flex flex-col items-center mb-16 relative z-10 text-center">
                    <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-8 bg-gradient-to-br from-red-600 via-red-500 to-rose-700 rounded-[2.5rem] mb-10 shadow-2xl group"
                    >
                        <KeyRound size={48} className="text-white relative z-10" />
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-[2.5rem] transition-opacity"></div>
                    </motion.div>
                    <h1 className="text-5xl sm:text-6xl font-black tracking-[-0.05em] text-white uppercase italic font-display leading-tight">
                        Security <span className="text-red-500">Portal</span>
                    </h1>
                    <p className="text-text-muted mt-4 font-medium tracking-[0.3em] text-[10px] uppercase opacity-40 italic">
                        Enhance your account security by choosing a strong password.
                    </p>
                </div>

                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-6 rounded-2xl mb-12 flex items-center gap-5 backdrop-blur-3xl border relative z-10 ${
                            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
                        <span className="text-xs font-black uppercase tracking-[0.2em] italic">{message.text}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-10 relative z-10">
                    <div className="flex flex-col gap-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/40 ml-2 italic">Current Sequence</label>
                        <input 
                            type="password" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)} 
                            required 
                            className="w-full px-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem]"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 ml-2 italic">New Sequence</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                            minLength={8}
                            className="w-full px-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem]"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 ml-2 italic">Confirm Sequence</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            className="w-full px-8 py-6 bg-black/40 border-white/5 focus:bg-black/60 text-xl transition-all rounded-[1.5rem]"
                            placeholder="••••••••"
                        />
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit" 
                        className="btn-primary mt-4 py-8 font-black text-2xl uppercase tracking-tighter italic shadow-[0_30px_60px_rgba(239,68,68,0.3)] border border-white/10 bg-gradient-to-r from-red-600 to-red-800"
                    >
                        Update Protocol
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdatePassword;

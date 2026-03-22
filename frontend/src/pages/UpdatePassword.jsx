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
        <div className="p-4 flex items-center justify-center min-h-[80vh] animate-fade">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 rounded-full bg-primary/20 text-primary mb-4">
                        <KeyRound size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">Update Password</h1>
                    <p className="text-text-muted text-sm text-center mt-2">
                        Enhance your account security by choosing a strong password.
                    </p>
                </div>

                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
                            message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-sm">{message.text}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-muted">Current Password</label>
                        <input 
                            type="password" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-muted">New Password</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                            minLength={8}
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-muted">Confirm New Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary mt-2">Update Password</button>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdatePassword;

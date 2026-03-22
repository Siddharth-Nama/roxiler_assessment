import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

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
            setErrors(err.response?.data || { message: 'Signup failed' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 w-full max-w-xl"
            >
                <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-text-muted">Username</label>
                        <input name="username" onChange={handleChange} required />
                        {errors.username && <span className="text-xs text-red-400">{errors.username[0]}</span>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-text-muted">Name (20-60 chars)</label>
                        <input name="name" onChange={handleChange} required minLength={20} maxLength={60} />
                        {errors.name && <span className="text-xs text-red-400">{errors.name[0]}</span>}
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-sm text-text-muted">Email</label>
                        <input name="email" type="email" onChange={handleChange} required />
                        {errors.email && <span className="text-xs text-red-400">{errors.email[0]}</span>}
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-sm text-text-muted">Address (Max 400 chars)</label>
                        <textarea name="address" onChange={handleChange} required maxLength={400} />
                        {errors.address && <span className="text-xs text-red-400">{errors.address[0]}</span>}
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-sm text-text-muted">Password (8-16 chars, 1 Upper, 1 Special)</label>
                        <input name="password" type="password" onChange={handleChange} required minLength={8} maxLength={16} />
                        {errors.password && <span className="text-xs text-red-400">{errors.password[0]}</span>}
                    </div>
                    <button type="submit" className="btn-primary md:col-span-2 mt-4">Sign Up</button>
                    <p className="text-center text-sm text-text-muted md:col-span-2 mt-2">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthQuadrant = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await login(formData.email, formData.email, formData.password);
            if (data.message && data.message.includes('✅')) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify({ email: formData.email }));
                navigate('/dashboard');
            } else {
                setError(data.error || data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Connection failed. Please verify your network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#1c1f26] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl w-full max-w-[480px]">
            <div className="mb-8 overflow-hidden">
                <h2 className="text-[28px] font-bold text-white mb-2 tracking-tight">
                    Welcome Back
                </h2>
                <p className="text-slate-500 text-[14px]">
                    Log in to your organization account.
                </p>
            </div>

            <AnimatePresence mode="wait">
                <motion.form
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-600" />
                        <Input
                            type="email"
                            name="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="pl-12 bg-[#131517] border-white/5 text-white focus:border-[#26A69A]/50 focus:ring-0 h-14 rounded-xl placeholder:text-slate-600 text-[15px]"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-600" />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="pl-12 bg-[#131517] border-white/5 text-white focus:border-[#26A69A]/50 focus:ring-0 h-14 rounded-xl placeholder:text-slate-600 text-[15px]"
                        />
                    </div>

                    {error && (
                        <div className="text-[12px] font-medium text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-[#26A69A] hover:bg-[#208a80] text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(38,166,154,0.2)] transition-all mt-4 text-[15px]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" />
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </motion.form>
            </AnimatePresence>
        </div>
    );
};

export default AuthQuadrant;

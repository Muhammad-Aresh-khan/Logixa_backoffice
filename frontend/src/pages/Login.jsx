import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogixaLogo from '../components/LogixaLogo';
import AuthQuadrant from '../components/AuthQuadrant';
import loginBg from '../assets/login_bg.jpg';

const Login = () => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Ensure background is consistent with the mockup
        document.body.style.backgroundColor = '#16181d';
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden selection:bg-[#26A69A]/30">
            {/* Left Section (Branding Hub) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative flex-1 bg-[#0a0b0d] flex items-center justify-center p-12 border-b md:border-b-0 md:border-r border-white/5 cursor-default overflow-hidden"
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 opacity-40"
                    style={{
                        backgroundImage: `url(${loginBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />

                {/* Aesthetic Green Gradient Background */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 0.35, scale: 1.15 }}
                            exit={{ opacity: 0, scale: 1.25 }}
                            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#26A69A_0%,_transparent_75%)] blur-[120px] pointer-events-none z-1"
                        />
                    )}
                </AnimatePresence>

                <div className="relative z-10 w-full flex justify-center transition-transform duration-700">
                    <LogixaLogo className="transition-all duration-700 hover:drop-shadow-[0_0_50px_rgba(38,166,154,0.5)] hover:scale-105" />
                </div>
            </motion.div>

            {/* Right Section (Action Hub) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-[1.2] bg-[#16181d] flex items-center justify-center p-8 relative"
            >
                <div className="w-full max-w-lg relative z-10">
                    <AuthQuadrant />
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

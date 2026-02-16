import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hover = true }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -5 } : {}}
            className={`
        bg-[#24282D]/80 backdrop-blur-xl border border-[#31373E] rounded-2xl p-6
        transition-all duration-300
        ${hover ? 'hover:border-[#26A69A]/50 hover:shadow-[0_0_20px_rgba(38,166,154,0.1)]' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;

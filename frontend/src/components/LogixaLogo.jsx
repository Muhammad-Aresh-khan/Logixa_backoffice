import React from 'react';

const LogixaLogo = ({ className = "" }) => {
    return (
        <div className={`flex items-center justify-center select-none ${className}`}>
            <img
                src="/logo_logixa.png"
                alt="Logixa Logo"
                className="w-full h-auto max-w-[340px] object-contain"
                onError={(e) => {
                    console.error("Logo failed to load");
                    // Optionally fallback to a text or hidden state if needed
                }}
            />
        </div>
    );
};

export default LogixaLogo;

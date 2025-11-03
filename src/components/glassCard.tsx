
import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

const GlassCard = ({ children, className = '', delay = 0 }: any) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/20 overflow-hidden ${className}`}
            style={{
                boxShadow: isHovered
                    ? `0 0 60px rgba(102, 126, 234, 0.3), inset 0 0 60px rgba(255, 255, 255, 0.05)`
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
        >
            {isHovered && (
                <motion.div
                    className="absolute pointer-events-none"
                    style={{
                        left: mousePosition.x,
                        top: mousePosition.y,
                        width: 300,
                        height: 300,
                        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
                        transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
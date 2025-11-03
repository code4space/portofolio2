import { motion, useMotionValue, useSpring } from 'framer-motion';
import React, { useRef } from 'react';

const SocialIcon = ({ Icon, label, href }: { Icon: any; label: string; href: string }) => {
    const anchorRef = useRef<HTMLAnchorElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Ultra-responsive spring
    const springConfig = { damping: 20, stiffness: 400 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!iconRef.current) return;

        const iconRect = iconRef.current.getBoundingClientRect();
        const iconCenterX = iconRect.left + iconRect.width / 2;
        const iconCenterY = iconRect.top + iconRect.height / 2;

        // Exact offset from icon center
        const offsetX = e.clientX - iconCenterX;
        const offsetY = e.clientY - iconCenterY;

        mouseX.set(offsetX);
        mouseY.set(offsetY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.a
            ref={anchorRef}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            aria-label={label}
            className="group relative block"
        >
            {/* Floating Background Orb */}
            <motion.div
                className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 to-white/5 blur-xl scale-0 group-hover:scale-150 transition-transform duration-500"
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
            />

            {/* Icon Container */}
            <motion.div
                ref={iconRef}
                style={{
                    x,
                    y,
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
                }}
                className="relative p-5 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full 
                     hover:bg-white/25 hover:border-white/50 
                     transition-all duration-300 
                     group-hover:scale-110"
            >
                <Icon size={20} className="text-white drop-shadow-md" />
            </motion.div>

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                         pointer-events-none transition-opacity duration-300 
                         text-xs font-medium text-white bg-black/70 px-3 py-1 rounded-full whitespace-nowrap">
                {label}
            </span>
        </motion.a>
    );
};

export default SocialIcon;
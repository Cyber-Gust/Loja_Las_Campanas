'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Marquee = ({ children, backgroundColor, textColor, className = '' }) => {
  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className={`w-full overflow-hidden ${backgroundColor} ${textColor} ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        variants={marqueeVariants}
        animate="animate"
      >
        <span className="py-2 inline-block">{children}</span>
        <span className="py-2 inline-block">{children}</span>
        <span className="py-2 inline-block">{children}</span>
        <span className="py-2 inline-block">{children}</span>
      </motion.div>
    </div>
  );
};

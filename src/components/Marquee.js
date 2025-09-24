'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Marquee = ({ children, backgroundColor, textColor, className = '', speed = 50 }) => {
  // 1. Hooks para medir o elemento
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  // 2. Mede o elemento quando ele é montado no DOM
  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
  }, [children]); // Re-calcula se o conteúdo mudar

  // 3. Calcula a duração da animação baseada na largura para ter uma velocidade constante
  const duration = contentWidth / speed;

  // 4. Atualiza a animação para usar a largura real do conteúdo
  const marqueeVariants = {
    animate: {
      x: [0, -contentWidth], // Anima da posição 0 até a largura negativa do conteúdo
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: duration, // Usa a duração dinâmica
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
        {/* Adicionamos a ref no primeiro span para medi-lo */}
        <span ref={contentRef} className="py-2 inline-block">{children}</span>
        
        {/* As cópias garantem que a transição seja suave */}
        <span className="py-2 inline-block">{children}</span>
        <span className="py-2 inline-block">{children}</span>
        <span className="py-2 inline-block">{children}</span>
        
      </motion.div>
    </div>
  );
};
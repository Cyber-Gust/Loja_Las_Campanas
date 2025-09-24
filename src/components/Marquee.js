'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Marquee = ({ children, backgroundColor, textColor, className = '', speed = 50 }) => {
    const contentRef = useRef(null);
    const [contentWidth, setContentWidth] = useState(0);

    // Usamos um ResizeObserver para medir o conteúdo de forma reativa e robusta.
    // Isso garante que a largura seja medida corretamente mesmo que imagens demorem a carregar.
    useEffect(() => {
        if (!contentRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            // Na maioria dos casos, teremos apenas uma entrada, mas iteramos por segurança.
            for (let entry of entries) {
                setContentWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(contentRef.current);

        // Limpa o observer quando o componente é desmontado para evitar memory leaks.
        return () => resizeObserver.disconnect();
    }, []); // O array de dependências vazio garante que isso rode apenas uma vez.

    // A duração da animação é calculada apenas se a largura for maior que zero para evitar divisão por zero.
    const duration = contentWidth > 0 ? contentWidth / speed : 0;

    const marqueeVariants = {
        animate: {
            x: [0, -contentWidth],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: duration,
                    ease: "linear",
                },
            },
        },
    };

    return (
        <div className={`w-full overflow-hidden flex ${backgroundColor} ${textColor} ${className}`}>
            {/* O container da animação. Usamos 'flex' no pai e 'flex-shrink-0' nos filhos
                para evitar que os itens sejam espremidos. */}
            <motion.div
                className="flex whitespace-nowrap"
                variants={marqueeVariants}
                animate="animate"
            >
                {/* O primeiro elemento é usado para medir a largura. A 'key' ajuda o React a identificá-lo. */}
                <div ref={contentRef} className="flex-shrink-0">
                    <span className="py-2 inline-block">{children}</span>
                </div>

                {/* As cópias garantem que a transição seja suave e sem espaços vazios.
                    Aumentamos o número de cópias para cobrir telas muito largas com conteúdo curto. */}
                <div className="flex-shrink-0"><span className="py-2 inline-block">{children}</span></div>
                <div className="flex-shrink-0"><span className="py-2 inline-block">{children}</span></div>
                <div className="flex-shrink-0"><span className="py-2 inline-block">{children}</span></div>
                <div className="flex-shrink-0"><span className="py-2 inline-block">{children}</span></div>
            </motion.div>
        </div>
    );
};


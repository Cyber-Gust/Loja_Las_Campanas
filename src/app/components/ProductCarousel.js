'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard'; // Importação do componente externo

// --- COMPONENTE PRINCIPAL DO CARROSSEL (LÓGICA CORRIGIDA) ---
export default function ProductCarousel({ title, products }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);

    // Efeito para avançar o carrossel automaticamente
    useEffect(() => {
        // Adicionamos uma guarda para não iniciar o intervalo se não houver produtos
        if (!products || products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => prevIndex + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, [products]); // Adicionamos 'products' como dependência

    // Efeito para "teleportar" do final para o início sem animação
    useEffect(() => {
        if (!products || products.length === 0) return;

        if (currentIndex >= products.length) {
            const timer = setTimeout(() => {
                setIsTransitionEnabled(false);
                setCurrentIndex(0);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, products]); // Usamos 'products' em vez de 'products.length'

    // Efeito para reativar a animação logo após o "teleporte"
    useEffect(() => {
        if (!isTransitionEnabled && currentIndex === 0) {
            const timer = setTimeout(() => {
                setIsTransitionEnabled(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitionEnabled, currentIndex]);

    // --- CORREÇÃO: O RETORNO ANTECIPADO AGORA ESTÁ DEPOIS DOS HOOKS ---
    if (!products || products.length === 0) {
        return <div className="text-center py-16">Nenhum produto encontrado.</div>
    }

    // A lógica restante do componente só é executada se houver produtos
    const extendedProducts = [...products, ...products.slice(0, 5)];
    const cardAndGapWidth = 256 + 24;
    const activeDotIndex = currentIndex % products.length;

    return (
        <section className="py-16 w-full">
            <h2 className="text-3xl font-bold text-center mb-8 text-zinc-800">{title}</h2>
            <div className="relative overflow-hidden">
                <motion.div
                    className="flex gap-6 px-4"
                    animate={{ x: `-${currentIndex * cardAndGapWidth}px` }}
                    transition={isTransitionEnabled ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0 }}
                >
                    {extendedProducts.map((product, index) => (
                        <ProductCard key={`${product.id}-${index}`} product={product} />
                    ))}
                </motion.div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(products.length / 1) }).slice(0, 5).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${activeDotIndex === index ? 'bg-orange-500' : 'bg-zinc-300'}`}
                    />
                ))}
            </div>
        </section>
    );
};

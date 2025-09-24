'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // --- 1. Importando o componente Image ---

const ProductCard = ({ product }) => {
    const price = product.variants[0]?.price || '0.00';
    const imageUrl = product.images[0]?.src || 'https://placehold.co/400x500/1a1a1a/orange?text=Produto';
    const productName = product.name.pt || "Nome do Produto";

    return (
        <div className="flex-shrink-0 w-64 md:w-72 snap-center group">
            <div className="relative overflow-hidden rounded-lg bg-zinc-200 aspect-[4/5]">
                <Image 
                    src={imageUrl} 
                    alt={productName} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white font-bold py-2 px-6 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    Ver Produto
                </button>
            </div>
            <div className="mt-4 text-center">
                <h3 className="font-semibold text-zinc-800">{productName}</h3>
                <p className="text-zinc-600">R$ {price}</p>
            </div>
        </div>
    );
};

// A mudança está aqui: trocamos 'export const' por 'export default function'
export default function ProductCarousel({ title, products }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (products.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % products.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [products.length]);

    if (!products || products.length === 0) {
        return <div className="text-center py-16">Nenhum produto encontrado.</div>
    }

    return (
        <section className="py-16 w-full">
            <h2 className="text-3xl font-bold text-center mb-8 text-zinc-800">{title}</h2>
            <div className="relative overflow-hidden">
                <motion.div
                    className="flex gap-6 px-4"
                    animate={{ x: `-${currentIndex * (256 + 24)}px` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </motion.div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: Math.ceil(products.length / 1) }).slice(0, 5).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-orange-500' : 'bg-zinc-300'}`}
                    />
                ))}
            </div>
        </section>
    );
};


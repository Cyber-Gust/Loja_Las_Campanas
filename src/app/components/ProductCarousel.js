'use client'; 

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // <-- 1. IMPORTADO O COMPONENTE IMAGE

// O Card de Produto é usado apenas pelo Carrossel, então faz sentido mantê-lo aqui.
const ProductCard = ({ product }) => {
    const price = product.variants[0]?.price || '0.00';
    const imageUrl = product.images[0]?.src || 'https://placehold.co/400x500/1a1a1a/orange?text=Produto';
    const productName = product.name?.pt || 'Nome Indisponível';

    return (
        <div className="flex-shrink-0 w-64 md:w-72 snap-center group">
            <div className="relative overflow-hidden rounded-lg bg-zinc-200 aspect-[4/5]">
                {/* --- 2. AQUI ESTÁ A MUDANÇA --- */}
                <Image 
                    src={imageUrl} 
                    alt={productName} 
                    width={400}  // 3. Adicionado width
                    height={500} // 4. Adicionado height
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                {/* --------------------------- */}
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


export default function ProductCarousel({ title, products }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!products || products.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % products.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [products]);

    if (!products || products.length === 0) {
        return (
            <section className="py-16 w-full">
                <h2 className="text-3xl font-bold text-center mb-8 text-zinc-800">{title}</h2>
                <div className="text-center py-10 bg-zinc-100 rounded-lg">
                    <p>Nenhum produto encontrado nesta categoria no momento.</p>
                </div>
            </section>
        );
    }
    
    const numPages = products.length;

    return (
        <section className="py-16 w-full">
            <h2 className="text-3xl font-bold text-center mb-8 text-zinc-800">{title}</h2>
            <div className="relative overflow-hidden">
                <motion.div
                    className="flex gap-6 px-4"
                    animate={{ x: `-${currentIndex * (256 + 24)}px` }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </motion.div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: numPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            currentIndex === index ? 'bg-orange-500' : 'bg-zinc-300 hover:bg-zinc-400'
                        }`}
                        aria-label={`Ir para o item ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
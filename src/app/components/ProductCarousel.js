'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart } from 'lucide-react';

// --- COMPONENTE PRODUCTCARD (SEM ALTERAÇÕES) ---
const ProductCard = ({ product }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const price = product.variants[0]?.price || '0.00';
    const imageUrl = product.images[0]?.src || 'https://placehold.co/400x500/1a1a1a/orange?text=Produto';
    const productName = product.name.pt || "Nome do Produto";
    const categoryName = product.categories?.[0]?.name?.pt || 'Sem categoria';

    return (
        <div className="flex-shrink-0 w-64 md:w-72 snap-center group">
            <div className="relative overflow-hidden bg-zinc-200 rounded-t-2xl rounded-b-lg aspect-[4/5]">
                <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white/60 rounded-full backdrop-blur-sm hover:bg-white/80 transition-colors"
                    aria-label="Adicionar aos favoritos"
                >
                    <Heart
                        className={`text-orange-500 transition-all duration-200 ${
                            isFavorited ? 'fill-orange-500' : 'fill-transparent'
                        }`}
                        size={20}
                    />
                </button>
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
            <div className="mt-4 text-left px-1">
                <p className="font-bold text-lg text-zinc-800">R$ {price}</p>
                <h3 className="text-zinc-700 mt-1">{productName}</h3>
                <p className="text-sm text-zinc-500 capitalize">{categoryName}</p>
            </div>
        </div>
    );
};

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


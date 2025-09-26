'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import Link from 'next/link';

// --- FUNÇÕES AUXILIARES PARA GERENCIAR O LOCALSTORAGE ---
const getFavorites = () => {
    try {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (e) {
        console.error("Failed to load favorites from localStorage", e);
        return [];
    }
};

const setFavorites = (favorites) => {
    try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {
        console.error("Failed to save favorites to localStorage", e);
    }
};

// --- COMPONENTE PRODUCTCARD ATUALIZADO ---
const ProductCard = ({ product }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const price = product.variants[0]?.price || '0.00';
    const imageUrl = product.images[0]?.src || 'https://placehold.co/400x500/1a1a1a/orange?text=Produto';
    const productName = product.name.pt || "Nome do Produto";
    const categoryName = product.categories?.[0]?.name?.pt || 'Sem categoria';

    // Checa o localStorage para definir o estado inicial do favorito
    useEffect(() => {
        const favorites = getFavorites();
        const found = favorites.some(fav => fav.id === product.id);
        setIsFavorited(found);
    }, [product.id]);

    const handleToggleFavorite = (event) => {
        // Previne a navegação ao clicar no ícone
        event.preventDefault();
        event.stopPropagation();
        
        const favorites = getFavorites();
        const productIndex = favorites.findIndex(fav => fav.id === product.id);
        
        if (productIndex > -1) {
            // Se o produto já está favoritado, remove ele
            favorites.splice(productIndex, 1);
            setIsFavorited(false);
        } else {
            // Se não está, adiciona o produto à lista
            favorites.push(product);
            setIsFavorited(true);
        }
        
        setFavorites(favorites);
    };

    return (
        <Link href={`/produtos/${product.id}`} className="flex-shrink-0 w-64 md:w-72 snap-center group">
            <div className="relative overflow-hidden bg-zinc-200 rounded-t-2xl rounded-b-lg aspect-[4/5]">
                <button
                    onClick={handleToggleFavorite}
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
        </Link>
    );
};

export default ProductCard;

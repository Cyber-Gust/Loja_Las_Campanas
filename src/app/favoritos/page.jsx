'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; // O caminho pode variar, ajuste se necessário
import { Heart } from 'lucide-react';
import Link from 'next/link';

// --- FUNÇÃO AUXILIAR PARA PEGAR FAVORITOS DO LOCALSTORAGE ---
const getFavorites = () => {
    try {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (e) {
        console.error("Failed to load favorites from localStorage", e);
        return [];
    }
};

export default function FavoritosPage() {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Carrega a lista de favoritos do localStorage no momento que a página é montada
        const favorites = getFavorites();
        setFavoriteProducts(favorites);
        setIsLoading(false);
    }, []);

    // Se a página estiver carregando, podemos mostrar um loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-lg font-semibold text-zinc-600">Carregando seus favoritos...</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-black text-center mb-12 text-zinc-900 uppercase">
                Meus Favoritos
            </h1>

            {favoriteProducts.length > 0 ? (
                // Se houver favoritos, mostra o grid de produtos
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {favoriteProducts.map((product) => (
                        // Passamos o produto completo, que foi salvo no localStorage
                        <div key={product.id} className="col-span-1">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                // Se a lista estiver vazia, mostra uma mensagem amigável
                <div className="flex flex-col items-center justify-center text-center p-16 bg-zinc-100 rounded-xl shadow-inner max-w-2xl mx-auto">
                    <Heart size={80} className="text-orange-500 mb-6 animate-pulse" />
                    <h2 className="text-2xl font-bold mb-4 text-zinc-800">
                        Sua lista de favoritos está vazia!
                    </h2>
                    <p className="text-zinc-600 mb-6">
                        Explore nossa loja e adicione os produtos que você mais gosta.
                    </p>
                    <Link href="/" className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-colors">
                        Comece a Explorar
                    </Link>
                </div>
            )}
        </div>
    );
}

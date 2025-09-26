'use client';

import { useState } from 'react';
import ProductCard from '../../../components/ProductCard'; // Certifique-se de que este componente existe
import { Heart, SlidersHorizontal, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CategoryClientView({ initialProducts, categoryTitle }) {
    const [products, setProducts] = useState(initialProducts);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Lógica de filtro aqui (ex: tamanho, cor, etc.)
    // Por enquanto, esta função apenas retorna os produtos originais
    const applyFilters = () => {
        // Exemplo: se você tivesse filtros por tamanho ou cor, a lógica iria aqui
        setProducts(initialProducts);
        setIsFilterOpen(false);
    };

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center text-zinc-600">
                <p className="text-2xl font-bold">Nenhum produto encontrado nesta categoria.</p>
                <p className="mt-2 text-lg">Tente voltar mais tarde ou explore outras categorias.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-zinc-800">{categoryTitle}</h1>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors"
                >
                    <SlidersHorizontal size={24} />
                </button>
            </div>

            {/* Modal de Filtros (simples) */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-zinc-100 p-6 rounded-xl shadow-md mb-6"
                    >
                        <h2 className="text-xl font-bold text-zinc-800 mb-4">Filtrar Produtos</h2>
                        <p className="text-sm text-zinc-500 mb-4">Em construção: futuros filtros (tamanho, cor, preço) aparecerão aqui.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={applyFilters}
                                className="bg-orange-500 text-white py-2 px-6 rounded-full font-bold hover:bg-orange-600 transition-colors"
                            >
                                Aplicar
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

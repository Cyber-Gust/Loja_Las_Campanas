'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

// Função para buscar o carrinho do localStorage
const getCart = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error("Failed to load cart from localStorage", e);
        return [];
    }
};

// 🚨 ATUALIZAÇÃO: Recebendo as props de variação
const CartModal = ({ isOpen, onClose, product, quantity, selectedSize, selectedColor }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setCartItems(getCart());
        }
    }, [isOpen]);

    const calculateTotal = () => {
        // Usa o preço salvo na variante do item no carrinho (item.price)
        return cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0) * item.quantity, 0).toFixed(2);
    };

    // 🚨 ATUALIZAÇÃO: Encontra o item EXATO que acabou de ser adicionado para exibir
    const addedItem = cartItems.find(item => 
        item.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
    ) || { 
        imageSrc: product.images[0]?.src, 
        price: product.variants?.[0]?.price || '0.00' 
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                    aria-label="Fechar modal"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center mb-6">
                    <ShoppingBag size={24} className="text-orange-500 mr-2" />
                    <h2 className="text-2xl font-bold text-zinc-800">Item Adicionado ao Carrinho</h2>
                </div>

                {/* Produto Adicionado (Agora com a imagem da variação) */}
                <div className="flex items-center gap-4 border-b pb-4 mb-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                            // 🚨 ATUALIZAÇÃO: Usa a imagem da variante
                            src={addedItem.imageSrc || 'https://placehold.co/80x80'}
                            alt={product.name.pt}
                            fill
                            sizes="80px"
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-zinc-800">{product.name.pt}</h3>
                        <p className="text-zinc-600 text-sm mt-1">
                            {quantity} x R$ {parseFloat(addedItem.price).toFixed(2)}
                        </p>
                        {/* 🚨 NOVO: Exibe as variações */}
                        <p className="text-zinc-500 text-xs mt-1">
                            {selectedSize && `Tamanho: ${selectedSize}`}
                            {selectedSize && selectedColor && ' | '}
                            {selectedColor && `Cor: ${selectedColor}`}
                        </p>
                    </div>
                </div>

                {/* Resumo do Carrinho */}
                <div className="mb-6">
                    <h4 className="font-bold text-zinc-800 mb-2">Seu Carrinho ({cartItems.length} Itens)</h4>
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Subtotal:</span>
                        <span>R$ {calculateTotal()}</span>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-4">
                    <Link href="/carrinho" onClick={onClose} passHref>
                        <button className="w-full bg-orange-500 text-white py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
                            Ver Carrinho e Finalizar
                        </button>
                    </Link>
                    <button onClick={onClose} className="w-full bg-transparent text-zinc-600 py-3 rounded-full font-semibold border border-zinc-300 hover:bg-zinc-100 transition-colors">
                        Continuar Comprando
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default CartModal;
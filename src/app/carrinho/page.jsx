'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
// Importamos as funções de utilitário do carrinho
import { getCart, removeFromCart, updateItemQuantity, clearCart } from '../utils/cart';
import { ShoppingBag, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CarrinhoPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        // Garantimos que o carrinho está atualizado ao carregar a página
        setCartItems(getCart());
    }, []);

    // 🚨 AJUSTE: O cálculo do total usa item.price (o preço da variante)
    const total = cartItems.reduce((acc, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        return acc + (itemPrice * item.quantity);
    }, 0);

    // 🚨 AJUSTE: Inclui itemColor para remover o item correto
    const handleRemoveItem = (itemId, itemSize, itemColor) => {
        removeFromCart(itemId, itemSize, itemColor);
        setCartItems(getCart());
    };

    // 🚨 AJUSTE: Inclui itemColor para atualizar a quantidade do item correto
    const handleUpdateQuantity = (itemId, itemSize, itemColor, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId, itemSize, itemColor);
        } else {
            updateItemQuantity(itemId, itemSize, itemColor, newQuantity);
            setCartItems(getCart());
        }
    };

    // --- Integração NuvemShop: Cria o link de checkout e redireciona ---
    const redirectToNuvemShopCheckout = () => {
        if (cartItems.length === 0) return;

        setLoading(true);
        
        // 1. Constrói o formato de lista de produtos para o checkout
        // Formato esperado pela maioria das plataformas: /variantId:quantidade/variantId_2:quantidade_2
        const productSegments = cartItems.map(item => 
            `${item.variantId}:${item.quantity}`
        ).join('/');
        
        // 🚨 IMPORTANTE: Substitua 'SUA-LOJA-NUVEMSHOP' pela URL real da sua loja.
        const finalUrl = `https://SUA-LOJA-NUVEMSHOP.nuvemshop.com.br/checkout/carrinho/adicionar/${productSegments}`; 

        // 2. Redireciona o usuário para o checkout da plataforma
        // Isso transfere o controle de volta para a NuvemShop para pagamento e frete.
        window.location.href = finalUrl;
        
        // Fallback de segurança caso o redirecionamento demore ou falhe
        setTimeout(() => setLoading(false), 3000); 
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center text-zinc-600">
                <ShoppingBag size={64} className="mx-auto text-zinc-400 mb-4" />
                <h1 className="text-2xl font-bold">Seu carrinho está vazio.</h1>
                <p className="mt-2 text-lg">Comece a comprar para adicionar itens.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* O passo 'checkout' foi removido, pois usaremos o redirecionamento */}
            <motion.div
                key="cart"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-3xl font-bold text-zinc-800 mb-8">Meu Carrinho</h1>
                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <div 
                            // 🚨 AJUSTE: Chave única deve incluir ID, Tamanho e Cor
                            key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} 
                            className="flex items-center gap-4 bg-zinc-50 p-4 rounded-xl shadow-md"
                        >
                            <Image
                                // 🚨 AJUSTE: Usa a imagem da variante salva (item.imageSrc)
                                src={item.imageSrc || 'https://placehold.co/80x100/1a1a1a/orange?text=Produto'}
                                alt={item.name.pt}
                                width={80}
                                height={100}
                                className="rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h2 className="font-semibold text-lg text-zinc-800">{item.name.pt}</h2>
                                <div className="text-sm text-zinc-500">
                                    {/* 🚨 AJUSTE: Exibe as duas variações */}
                                    {item.selectedSize && `Tamanho: ${item.selectedSize}`}
                                    {item.selectedColor && (
                                        <>
                                            {item.selectedSize ? ' | ' : ''}
                                            Cor: {item.selectedColor}
                                        </>
                                    )}
                                </div>
                                <p className="font-bold text-zinc-700 mt-1">R$ {parseFloat(item.price).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    // 🚨 AJUSTE: Passa a cor para o utilitário
                                    onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                    className="bg-zinc-200 text-zinc-700 w-8 h-8 rounded-full hover:bg-zinc-300 transition-colors"
                                >
                                    -
                                </button>
                                <span className="font-semibold text-zinc-800 w-6 text-center">{item.quantity}</span>
                                <button
                                    // 🚨 AJUSTE: Passa a cor para o utilitário
                                    onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                    className="bg-zinc-200 text-zinc-700 w-8 h-8 rounded-full hover:bg-zinc-300 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <button 
                                // 🚨 AJUSTE: Passa a cor para o utilitário
                                onClick={() => handleRemoveItem(item.id, item.selectedSize, item.selectedColor)} 
                                className="text-zinc-400 hover:text-red-500 transition-colors ml-4"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-right font-bold text-2xl text-zinc-800">
                    Total: R$ {total.toFixed(2)}
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={redirectToNuvemShopCheckout}
                        disabled={loading}
                        className="bg-orange-500 text-white py-3 px-8 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-md disabled:bg-gray-400"
                    >
                        {loading ? 'Redirecionando...' : 'Finalizar Compra'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
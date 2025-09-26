'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getCart, removeFromCart, updateItemQuantity, clearCart } from '../utils/cart';
import { ShoppingBag, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CarrinhoPage() {
    const [cartItems, setCartItems] = useState([]);
    const [step, setStep] = useState('cart'); // 'cart' ou 'checkout'

    useEffect(() => {
        setCartItems(getCart());
    }, []);

    const total = cartItems.reduce((acc, item) => {
        const itemPrice = parseFloat(item.variants?.[0]?.price) || 0;
        return acc + (itemPrice * item.quantity);
    }, 0);

    const handleRemoveItem = (itemId, itemSize) => {
        removeFromCart(itemId, itemSize);
        setCartItems(getCart());
    };

    const handleUpdateQuantity = (itemId, itemSize, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId, itemSize);
        } else {
            updateItemQuantity(itemId, itemSize, newQuantity);
            setCartItems(getCart());
        }
    };

    const handleCheckout = () => {
        setStep('checkout');
    };

    const handlePlaceOrder = () => {
        alert('Pedido realizado com sucesso!');
        clearCart();
        setCartItems([]);
        setStep('cart');
    };

    if (cartItems.length === 0 && step === 'cart') {
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
            <AnimatePresence mode="wait">
                {step === 'cart' && (
                    <motion.div
                        key="cart"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold text-zinc-800 mb-8">Meu Carrinho</h1>
                        <div className="space-y-6">
                            {cartItems.map((item, index) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4 bg-zinc-50 p-4 rounded-xl shadow-md">
                                    <Image
                                        src={item.images[0]?.src || 'https://placehold.co/100x120/1a1a1a/orange?text=Produto'}
                                        alt={item.name.pt}
                                        width={80}
                                        height={100}
                                        className="rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h2 className="font-semibold text-lg text-zinc-800">{item.name.pt}</h2>
                                        {item.selectedSize && (
                                            <p className="text-sm text-zinc-500">Tamanho: {item.selectedSize}</p>
                                        )}
                                        <p className="font-bold text-zinc-700 mt-1">R$ {parseFloat(item.variants?.[0]?.price).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                            className="bg-zinc-200 text-zinc-700 w-8 h-8 rounded-full hover:bg-zinc-300 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="font-semibold text-zinc-800 w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                            className="bg-zinc-200 text-zinc-700 w-8 h-8 rounded-full hover:bg-zinc-300 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.id, item.selectedSize)} className="text-zinc-400 hover:text-red-500 transition-colors ml-4">
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
                                onClick={handleCheckout}
                                className="bg-orange-500 text-white py-3 px-8 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-md"
                            >
                                Ir para o Checkout
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'checkout' && (
                    <motion.div
                        key="checkout"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-3xl font-bold text-zinc-800 mb-8">Checkout</h1>
                        <div className="bg-zinc-50 p-8 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold text-zinc-700 mb-4">Informações de Envio</h2>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-zinc-700">Nome Completo</label>
                                    <input type="text" id="name" className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-zinc-700">Email</label>
                                    <input type="email" id="email" className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" required />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-semibold text-zinc-700">Endereço</label>
                                    <input type="text" id="address" className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" required />
                                </div>
                            </form>
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-zinc-700 mb-4">Resumo do Pedido</h2>
                                <div className="space-y-2">
                                    {cartItems.map(item => (
                                        <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-zinc-600 text-sm">
                                            <span>{item.name.pt} ({item.quantity})</span>
                                            <span>R$ {(parseFloat(item.variants?.[0]?.price) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-bold text-lg text-zinc-800 border-t pt-2 mt-2">
                                        <span>Total</span>
                                        <span>R$ {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <button
                                    onClick={() => setStep('cart')}
                                    className="flex-1 bg-zinc-200 text-zinc-700 py-3 px-6 rounded-full font-bold text-lg hover:bg-zinc-300 transition-colors"
                                >
                                    Voltar para o Carrinho
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-md"
                                >
                                    Finalizar Pedido
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

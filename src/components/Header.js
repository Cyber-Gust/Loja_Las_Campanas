'use client'; // A diretiva deve ser a primeira linha do arquivo

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Heart } from 'lucide-react';
// Supondo que o componente Marquee está no mesmo diretório
import { Marquee } from './Marquee';
import { getCart } from '../app/utils/cart';

const LgndFlagIcon = () => (
  <Image
    src="/logo.png"
    alt="Ícone da Legendarios"
    width={230}
    height={150}
    className="h-auto w-auto" // Permite que a imagem se ajuste mantendo a proporção
  />
);

const mockCategories = ["Masculino", "Feminino", "Infantil", "Acessorios", "Patchs"];

const TopBanner = () => (
    <Marquee backgroundColor="bg-[#fb3a01]" textColor="text-white" className="font-semibold text-sm">
        <div className="w-max flex items-center">
            <span className="mx-8">APROVEITE AS PROMOÇÕES DA LOJA</span>
            <span className="mx-8">FRETE GRÁTIS ACIMA DE R$250</span>
            <span className="mx-8">COMPRE AGORA E PARCELE EM ATÉ 10X</span>
        </div>
    </Marquee>
);

const MainHeader = () => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Função para atualizar o contador
        const updateCartCount = () => {
            const cart = getCart();
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(count);
        };

        // Atualiza a contagem inicial
        updateCartCount();

        // Adiciona um listener para o evento de armazenamento para atualizar a contagem entre abas
        window.addEventListener('storage', updateCartCount);

        // Limpa o listener ao desmontar o componente
        return () => {
            window.removeEventListener('storage', updateCartCount);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-zinc-800 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
                
                {/* Logo */}
                <div>
                    <Link className='pt-4' href="/" >
                        <LgndFlagIcon />
                    </Link>
                </div>

                {/* Barra de Pesquisa */}
                <div className="relative mr-36 flex-1 max-w-lg hidden md:block">
                    <input
                        type="text"
                        placeholder="O que você está procurando?"
                        className="w-full bg-zinc-700 text-white placeholder-zinc-400 rounded-full py-2 px-5 focus:outline-none focus:ring-2 focus:ring-[#fb3a01]"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                </div>

                {/* Ícones */}
                <div className="flex items-center">
                    {/* Ícone de Favoritos */}
                    <Link 
                        href="/favoritos" 
                        className="relative p-2 rounded-full hover:bg-zinc-700 transition-colors mr-2"
                        aria-label="Ver lista de favoritos"
                    >
                        <Heart size={24} className="fill-transparent stroke-white hover:fill-[#fb3a01] hover:stroke-[#fb3a01] transition-colors" />
                    </Link>

                    {/* Ícone do Carrinho */}
                    <Link href="/carrinho" className="relative p-2 rounded-full mr-20 hover:bg-zinc-700 transition-colors">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#fb3a01] text-xs text-white flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

const NavMenu = () => (
    <nav className="bg-zinc-800 text-white border-t border-zinc-700">
        <div className="container mx-auto px-4 flex justify-center items-center">
            <ul className="flex flex-wrap justify-center space-x-4 md:space-x-8 py-3">
                {mockCategories.map(category => (
                    <li key={category}>
                        <Link href={`/categoria/${category.toLowerCase()}`} className="font-semibold uppercase text-sm tracking-wider pb-1 border-b-2 border-transparent hover:border-[#fb3a01] hover:text-[#fb3a01] transition-all duration-300">
                            {category}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
);

export default function Header() {
    return (
        <>
            <TopBanner />
            <MainHeader />
            <NavMenu />
        </>
    );
}

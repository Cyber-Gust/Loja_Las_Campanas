'use client'; // A diretiva deve ser a primeira linha do arquivo

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart } from 'lucide-react';
// Supondo que o componente Marquee está no mesmo diretório
import { Marquee } from './Marquee';

const LgndFlagIcon = () => (
  <Image
    src="/logo.png"
    alt="Ícone da Legendarios"
    width={230}
    height={150}
    className="h-auto w-auto" // Permite que a imagem se ajuste mantendo a proporção
  />
);

const mockCategories = ["Masculino", "Feminino", "Infantil", "Acessórios", "Patchs"];

const TopBanner = () => (
    <Marquee backgroundColor="bg-[#fb3a01]" textColor="text-black" className="font-semibold text-sm">
        <div className="w-max flex items-center">
            <span className="mx-8">APROVEITE AS PROMOÇÕES DA LOJA</span>
            <span className="mx-8">FRETE GRÁTIS ACIMA DE R$250</span>
            <span className="mx-8">COMPRE AGORA E PARCELE EM ATÉ 10X</span>
        </div>
    </Marquee>
);

const MainHeader = () => (
    <header className="sticky top-0 z-50 bg-zinc-800 text-white shadow-md">
        {/* MUDANÇA AQUI: Adicionado 'gap-8' para garantir um espaçamento mínimo
          entre os elementos, mesmo em telas menores.
        */}
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
            
            {/* Logo */}
            <div>
                <Link className='pt-4' href="/" >
                    <LgndFlagIcon />
                </Link>
            </div>

            {/* Barra de Pesquisa
              MUDANÇA AQUI: Removido 'mr-44' e 'w-full'. 
              Adicionado 'flex-1' para que o container da pesquisa cresça e ocupe
              o espaço disponível de forma flexível. 'max-w-xl' limita a largura
              máxima em telas grandes.
            */}
            <div className="relative mr-36 flex-1 max-w-lg hidden md:block">
                <input
                    type="text"
                    placeholder="O que você está procurando?"
                    className="w-full bg-zinc-700 text-white placeholder-zinc-400 rounded-full py-2 px-5 focus:outline-none focus:ring-2 focus:ring-[#fb3a01]"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            </div>

            {/* Ícone do Carrinho */}
            <div>
                <button className="relative p-2 rounded-full mr-20 hover:bg-zinc-700 transition-colors">
                    <ShoppingCart size={24} />
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#fb3a01] text-xs text-white flex items-center justify-center">
                        3
                    </span>
                </button>
            </div>
        </div>
    </header>
);

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
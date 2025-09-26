import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
    { name: 'Masculino', slug: 'masculino', image: '/categorias/masculino.png' },
    { name: 'Feminino', slug: 'feminino', image: '/categorias/feminino.png'},
    { name: 'Infantil', slug: 'infantil', image: '/categorias/infantil.png' },
    { name: 'Acessórios', slug: 'acessorios', image: '/categorias/acessorios.png' },
    { name: 'Patchs', slug: 'patchs', image: '/categorias/patches.png' },
];

// --- COMPONENTE DE CATEGORIA COM LINK ---
const CategoryCard = ({ category }) => (
    <Link 
        href={`/categoria/${category.slug}`}
        className="relative block h-full w-full overflow-hidden rounded-lg shadow-xl group transition-all duration-500 ease-in-out transform hover:scale-[1.01]"
    >
        {/* Imagem com efeito: P&B -> Cor e Zoom */}
        <Image
            src={category.image}
            alt={`Categoria ${category.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform  group-hover:scale-110 group-hover:saturate-150 group-hover:grayscale-0"
            style={{ objectPosition: 'center' }}
            priority={true} 
        />

        {/* Sobreposição de cor para contraste */}
        <div className="absolute inset-0 group-hover:bg-black/20 transition-all duration-500"></div>

        {/* Conteúdo (Título e Descrição) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            {/* Botão sutil de Call to Action */}
            <button className="mt-6 px-6 py-2 h-30 w-70 bg-[#fb3a01] text-white font-bold rounded-full text-sm uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                Acessar Categoria
            </button>
        </div>
    </Link>
);


// --- COMPONENTE SEM LINK PARA EFEITO VISUAL/BRANDING ---
const BrandCard = ({ image, title, subtitle }) => (
    <div 
        className="relative block h-full w-full overflow-hidden rounded-lg shadow-xl group transition-all duration-500 ease-in-out transform hover:scale-[1.01]"
    >
        <Image
            src={image}
            alt="true"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110 filter saturate-100 contrast-125"
            style={{ objectPosition: 'center' }}
        />

        {/* Sobreposição de cor para contraste */}
        <div className="absolute inset-0 group-hover:bg-black/40 transition-all duration-500"></div>

        {/* Conteúdo (Texto) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-[#fb3a01] tracking-widest drop-shadow-lg transition-transform duration-500 group-hover:scale-105">
                {title}
            </h2>
            <p className="mt-2 text-base md:text-lg text-white max-w-xs font-semibold">
                {subtitle}
            </p>
        </div>
    </div>
);


// --- ESTRUTURA DO GRID COM PROPORÇÕES VARIADAS ---
export default function CategoryGrid() {
    return (
        <section className=" mx-auto px-4 pb-14 bg-creme">
            <h1 className="text-4xl md:text-5xl font-black text-center mb-12 text-zinc-900 uppercase">
                Nossas Categorias
            </h1>
            
            {/* Grid de 3 colunas em LG, com altura de linha base de 200px */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:auto-rows-[300px]">
                
                {/* 1. MASCULINO: 2 Colunas, 1 Linha */}
                <div className="sm:col-span-2 h-[350px] lg:h-auto">
                    <CategoryCard category={categories[0]} />
                </div>
                
                {/* 2. FEMININO: 1 Coluna, 1 Linha */}
                <div className="h-[350px] lg:h-auto">
                    <CategoryCard category={categories[1]} />
                </div>

                {/* 3. NOVO BLOCO (Branding): 1 Coluna, 2 Linhas (Vertical) */}
                {/* Ele começa na Linha 2 e ocupa Coluna 3 */}
                <div className="lg:row-span-2 lg:col-start-3 lg:row-start-2 h-[620px] lg:h-auto">
                    <BrandCard 
                        
                        image="/categorias/branding.png" 
                    />
                </div>

                {/* 4. INFANTIL: 1 Coluna, 1 Linha */}
                {/* Começa na Linha 2, Coluna 1. É o primeiro elemento abaixo do Masculino */}
                <div className="h-[300px] lg:h-auto">
                    <CategoryCard category={categories[2]} />
                </div>

                {/* 5. ACESSÓRIOS: 1 Coluna, 1 Linha */}
                {/* Começa na Linha 2, Coluna 2 */}
                <div className="h-[300px] lg:h-auto">
                    <CategoryCard category={categories[3]} />
                </div>
                
                {/* 6. PATCHS: 2 Colunas, 1 Linha (Horizontal) */}
                {/* CORREÇÃO AQUI: Forçando a começar na Linha 3, Coluna 1 */}
                <div className="sm:col-span-2 lg:row-start-3 h-[300px] lg:h-auto"> 
                     <CategoryCard category={categories[4]} />
                </div>
            </div>
        </section>
    );
}
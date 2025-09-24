import React from 'react';
import { ShieldCheck, CreditCard, Truck, Instagram } from 'lucide-react';
import Image from 'next/image';
import InfoCards from './components/InfoCards'; // Importando o componente



// Importando componentes externos e o nosso novo componente de cliente
import { Marquee } from '@/components/Marquee'; // Assumindo que você tem este componente
import ProductCarousel from '@/app/components/ProductCarousel'; 
import { getProducts, getSaleProducts } from '@/lib/nuvemshop'; // Função que busca os produtos

// --- ÍCONES E COMPONENTES ESTÁTICOS DA PÁGINA ---
const LgndFlagIcon = () => (
  <Image
    src="/bandeira.png" // O caminho começa na pasta /public
    alt="Logo da Legendarios"
    width={90}   // Largura original do SVG
    height={35}  // Altura original do SVG
    className="inline-block"
  />
);

const LgndLetrasIcon = () => (
  <Image
    src="/letreiro.png" // O caminho começa na pasta /public
    alt="Letreiro da Legendarios"
    width={130}   // Largura original do SVG
    height={35}  // Altura original do SVG
    className="inline-block"
  />
);

const Hero = () => (
    <section 
        className="w-full h-[60vh] md:h-[80vh] bg-cover bg-center" 
        style={{ backgroundImage: "url('/bg_hero.jpg')" }} 
    />
);

const LegendariosMarquee = () => (
    <Marquee backgroundColor="bg-orange-500" textColor="text-white" className="font-bold text-lg tracking-widest">
        {/* Adicionado "w-max" para garantir a medição correta da largura */}
        <span className="w-max max-h-16 mx-4 flex items-center gap-x-4">
            <LgndFlagIcon />
            <span className="text-white">
              - <span className="">-</span>
            </span>
            <LgndLetrasIcon/>
            <span className="text-white">
              - <span className="">-</span>
            </span>
        </span>
    </Marquee>
);

const InstagramBanner = () => (
    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="bg-orange-500 text-white flex items-center justify-center gap-4 py-8 group transition-all duration-300 hover:bg-orange-700">
        <Instagram size={52} className="transition-transform duration-300 group-hover:scale-125 text-zinc-900"/>
        <h3 className="text-2xl font-bold tracking-wider">Siga nossa página no Instagram</h3>
    </a>
);


// --- PÁGINA PRINCIPAL (SERVER COMPONENT) ---
export default async function HomePage() {

  // 2. Os dados são preparados para serem enviados aos componentes
  const [allProducts, saleProducts] = await Promise.all([
    getProducts(),
    getSaleProducts(8) // Chamando a nova função otimizada
  ]);

  // 2. Preparamos os produtos em destaque
  const featuredProducts = allProducts.slice(0, 8);

  return (
    <>
      <Hero />
      <LegendariosMarquee />
      <InfoCards />      
      <div className="container mx-auto px-4">
        {/* 3. Os dados são passados como props para o componente de cliente */}
        <ProductCarousel title="EM DESTAQUE" products={featuredProducts} />
      </div>
      
      <InstagramBanner />
      
      <div className="container mx-auto px-4">
        <ProductCarousel title="PROMOÇÕES" products={saleProducts} />
      </div>
    </>
  );
}
import React from 'react';
import { ShieldCheck, CreditCard, Truck, Instagram } from 'lucide-react';

// Importando componentes externos e o nosso novo componente de cliente
import { Marquee } from '@/components/Marquee'; // Assumindo que você tem este componente
import ProductCarousel from '@/app/components/ProductCarousel'; 
import { getProducts } from '@/lib/nuvemshop'; // Função que busca os produtos

// --- ÍCONES E COMPONENTES ESTÁTICOS DA PÁGINA ---
const LgndFlagIcon = () => (
    <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mx-2">
        <rect width="30" height="20" rx="3" fill="black" />
        <path d="M5 5L15 15L25 5" stroke="orange" strokeWidth="2" />
    </svg>
);

const Hero = () => (
    <section 
        className="w-full h-[60vh] md:h-[80vh] bg-cover bg-center" 
        style={{ backgroundImage: "url('/bg_hero.jpg')" }} 
    />
);

const LegendariosMarquee = () => (
    <Marquee backgroundColor="bg-orange-500" textColor="text-black" className="font-bold text-lg tracking-widest">
        <span className="mx-4 flex items-center">LEGENDARIOS <LgndFlagIcon /></span>
        <span className="mx-4 flex items-center">LEGENDARIOS <LgndFlagIcon /></span>
    </Marquee>
);

const InfoCards = () => (
    <section className="py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-around items-center gap-8 text-zinc-800">
            <div className="flex items-center gap-4"><CreditCard className="text-orange-500" size={40} strokeWidth={1.5}/><span>Parcele em até 10x</span></div>
            <div className="flex items-center gap-4"><Truck className="text-orange-500" size={40} strokeWidth={1.5}/><span>Entrega em todo o Brasil</span></div>
            <div className="flex items-center gap-4"><ShieldCheck className="text-orange-500" size={40} strokeWidth={1.5}/><span>Compra 100% segura</span></div>
        </div>
    </section>
);

const InstagramBanner = () => (
    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 text-white flex items-center justify-center gap-4 py-8 group transition-all duration-300 hover:bg-black">
        <Instagram size={32} className="transition-transform duration-300 group-hover:scale-125 text-orange-500"/>
        <h3 className="text-2xl font-bold tracking-wider">Siga nossa página no Instagram</h3>
    </a>
);


// --- PÁGINA PRINCIPAL (SERVER COMPONENT) ---
export default async function HomePage() {
  
  // 1. Os produtos são buscados no servidor antes de a página ser renderizada
  const allProducts = await getProducts();

  // 2. Os dados são preparados para serem enviados aos componentes
  const featuredProducts = allProducts.slice(0, 8); // Pega os 8 primeiros como destaque
  const saleProducts = allProducts.filter(p => p.variants[0]?.promo_price > 0).slice(0, 8); // Pega 8 produtos com preço promocional

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
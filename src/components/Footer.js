// Garante que o componente pode usar hooks, mesmo que não estejamos usando agora.
'use client';

import React from 'react';
// Importando o componente de Imagem e Link do Next.js
import Image from 'next/image';
import Link from 'next/link';
// Importando ícones que vamos usar
import { Mail, Phone } from 'lucide-react';

// --- ARRAYS PARA GERENCIAR OS ÍCONES ---
// Adicione ou remova ícones facilmente alterando esta lista.
// Lembre-se de que os caminhos começam na pasta /public.
const paymentIcons = [
  { src: '/01.png', alt: 'Ícone da bandeira Visa' },
  { src: '/02.png', alt: 'Ícone da bandeira Mastercard' },
  { src: '/03.png', alt: 'Ícone da bandeira Elo' },
  { src: '/04.png', alt: 'Ícone do Pix' },
  { src: '/05.png', alt: 'Ícone da bandeira American Express' },
];

const securitySeals = [
  { src: '/sec_01.png', alt: 'Selo de Navegação Segura do Google' }
];


export default function Footer() {
    return (
        <footer className="bg-zinc-800 text-zinc-300 pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                
                {/* Coluna da Esquerda: Logo e Contatos */}
                <div className="flex flex-col items-center">
                    <Link href="/">
                        <Image
                            src="/logo_footer.png"
                            alt="Logo da sua empresa"
                            width={180}
                            height={50}
                            className="h-auto"
                        />
                    </Link>
                    <div className="mt-6 text-left">
                        <h4 className="font-bold text-[#fb3a01] mb-4 text-center">Contato</h4>
                        <a href="mailto:contato@suaempresa.com" className="flex items-center gap-2 mb-2 hover:text-[#fb3a01] transition-colors">
                            <Mail size={16} />
                            <span>contato@suaempresa.com</span>
                        </a>
                        <a href="tel:+5511999999999" className="flex items-center gap-2 hover:text-[#fb3a01] transition-colors">
                            <Phone size={16} />
                            <span>(11) 99999-9999</span>
                        </a>
                    </div>
                </div>

                {/* Coluna do Meio: Mapa do Site */}
                <div className="flex flex-col mt-10 items-center">
                    <h4 className="font-bold text-[#fb3a01] mb-4">Mapa do Site</h4>
                    <nav className="flex flex-col gap-2">
                        <Link href="/" className="hover:text-[#fb3a01] transition-colors">Início</Link>
                        <Link href="/produtos" className="hover:text-[#fb3a01] transition-colors">Produtos</Link>
                        <Link href="/sobre-nos" className="hover:text-[#fb3a01] transition-colors">Sobre Nós</Link>
                        <Link href="/contato" className="hover:text-[#fb3a01] transition-colors">Contato</Link>
                        <Link href="/politica-de-privacidade" className="hover:text-[#fb3a01] transition-colors">Política de Privacidade</Link>
                        <Link href="/termos-de-uso" className="hover:text-[#fb3a01] transition-colors">Termos de Uso</Link>
                    </nav>
                </div>

                {/* Coluna da Direita: Pagamento e Segurança */}
                <div className="flex flex-col mt-4 items-center gap-4">
                    <h4 className="font-bold text-[#fb3a01] mb-4">Formas de Pagamento</h4>
                    <div className="flex justify-center flex-wrap gap-3 mb-6">
                        {paymentIcons.map((icon) => (
                            <div key={icon.alt} className="bg-white p-1 rounded-md shadow-sm w-14 h-9 flex items-center justify-center">
                                <Image
                                    src={icon.src}
                                    alt={icon.alt}
                                    width={40}
                                    height={25}
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    <h4 className="font-bold text-[#fb3a01]">Navegação Segura</h4>
                    <div className="flex justify-center items-center">
                        {securitySeals.map((seal) => (
                             <Image
                                key={seal.alt}
                                src={seal.src}
                                alt={seal.alt}
                                width={200}
                                height={30}
                                className="object-contain"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto text-center md:flex md:justify-between text-zinc-500 text-base mt-16 border-t border-zinc-700 pt-8 px-8">
                <p className="mb-2 md:mb-0">© 2025 Las Campanas. Todos os direitos reservados.</p>
                <p>
                    Desenvolvido por <a href="https://bitbloomai.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-400 hover:text-[#fb3a01]">BitBloom AI</a>
                </p>
            </div>
        </footer>
    );
}

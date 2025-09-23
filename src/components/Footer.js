'use client';

import React from 'react';
import { MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-zinc-800 text-zinc-300 pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                {/* Esquerda: Pagamento e Segurança */}
                <div>
                    <h4 className="font-bold text-white mb-4">Pagamento e Segurança</h4>
                    <p className="mb-4">Aceitamos as principais bandeiras. Ambiente 100% seguro.</p>
                    <div className="flex justify-center md:justify-start gap-2 h-8">
                       <div className="bg-zinc-700 w-12 rounded"></div>
                       <div className="bg-zinc-700 w-12 rounded"></div>
                       <div className="bg-zinc-700 w-12 rounded"></div>
                    </div>
                </div>

                {/* Meio: Mapa */}
                <div>
                    <h4 className="font-bold text-white mb-4">Nossa Loja Física</h4>
                    <div className="bg-zinc-700 w-full h-48 rounded-lg flex items-center justify-center">
                        <MapPin className="text-zinc-500" size={40}/>
                        <p className="ml-2 text-zinc-500">Mapa da Loja</p>
                    </div>
                </div>

                {/* Direita: Logo e Contatos */}
                <div>
                    <h4 className="font-bold text-white mb-4">TOP las campanas</h4>
                    <p className="mb-2">Rua Fictícia, 123 - Bairro Imaginário</p>
                    <p>contato@legendarios.com</p>
                    <div className="flex gap-4 mt-4 justify-center md:justify-start">
                      <a href="#" className="hover:text-orange-500"><Facebook/></a>
                      <a href="#" className="hover:text-orange-500"><Instagram/></a>
                      <a href="#" className="hover:text-orange-500"><Twitter/></a>
                    </div>
                </div>
            </div>

            <div className="text-center text-zinc-500 text-sm mt-12 border-t border-zinc-700 pt-6">
                <p>© 2024 LEGENDARIOS. Todos os direitos reservados.</p>
                <p>
                    Desenvolvido por <a href="https://bitbloomai.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-zinc-400 hover:text-orange-500">BitBloom AI</a>
                </p>
            </div>
        </footer>
    );
}

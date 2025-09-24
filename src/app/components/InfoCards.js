// app/components/InfoCards.js

// 1. ATUALIZE AQUI: Adicione QrCode, remova Wallet
import { Truck, QrCode, ShieldCheck, MessageCircle } from 'lucide-react';

const InfoCards = () => (
    <section className="py-12 bg-zinc-100">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            {/* Card 1: Entrega (sem alteração) */}
            <div className="flex flex-col items-center gap-3">
                <Truck className="text-orange-500" size={48} strokeWidth={1.5} />
                <div>
                    <p className="font-bold text-zinc-800">Para todo Brasil</p>
                    <p className="text-sm text-orange-500">Via Transportadora</p>
                </div>
            </div>

            {/* 2. CÓDIGO ALTERADO AQUI */}
            <div className="flex flex-col items-center gap-3">
                <QrCode className="text-orange-500" size={48} strokeWidth={1.5} />
                <div>
                    <p className="font-bold text-zinc-800">Pague com Pix</p>
                    <p className="text-sm text-orange-500">Aprovação imediata</p>
                </div>
            </div>

            {/* Card 3: Segurança (sem alteração) */}
            <div className="flex flex-col items-center gap-3">
                <ShieldCheck className="text-orange-500" size={48} strokeWidth={1.5} />
                <div>
                    <p className="font-bold text-zinc-800">Site 100% seguro</p>
                    <p className="text-sm text-orange-500">Seus dados protegidos</p>
                </div>
            </div>

            {/* Card 4: Dúvidas (sem alteração) */}
            <div className="flex flex-col items-center gap-3">
                <MessageCircle className="text-orange-500" size={48} strokeWidth={1.5} />
                <div>
                    <p className="font-bold text-zinc-800">Ficou em dúvida?</p>
                    <p className="text-sm text-orange-500">Chame pelo Whatsapp!</p>
                </div>
            </div>

        </div>
    </section>
);

export default InfoCards;
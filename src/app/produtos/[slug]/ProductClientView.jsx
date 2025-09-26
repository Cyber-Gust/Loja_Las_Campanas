'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCarousel from '../../components/ProductCarousel';
import { AnimatePresence } from 'framer-motion';
import CartModal from '../../components/CartModal';
import { addToCart } from '../../utils/cart'; 

const getFavorites = () => {
    try {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        return [];
    }
};

const setFavorites = (favorites) => {
    try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error("Erro ao salvar favoritos:", error);
    }
};


export default function ProductClientView({ initialProduct, relatedProducts }) {
    
    const [product] = useState(initialProduct); 
    const [mainImage, setMainImage] = useState(initialProduct.images[0]?.src || 'https://placehold.co/400x500/1a1a1a/orange?text=Produto');
    const [quantity, setQuantity] = useState(1);
    const [isFavorited, setIsFavorited] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sizeOptions = product.variants
        .map(v => v?.attributes?.find(attr => attr.name === 'Tamanho')?.value)
        .filter(Boolean) 
        .filter((value, index, self) => self.indexOf(value) === index); 

    useEffect(() => {
        if (product) {
            const firstSize = sizeOptions[0];
            if (firstSize) {
                setSelectedSize(firstSize);
            }
            
            const favorites = getFavorites();
            const found = favorites.some(fav => fav.id === product.id);
            setIsFavorited(found);
        }
    }, [product, sizeOptions]);


    const handleToggleFavorite = () => {
        const favorites = getFavorites();
        const productIndex = favorites.findIndex(fav => fav.id === product.id);
        
        if (productIndex > -1) {
            favorites.splice(productIndex, 1);
            setIsFavorited(false);
        } else {
            favorites.push(product);
            setIsFavorited(true);
        }
        setFavorites(favorites);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            console.error("Selecione um tamanho para adicionar ao carrinho.");
            return;
        }
        
        const selectedVariant = product.variants.find(v => 
            v.attributes.some(attr => attr.name === 'Tamanho' && attr.value === selectedSize)
        );

        if (!selectedVariant) {
            console.error("Variante do produto não encontrada para o tamanho selecionado.");
            return;
        }

        const item = {
            ...product,
            variantId: selectedVariant.id,
            selectedSize,
            quantity
        };
        addToCart(item);
        setIsModalOpen(true);
    };

    const price = product.variants?.[0]?.price || '0.00'; 
    const parcelas = (parseFloat(price) / 3).toFixed(2);
    const productImages = product.images || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Coluna da Esquerda: Imagens */}
                <div className="lg:w-1/2">
                    <div className="relative aspect-[4/5] bg-zinc-100 rounded-2xl overflow-hidden mb-4">
                        <Image
                            src={mainImage}
                            alt={product.name.pt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto snap-x">
                        {productImages.map((img, index) => (
                            <Image
                                key={index}
                                src={img.src}
                                alt={`${product.name.pt} ${index + 1}`}
                                width={100}
                                height={125}
                                className={`rounded-lg cursor-pointer border-2 transition-colors snap-start ${
                                    mainImage === img.src ? 'border-orange-500' : 'border-transparent'
                                }`}
                                onClick={() => setMainImage(img.src)}
                            />
                        ))}
                    </div>
                </div>

                {/* Coluna da Direita: Detalhes do Produto */}
                <div className="lg:w-1/2">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-3xl font-bold text-zinc-800">{product.name.pt}</h1>
                        <button
                            onClick={handleToggleFavorite}
                            className="p-2 bg-white/60 rounded-full backdrop-blur-sm hover:bg-white/80 transition-colors"
                            aria-label="Adicionar aos favoritos"
                        >
                            <Heart
                                className={`text-orange-500 transition-all duration-200 ${
                                    isFavorited ? 'fill-orange-500' : 'fill-transparent'
                                }`}
                                size={24}
                            />
                        </button>
                    </div>

                    <p className="text-2xl font-semibold text-zinc-800 mt-2">R$ {price}</p>
                    <p className="text-zinc-600 text-sm mt-1">ou R$ {parcelas} em 3x sem juros</p>

                    {/* Variações de Tamanho */}
                    {sizeOptions.length > 0 && (
                        <div className="mt-8">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="font-bold text-zinc-700">Tamanho:</span>
                                {sizeOptions.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-2 px-4 rounded-lg font-semibold border-2 transition-all ${
                                            selectedSize === size
                                                ? 'bg-orange-500 text-white border-orange-500'
                                                : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantidade */}
                    <div className="flex items-center gap-4 mt-8">
                        <span className="font-bold text-zinc-700">Quantidade:</span>
                        <div className="flex items-center gap-2 bg-zinc-100 rounded-lg p-1">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-2 py-1 text-zinc-600 hover:text-orange-500 transition-colors font-bold"
                            >
                                -
                            </button>
                            <span className="font-semibold text-zinc-800">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-2 py-1 text-zinc-600 hover:text-orange-500 transition-colors font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedSize}
                            className={`flex-1 text-white py-3 px-6 rounded-full font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors ${
                                !selectedSize ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                        >
                            <ShoppingBag size={20} />
                            Adicionar ao Carrinho
                        </button>
                        <button
                            className="flex-1 bg-white text-orange-500 border-2 border-orange-500 py-3 px-6 rounded-full font-bold text-lg hover:bg-orange-50 transition-colors shadow-md"
                        >
                            Comprar Direto
                        </button>
                    </div>

                    {/* Descrição e Características */}
                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-zinc-800 mb-4">Descrição do Produto</h3>
                        <p className="text-zinc-600" dangerouslySetInnerHTML={{ __html: product.description.pt }}></p>
                    </div>
                </div>
            </div>

            {/* Produtos Semelhantes */}
            <div className="mt-20">
                <ProductCarousel title="Produtos Relacionados" products={relatedProducts} />
            </div>

            {/* Modal de Carrinho */}
            <AnimatePresence>
                {isModalOpen && (
                    <CartModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        product={product}
                        quantity={quantity}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

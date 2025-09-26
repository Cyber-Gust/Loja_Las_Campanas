'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag, Share2 } from 'lucide-react';
import ProductCarousel from '../../components/ProductCarousel';
import { AnimatePresence } from 'framer-motion';
import { addToCart } from '../../utils/cart';
import CartModal from '../../components/CartModal';

// --- Funções de Lógica (Mantidas e protegidas) ---

const getFavorites = () => {
    if (typeof window === 'undefined') return [];
    try {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        return [];
    }
};

const setFavorites = (favorites) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
        console.error("Erro ao salvar favoritos:", error);
    }
};

// --- Componente Principal ---

export default function ProductClientView({ initialProduct, relatedProducts }) {

    const [product] = useState(initialProduct);
    const [quantity, setQuantity] = useState(1);
    const [isFavorited, setIsFavorited] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Define a imagem principal inicial (pode ser sobrescrita no useEffect)
    const initialMainImage = product.images[0]?.src || 'https://placehold.co/400x500/1a1a1a/orange?text=Produto';
    const [mainImage, setMainImage] = useState(initialMainImage);


    // --- 1. LÓGICA DE EXTRAÇÃO DE VARIAÇÕES (usando useMemo para performance) ---
    const {
        colorAttributeIndex,
        sizeAttributeIndex,
        sizeOptions,
        colorOptions
    } = useMemo(() => {
        
        // 1. Encontrar os índices dos atributos
        const colorAttributeIndex = product.attributes.findIndex(attr => attr.pt === 'Cor' || attr.en === 'Color');
        const sizeAttributeIndex = product.attributes.findIndex(attr => attr.pt === 'Tamanho' || attr.en === 'Size');

        // 2. Mapeamento e filtragem de Tamanhos
        const sizeOptions = sizeAttributeIndex !== -1 ? product.variants
            .map(v => v.values?.[sizeAttributeIndex]?.pt)
            .filter(Boolean)
            .filter((value, index, self) => self.indexOf(value) === index)
            .sort()
            : [];

        // 3. Mapeamento de Cores e suas imagens relacionadas
        const colorOptions = colorAttributeIndex !== -1 ? product.variants
            .reduce((acc, current) => {
                const colorName = current.values?.[colorAttributeIndex]?.pt;
                
                if (colorName && !acc.some(c => c.name === colorName)) {
                    // Encontra a imagem que a variante está associada, ou usa a primeira do produto
                    const imageForColor = product.images.find(img => img.id === current.image_id);
                    acc.push({
                        name: colorName,
                        imageSrc: imageForColor?.src || product.images[0]?.src
                    });
                }
                return acc;
            }, [])
            : [];
            
        return {
            colorAttributeIndex,
            sizeAttributeIndex,
            sizeOptions,
            colorOptions
        };
    }, [product]);

    // --- 2. CÁLCULO DA VARIANTE SELECIONADA (usando useMemo para reagir ao clique) ---
    const selectedVariant = useMemo(() => {
        return product.variants.find(v => {
            const variantColor = v.values?.[colorAttributeIndex]?.pt;
            const variantSize = v.values?.[sizeAttributeIndex]?.pt;
            
            // As condições de match são simplificadas: se não houver opção, a match é sempre true.
            const colorMatch = colorOptions.length === 0 || variantColor === selectedColor;
            const sizeMatch = sizeOptions.length === 0 || variantSize === selectedSize;

            return colorMatch && sizeMatch;
        });
    }, [
        product.variants,
        selectedColor, // Reage quando o estado de cor muda
        selectedSize, // Reage quando o estado de tamanho muda
        colorAttributeIndex,
        sizeAttributeIndex,
        colorOptions.length,
        sizeOptions.length
    ]);

    // --- 3. PROPRIEDADES DERIVADAS (Preço, SKU, Parcelas) ---
    // Usamos a variante selecionada ou a primeira variante como fallback
    const price = selectedVariant?.price || product.variants?.[0]?.price || '0.00';
    const parcelas = (parseFloat(price) / 3).toFixed(2);
    const productCode = selectedVariant?.sku || product.variants?.[0]?.sku || 'N/A';
    const productDescription = product.description?.pt || '';


    // --- 4. EFEITOS E HANDLERS ---
    
    // Inicialização de estados e favoritos
    useEffect(() => {
        if (product) {
            // Carrega Favoritos
            const favorites = getFavorites();
            const found = favorites.some(fav => fav.id === product.id);
            setIsFavorited(found);

            // Inicializa Tamanho
            if (sizeOptions.length > 0 && selectedSize === null) {
                setSelectedSize(sizeOptions[0]);
            }

            // Inicializa Cor E IMAGEM PRINCIPAL (se existirem)
            if (colorOptions.length > 0 && selectedColor === null) {
                setSelectedColor(colorOptions[0].name);
                setMainImage(colorOptions[0].imageSrc);
            }
        }
    }, [product, sizeOptions, colorOptions, selectedSize, selectedColor]);
    
    // Handler para alternar favoritos
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
    
    // Handler para compartilhamento
    const handleShare = useCallback(() => {
        // ... (lógica de compartilhamento inalterada)
        if (typeof navigator !== 'undefined') {
             if (navigator.share) {
                navigator.share({
                    title: product.name.pt,
                    text: `Confira este produto incrível da Legendários: ${product.name.pt}`,
                    url: window.location.href,
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert("Link do produto copiado para a área de transferência! Compartilhe a jornada de fé.");
                }).catch(console.error);
            }
        }
    }, [product.name.pt]);


    // Handler de Adicionar ao Carrinho (usa a variante selecionada calculada)
    const handleAddToCart = () => {
        if (sizeOptions.length > 0 && !selectedSize) {
            alert("Selecione um tamanho para adicionar ao carrinho.");
            return;
        }
        if (colorOptions.length > 0 && !selectedColor) {
            alert("Selecione uma cor para adicionar ao carrinho.");
            return;
        }
        
        if (!selectedVariant) {
            alert("Variante do produto não encontrada. Tente novamente ou selecione outras opções.");
            return;
        }

        const item = {
            ...product,
            variantId: selectedVariant.id,
            price: selectedVariant.price,
            selectedSize,
            selectedColor,
            quantity,
            // 🚨 NOVO: Passamos a URL da imagem que está sendo exibida.
            imageSrc: mainImage 
        };
        
        addToCart(item);
        setIsModalOpen(true);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                {/* --- Coluna da Esquerda: Imagens (Miniaturas + Principal) --- */}
                <div className="lg:w-7/12 flex gap-4">
                    {/* Miniaturas à esquerda */}
                    <div className="hidden md:flex flex-col gap-3 max-h-[80vh] overflow-y-auto pr-2">
                        {product.images.map((img, index) => (
                            <div
                                key={index}
                                className={`w-20 h-24 relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                    mainImage === img.src ? 'border-orange-500 ring-2 ring-orange-200' : 'border-zinc-200 hover:border-orange-300'
                                }`}
                                onClick={() => setMainImage(img.src)}
                            >
                                <Image
                                    src={img.src}
                                    alt={`${product.name.pt} ${index + 1}`}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Imagem Principal */}
                    <div className="flex-1 relative aspect-[4/5] bg-zinc-100 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src={mainImage}
                            alt={product.name.pt}
                            fill
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* --- Coluna da Direita: Detalhes e Ações --- */}
                <div className="lg:w-5/12 sticky top-8 h-fit p-4 lg:p-0">
                    <div className="pb-4 border-b border-zinc-200">
                        {/* Título e Código */}
                        <h1 className="text-4xl font-extrabold text-zinc-900 mb-2 leading-tight">{product.name.pt}</h1>
                        <p className="text-sm font-medium text-zinc-500 mb-4">Cód: <span className="font-semibold text-zinc-600">{productCode}</span></p>

                        {/* Preço (Agora dinâmico) */}
                        <p className="text-3xl font-bold text-orange-600">R$ {price}</p>
                        <p className="text-zinc-500 text-sm mt-1">ou em até 3x de R$ {parcelas} sem juros</p>
                    </div>

                    {/* Variações de Cor (Ícones Pequenos) */}
                    {colorOptions.length > 0 && (
                        <div className="mt-6">
                            {/* Mostra a cor selecionada (agora atualizada corretamente) */}
                            <span className="font-bold text-zinc-700 block mb-3">Cor: {selectedColor}</span>
                            <div className="flex gap-3">
                                {colorOptions.map(color => (
                                    <div
                                        key={color.name}
                                        onClick={() => {
                                            // ESTE É O FIX: A cor selecionada E a imagem principal mudam no clique.
                                            setSelectedColor(color.name);
                                            setMainImage(color.imageSrc);
                                        }}
                                        className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all relative overflow-hidden group ${
                                            selectedColor === color.name
                                                ? 'border-orange-500 ring-2 ring-orange-300'
                                                : 'border-zinc-300 hover:border-zinc-400'
                                        }`}
                                        title={color.name}
                                    >
                                        <Image
                                            src={color.imageSrc}
                                            alt={color.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Variações de Tamanho */}
                    {sizeOptions.length > 0 && (
                        <div className="mt-6">
                            <span className="font-bold text-zinc-700 block mb-3">Tamanho:</span>
                            <div className="flex flex-wrap gap-2">
                                {sizeOptions.map(size => (
                                    <button
                                        key={size}
                                        // ESTE É O FIX: O tamanho selecionado muda no clique.
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-2 px-4 rounded-full text-sm font-semibold border transition-all ${
                                            selectedSize === size
                                                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                                : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
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
                        <div className="flex items-center border border-zinc-300 rounded-full overflow-hidden divide-x divide-zinc-300">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors font-bold"
                            >
                                -
                            </button>
                            <span className="w-10 h-8 flex items-center justify-center font-semibold text-zinc-800 bg-white">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Botões de Ação Principal */}
                    <div className="flex flex-col gap-3 mt-8">
                        <button
                            onClick={handleAddToCart}
                            // Agora o botão é desabilitado se uma variante for necessária e não estiver selecionada
                            disabled={sizeOptions.length > 0 && !selectedSize || colorOptions.length > 0 && !selectedColor}
                            className={`w-full text-white py-4 px-6 rounded-xl font-extrabold text-lg uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] ${
                                (sizeOptions.length > 0 && !selectedSize || colorOptions.length > 0 && !selectedColor) ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                        >
                            <ShoppingBag size={20} />
                            Adicionar ao Carrinho
                        </button>
                        <button
                            className="w-full bg-white text-orange-500 border-2 border-orange-500 py-4 px-6 rounded-xl font-extrabold text-lg uppercase tracking-wider hover:bg-orange-50 transition-colors shadow-md"
                        >
                            Comprar Direto (Checkout Expresso)
                        </button>
                    </div>

                    {/* Botões de Compartilhar e Favoritos */}
                    <div className="flex justify-start gap-4 mt-4">
                        <button
                            onClick={handleToggleFavorite}
                            className="flex items-center gap-1 text-zinc-600 text-sm hover:text-orange-500 transition-colors"
                            aria-label="Adicionar aos favoritos"
                        >
                            <Heart
                                className={`transition-all duration-200 ${
                                    isFavorited ? 'fill-orange-500 text-orange-500' : 'fill-transparent text-zinc-500'
                                }`}
                                size={20}
                            />
                            {isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1 text-zinc-600 text-sm hover:text-orange-500 transition-colors"
                            aria-label="Compartilhar produto"
                        >
                            <Share2 size={20} className="text-zinc-500 hover:text-orange-500" />
                            Compartilhar
                        </button>
                    </div>

                </div>
            </div>

            {/* --- Seção de Descrição e Detalhes Técnicos --- */}
            <div className="mt-16 lg:mt-24 p-4 lg:p-0">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-zinc-800 mb-6 border-b-2 border-orange-500 pb-2 inline-block">Detalhes do Produto</h3>
                    {/* ATENÇÃO: Verifique a segurança da origem deste HTML antes de usar dangerouslySetInnerHTML */}
                    <div className="text-zinc-600 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: productDescription }}></div>
                </div>
            </div>

            {/* --- Carrossel de Produtos Relacionados (Mantido) --- */}
            <div className="mt-20">
                <ProductCarousel title="Você Também Pode Gostar" products={relatedProducts} />
            </div>

            {/* Modal de Carrinho */}
            <AnimatePresence>
                {isModalOpen && (
                    <CartModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        product={product}
                        quantity={quantity}
                        // NOVO: Passando as variações selecionadas para o modal
                        selectedSize={selectedSize} 
                        selectedColor={selectedColor} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
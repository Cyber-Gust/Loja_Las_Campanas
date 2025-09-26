import { getProductsWithFilters } from '@/lib/nuvemshop';
import CategoryClientView from './CategoryClientView';

// Este é um Server Component, perfeito para buscas seguras
export default async function CategoryPage({ params }) {
    const { categoria } = params;
    
    // Mapeamento de slugs para IDs de categoria
    // ATENÇÃO: SUBSTITUA ESSES IDs PELOS IDs REAIS DA SUA LOJA NUVEMSHOP
    const categoryIdMap = {
        'masculino': '12345678',
        'feminino': '12345679',
        'infantil': '12345680',
        'acessorios': '12345681',
        'patchs': '12345682',
    };

    const categoryId = categoryIdMap[categoria];
    const categoryTitle = categoria.charAt(0).toUpperCase() + categoria.slice(1);

    if (!categoryId) {
        return (
            <div className="text-center py-20 text-xl text-zinc-600">
                Categoria não encontrada.
            </div>
        );
    }
    
    // Busca segura dos produtos no servidor
    const products = await getProductsWithFilters({ categoryId });

    return (
        <CategoryClientView 
            initialProducts={products}
            categoryTitle={categoryTitle}
        />
    );
}

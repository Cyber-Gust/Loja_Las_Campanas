import { getProductsWithFilters } from '@/lib/nuvemshop';
import CategoryClientView from './CategoryClientView';

// Este é um Server Component, perfeito para buscas seguras
export default async function CategoryPage({ params }) {
    
    // 🚨 CORREÇÃO: Usar await para resolver o objeto params
    const { categoria } = await params; 
    
    // Mapeamento de slugs para IDs de categoria
    // ATENÇÃO: SUBSTITUA ESSES IDs PELOS IDs REAIS DA SUA LOJA NUVEMSHOP
    const categoryIdMap = {
        'masculino': '34066795',
        'feminino': '34066797',
        'infantil': '34066843',
        'acessorios': '34066802',
        'patchs': '34066841',
    };

    const categoryId = categoryIdMap[categoria];
    
    // Formata o título corretamente (ex: masculino -> Masculino)
    const categoryTitle = categoria.charAt(0).toUpperCase() + categoria.slice(1);

    if (!categoryId) {
        return (
            <div className="text-center py-20 text-xl text-zinc-600">
                Categoria **"{categoria}"** não encontrada.
            </div>
        );
    }
    
    // Busca segura dos produtos no servidor
    // A função getProductsWithFilters precisa lidar com categoryId
    const products = await getProductsWithFilters({ categoryId });

    return (
        <CategoryClientView 
            initialProducts={products}
            categoryTitle={categoryTitle}
        />
    );
}
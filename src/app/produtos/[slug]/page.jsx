import { getSingleProduct, getProductsByCategory } from '@/lib/nuvemshop';
import ProductClientView from './ProductClientView'; 

// Este é um Server Component para buscas seguras

export default async function ProductPage({ params }) {
    const { slug } = params;
    
    // 1. Busca Segura dos Dados do Produto no Servidor
    const product = await getSingleProduct(slug);

    if (!product) {
        return <div className="text-center py-20 text-xl text-zinc-600">Produto não encontrado ou ocorreu um erro ao carregar.</div>;
    }

    // 2. Obtém o primeiro ID da categoria do produto para buscar relacionados
    const categoryId = product.categories?.[0]?.id;

    // 3. Busca produtos relacionados da mesma categoria (sem incluir o produto atual)
    let relatedProducts = [];
    if (categoryId) {
        relatedProducts = await getProductsByCategory(categoryId, 4); // Limita a 4 produtos
        relatedProducts = relatedProducts.filter(p => p.id !== product.id);
    }
    
    // 4. Passa os dados carregados de forma segura para o componente cliente
    return <ProductClientView initialProduct={product} relatedProducts={relatedProducts} />;
}

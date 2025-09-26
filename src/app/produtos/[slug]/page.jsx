// Este é um Server Component para buscas seguras
import { getSingleProduct, getProductsByCategory } from '../../../lib/nuvemshop';
import ProductClientView from './ProductClientView';

export default async function ProductPage({ params }) {
    
    const { slug } = params;

    // Inicia as duas buscas em paralelo (sem esperar por relatedProducts)
    const productPromise = getSingleProduct(slug);
    
    // Aguarda apenas o produto principal para obter o ID da categoria
    const product = await productPromise;

    if (!product) {
        return <div className="text-center py-20 text-xl text-zinc-600">Produto não encontrado ou ocorreu um erro ao carregar.</div>;
    }

    const categoryId = product.categories?.[0]?.id;

    // Agora inicia a busca de relacionados e aguarda
    // Se você tem certeza do categoryId, pode fazer o fetch condicional aqui,
    // ou se o getProductsByCategory lidar com null/undefined, pode simplificar.
    const relatedProductsPromise = categoryId 
        ? getProductsByCategory(categoryId, 4) 
        : Promise.resolve([]); // Retorna uma Promise vazia se não houver categoria

    let relatedProducts = await relatedProductsPromise;

    // Filtra o produto principal
    relatedProducts = relatedProducts.filter(p => p.id !== product.id);
    
    // Passa os dados carregados de forma segura para o componente cliente
    return <ProductClientView initialProduct={product} relatedProducts={relatedProducts} />;
}
// lib/nuvemshop.js

// As variáveis de ambiente são acessadas de forma segura no servidor.
const STORE_ID = process.env.NUVEMSHOP_STORE_ID;
const ACCESS_TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;
const API_URL = `https://api.nuvemshop.com.br/v1/${STORE_ID}`;

/**
 * Função para buscar um único produto por ID.
 * Chamada apenas em Server Components ou API Routes para garantir a segurança.
 * @param {string} productId O ID do produto a ser buscado.
 * @returns {Promise<Object|null>} Os dados do produto ou null em caso de erro.
 */
export async function getSingleProduct(productId) {
    if (!STORE_ID || !ACCESS_TOKEN) {
        console.error("ERRO: Credenciais Nuvemshop não configuradas corretamente.");
        return null;
    }

    try {
        const url = `${API_URL}/products/${productId}`;
        const headers = {
            'Authentication': `bearer ${ACCESS_TOKEN}`, 
            'User-Agent': 'E-commerce (gemini-app@bitbloom-ai.com)'
        };

        const response = await fetch(url, { headers, cache: 'no-store' }); 

        if (!response.ok) {
            console.error(`Erro Nuvemshop ao buscar produto: ${response.status} ${response.statusText}`);
            return null;
        }

        const product = await response.json();
        return product;
    } catch (error) {
        console.error("Erro na chamada da API Nuvemshop:", error);
        return null;
    }
}

/**
 * Função para buscar todos os produtos.
 * @returns {Promise<Array<Object>>} Uma lista de produtos.
 */
export async function getProducts() {
  const url = `${API_URL}/products`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'Minha Loja App (contato@minhaloja.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();
    return products;

  } catch (error) {
    console.error("Falha ao buscar produtos da Nuvemshop:", error);
    return [];
  }
}

/**
 * Função para buscar produtos em oferta a partir de uma categoria específica.
 * @param {number} limit O número máximo de produtos a serem retornados.
 * @returns {Promise<Array<Object>>} Uma lista de produtos em oferta.
 */
export async function getSaleProducts(limit = 8) {
  const SALE_CATEGORY_ID = '34067323';

  const url = `${API_URL}/products?category_id=${SALE_CATEGORY_ID}&per_page=${limit}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'Minha Loja App (contato@minhaloja.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na API ao buscar ofertas: ${response.status} ${response.statusText}`);
    }

    const saleProducts = await response.json();
    return saleProducts;

  } catch (error) {
    console.error("Falha ao buscar produtos em oferta da Nuvemshop:", error);
    return [];
  }
}

/**
 * Função para buscar produtos por um ID de categoria específico.
 * @param {string} categoryId O ID da categoria.
 * @param {number} limit O número máximo de produtos a serem retornados.
 * @returns {Promise<Array<Object>>} Uma lista de produtos da categoria.
 */
export async function getProductsByCategory(categoryId, limit = 8) {
  if (!categoryId) return [];

  const url = `${API_URL}/products?category_id=${categoryId}&per_page=${limit}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'Minha Loja App (contato@minhaloja.com)'
      }
    });

    if (!response.ok) {
      console.error(`Erro Nuvemshop ao buscar produtos por categoria: ${response.status} ${response.statusText}`);
      return [];
    }

    const products = await response.json();
    return products;

  } catch (error) {
    console.error("Falha ao buscar produtos por categoria:", error);
    return [];
  }
}

/**
 * Função unificada para buscar produtos com filtros (ex: por categoria).
 * @param {Object} filters Um objeto contendo os filtros.
 * @param {string} filters.categorySlug O slug da categoria.
 * @returns {Promise<Array<Object>>} Uma lista de produtos filtrados.
 */
export async function getProductsWithFilters(filters) {
    let url = `${API_URL}/products?per_page=50`; // Busca até 50 produtos para uma categoria, ajuste conforme necessário
    
    if (filters.categoryId) {
        url += `&category_id=${filters.categoryId}`;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `bearer ${ACCESS_TOKEN}`,
                'User-Agent': 'Minha Loja App (contato@minhaloja.com)'
            }
        });

        if (!response.ok) {
            console.error(`Erro Nuvemshop ao buscar produtos filtrados: ${response.status} ${response.statusText}`);
            return [];
        }

        const products = await response.json();
        return products;

    } catch (error) {
        console.error("Falha ao buscar produtos com filtros:", error);
        return [];
    }
}

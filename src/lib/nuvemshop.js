// Esta função será nosso ponto de contato com a API da Nuvemshop.

const STORE_ID = process.env.NUVEMSHOP_STORE_ID;
const ACCESS_TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;
const API_URL = `https://api.nuvemshop.com.br/v1/${STORE_ID}`;

// Função para buscar todos os produtos (já existente)
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

// --- NOVA FUNÇÃO ADICIONADA ---
// Função otimizada para buscar produtos em oferta a partir de uma categoria específica.
export async function getSaleProducts(limit = 8) {
  // 1. Crie uma categoria "Ofertas" no seu painel Nuvemshop.
  // 2. Encontre o ID dessa categoria.
  // 3. SUBSTITUA o valor '123456' abaixo pelo ID real da sua categoria.
  const SALE_CATEGORY_ID = '34067323';

  // Endpoint que busca produtos filtrando por ID de categoria e limitando a quantidade.
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

// Você pode adicionar outras funções aqui depois, como getCategories(), getProductById(), etc.

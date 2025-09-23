    // Esta função será nosso ponto de contato com a API da Nuvemshop.

    const STORE_ID = process.env.NUVEMSHOP_STORE_ID;
    const ACCESS_TOKEN = process.env.NUVEMSHOP_ACCESS_TOKEN;
    const API_URL = `https://api.nuvemshop.com.br/v1/${STORE_ID}`;

    // Função para buscar produtos
    export async function getProducts() {
      // Endpoint para buscar produtos
      const url = `${API_URL}/products`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authentication': `bearer ${ACCESS_TOKEN}`,
            'User-Agent': 'Minha Loja App (contato@minhaloja.com)' // Boa prática: identifique sua aplicação
          }
        });

        if (!response.ok) {
          // Se a resposta não for OK, lança um erro com o status
          throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const products = await response.json();
        return products;

      } catch (error) {
        console.error("Falha ao buscar produtos da Nuvemshop:", error);
        // Em caso de erro, retorna um array vazio para não quebrar a página
        return [];
      }
    }

    // Você pode adicionar outras funções aqui depois, como getCategories(), getProductById(), etc.
    

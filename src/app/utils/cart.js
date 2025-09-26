// utils/cart.js

/**
 * Obtém o carrinho do localStorage.
 * @returns {Array} Uma lista de itens no carrinho.
 */
export const getCart = () => {
    try {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
        return [];
    }
};

/**
 * Salva o carrinho no localStorage.
 * @param {Array} cart O carrinho a ser salvo.
 */
const saveCart = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error("Erro ao salvar o carrinho:", error);
    }
};

/**
 * Adiciona um produto ao carrinho ou atualiza sua quantidade.
 * O item deve conter selectedColor e imageSrc.
 * @param {Object} item O item do produto a ser adicionado.
 */
export const addToCart = (item) => {
    const cart = getCart();
    
    // 🚨 ATUALIZAÇÃO: Busca o item exato, incluindo a COR como critério
    const existingItem = cart.find(
        cartItem => 
            cartItem.id === item.id && 
            cartItem.selectedSize === item.selectedSize &&
            cartItem.selectedColor === item.selectedColor
    );

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        // Se é uma nova variante (incluindo cor), adiciona ao carrinho
        cart.push(item);
    }
    saveCart(cart);
};

/**
 * Remove um produto do carrinho.
 * @param {string} itemId O ID do produto a ser removido.
 * @param {string} itemSize O tamanho do produto a ser removido.
 * @param {string} itemColor A cor do produto a ser removido.
 */
export const removeFromCart = (itemId, itemSize, itemColor) => {
    const cart = getCart();
    // 🚨 ATUALIZAÇÃO: O filtro agora compara ID, Tamanho E COR
    const updatedCart = cart.filter(item => 
        !(item.id === itemId && 
          item.selectedSize === itemSize &&
          item.selectedColor === itemColor)
    );
    saveCart(updatedCart);
};

/**
 * Atualiza a quantidade de um item no carrinho.
 * @param {string} itemId O ID do produto a ser atualizado.
 * @param {string} itemSize O tamanho do produto a ser atualizado.
 * @param {string} itemColor A cor do produto a ser atualizado.
 * @param {number} quantity A nova quantidade.
 */
export const updateItemQuantity = (itemId, itemSize, itemColor, quantity) => {
    const cart = getCart();
    // 🚨 ATUALIZAÇÃO: A busca agora compara ID, Tamanho E COR
    const itemToUpdate = cart.find(item => 
        item.id === itemId && 
        item.selectedSize === itemSize &&
        item.selectedColor === itemColor
    );
    if (itemToUpdate) {
        itemToUpdate.quantity = quantity;
        saveCart(cart);
    }
};

/**
 * Limpa o carrinho.
 */
export const clearCart = () => {
    saveCart([]);
};
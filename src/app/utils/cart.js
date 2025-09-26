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
 * @param {Object} item O item do produto a ser adicionado.
 */
export const addToCart = (item) => {
    const cart = getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.selectedSize === item.selectedSize);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveCart(cart);
};

/**
 * Remove um produto do carrinho.
 * @param {string} itemId O ID do produto a ser removido.
 * @param {string} itemSize O tamanho do produto a ser removido.
 */
export const removeFromCart = (itemId, itemSize) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => !(item.id === itemId && item.selectedSize === itemSize));
    saveCart(updatedCart);
};

/**
 * Atualiza a quantidade de um item no carrinho.
 * @param {string} itemId O ID do produto a ser atualizado.
 * @param {string} itemSize O tamanho do produto a ser atualizado.
 * @param {number} quantity A nova quantidade.
 */
export const updateItemQuantity = (itemId, itemSize, quantity) => {
    const cart = getCart();
    const itemToUpdate = cart.find(item => item.id === itemId && item.selectedSize === itemSize);
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

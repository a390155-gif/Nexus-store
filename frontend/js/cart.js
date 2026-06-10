/**
 * js/cart.js - Lógica del Carrito de Compras
 * Persiste en localStorage, actualiza la UI en tiempo real
 */

const CART_KEY = 'nexus_cart';

// ─── Operaciones del carrito ───────────────────────────────────

/**
 * Obtener carrito desde localStorage
 */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Guardar carrito en localStorage
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/**
 * Agregar producto al carrito
 */
function addToCart(product) {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item._id === product._id);

  if (existingIndex >= 0) {
    // Si ya existe, incrementar cantidad (respetando el stock)
    const newQty = cart[existingIndex].quantity + 1;
    if (newQty > product.stock) {
      showToast('No hay más stock disponible', 'error');
      return;
    }
    cart[existingIndex].quantity = newQty;
    showToast(`Cantidad actualizada en el carrito`, 'info');
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: 1
    });
    showToast(`"${product.name}" agregado al carrito`, 'success');
  }

  saveCart(cart);
}

/**
 * Eliminar producto del carrito
 */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item._id !== productId);
  saveCart(cart);
}

/**
 * Cambiar cantidad de un producto
 */
function updateQuantity(productId, delta) {
  const cart = getCart();
  const index = cart.findIndex((item) => item._id === productId);

  if (index < 0) return;

  const newQty = cart[index].quantity + delta;

  if (newQty <= 0) {
    removeFromCart(productId);
  } else if (newQty > cart[index].stock) {
    showToast('Stock máximo alcanzado', 'error');
  } else {
    cart[index].quantity = newQty;
    saveCart(cart);
  }
}

/**
 * Vaciar el carrito
 */
function clearCart() {
  saveCart([]);
}

/**
 * Calcular total del carrito
 */
function getCartTotal() {
  return getCart().reduce((acc, item) => acc + item.price * item.quantity, 0);
}

/**
 * Obtener número de ítems en el carrito
 */
function getCartCount() {
  return getCart().reduce((acc, item) => acc + item.quantity, 0);
}

// ─── Actualizar badge de la navbar ─────────────────────────────

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

// Inicializar badge al cargar cualquier página
document.addEventListener('DOMContentLoaded', updateCartBadge);

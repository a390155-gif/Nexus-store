/**
 * js/cart-page.js - Renderizado y checkout del carrito
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

  renderCartPage();
});

/**
 * Renderizar todos los ítems del carrito y el resumen
 */
function renderCartPage() {
  const cart = getCart();
  const itemsContainer = document.getElementById('cartItems');
  const summaryRows = document.getElementById('cartSummaryRows');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega productos desde el catálogo para comenzar.</p>
        <a href="catalog.html" class="btn btn-primary" style="margin-top:20px;display:inline-flex">
          Ir al catálogo
        </a>
      </div>
    `;
    summaryRows.innerHTML = '';
    totalEl.textContent = formatCurrency(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  // Renderizar ítems
  itemsContainer.innerHTML = cart.map((item) => `
    <div class="cart-item" id="item-${item._id}">
      <img
        class="cart-item-img"
        src="${item.image}"
        alt="${item.name}"
        onerror="this.src='https://via.placeholder.com/80x80?text=?'"
      />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)} c/u</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty('${item._id}', -1)">−</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty('${item._id}', 1)">+</button>
      </div>
      <div class="cart-item-subtotal">${formatCurrency(item.price * item.quantity)}</div>
      <button class="remove-btn" onclick="removeItem('${item._id}')" title="Eliminar">✕</button>
    </div>
  `).join('');

  // Renderizar filas del resumen
  summaryRows.innerHTML = cart.map((item) => `
    <div class="summary-row">
      <span>${item.name} × ${item.quantity}</span>
      <span>${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');

  totalEl.textContent = formatCurrency(getCartTotal());
}

/**
 * Cambiar cantidad desde la UI
 */
function changeQty(productId, delta) {
  updateQuantity(productId, delta);
  renderCartPage();
}

/**
 * Eliminar ítem desde la UI
 */
function removeItem(productId) {
  removeFromCart(productId);
  renderCartPage();
}

/**
 * Proceso de checkout
 */
async function checkout() {
  const user = getCurrentUser();

  // Redirigir al login si no está autenticado
  if (!user) {
    showToast('Inicia sesión para finalizar tu compra', 'info');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=cart';
    }, 1000);
    return;
  }

  const cart = getCart();
  if (cart.length === 0) return;

  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = 'Procesando...';

  try {
    // Preparar datos del pedido
    const orderData = {
      products: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity
      }))
    };

    const { data: order } = await OrdersAPI.create(orderData);

    // Limpiar carrito y redirigir a confirmación
    clearCart();
    sessionStorage.setItem('lastOrder', JSON.stringify(order));
    window.location.href = 'confirmation.html';
  } catch (error) {
    showToast(error.message || 'Error al procesar el pedido', 'error');
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = 'Finalizar compra';
  }
}

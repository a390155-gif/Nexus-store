/**
 * js/confirmation.js - Página de confirmación de pedido
 * Muestra los detalles del último pedido realizado
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

  renderConfirmation();
});

function renderConfirmation() {
  const container = document.getElementById('orderConfirmation');

  // Recuperar pedido guardado en sessionStorage
  const orderJson = sessionStorage.getItem('lastOrder');

  if (!orderJson) {
    container.innerHTML = `
      <div class="order-icon">❓</div>
      <h1>No se encontró el pedido</h1>
      <p>Parece que llegaste aquí sin completar una compra.</p>
      <a href="catalog.html" class="btn btn-primary" style="margin-top:20px;display:inline-flex">
        Ir al catálogo
      </a>
    `;
    return;
  }

  const order = JSON.parse(orderJson);
  sessionStorage.removeItem('lastOrder'); // Limpiar después de mostrar

  const date = new Date(order.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const productRows = order.products
    .map(
      (item) => `
    <div class="order-product-item">
      <span>${item.name} × ${item.quantity}</span>
      <span>${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `
    )
    .join('');

  container.innerHTML = `
    <div class="order-icon">✅</div>
    <h1>¡Pedido confirmado!</h1>
    <p>Gracias por tu compra. Recibirás tu pedido pronto.</p>

    <div class="order-details">
      <div class="order-detail-row">
        <span class="order-detail-label">Número de pedido</span>
        <span class="order-detail-value">${order.orderNumber}</span>
      </div>
      <div class="order-detail-row">
        <span class="order-detail-label">Fecha</span>
        <span class="order-detail-value">${date}</span>
      </div>
      <div class="order-detail-row">
        <span class="order-detail-label">Estado</span>
        <span class="order-detail-value" style="color:var(--success)">● Pendiente</span>
      </div>
    </div>

    <div class="order-products">
      <h3 style="color:var(--white);font-family:var(--font-display);margin-bottom:16px;text-align:left">
        Productos comprados
      </h3>
      <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-md);padding:20px">
        ${productRows}
        <div class="order-product-item" style="border-top:1px solid var(--border);margin-top:8px;padding-top:12px;font-weight:700">
          <span style="color:var(--white)">Total pagado</span>
          <span style="color:var(--indigo-light);font-size:1.1rem">${formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>

    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="orders.html" class="btn btn-ghost">Ver mis pedidos</a>
      <a href="catalog.html" class="btn btn-primary">Seguir comprando</a>
    </div>
  `;
}

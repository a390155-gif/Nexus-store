/**
 * js/orders.js - Historial de pedidos del usuario
 */

document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

  // Redirigir si no está autenticado
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
    return;
  }

  await loadOrders();
});

async function loadOrders() {
  const container = document.getElementById('ordersContainer');

  try {
    const { data: orders } = await OrdersAPI.getAll();

    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:60px 24px">
          <p style="font-size:2.5rem;margin-bottom:12px">📦</p>
          <p style="color:var(--text-2)">Aún no has realizado ningún pedido.</p>
          <a href="catalog.html" class="btn btn-primary" style="margin-top:20px;display:inline-flex">
            Ir al catálogo
          </a>
        </div>
      `;
      return;
    }

    const statusMap = {
      pending: { label: 'Pendiente', color: 'var(--warning)' },
      processing: { label: 'En proceso', color: 'var(--indigo-light)' },
      shipped: { label: 'Enviado', color: 'var(--cyan)' },
      delivered: { label: 'Entregado', color: 'var(--success)' },
      cancelled: { label: 'Cancelado', color: 'var(--danger)' }
    };

    container.innerHTML = orders.map((order) => {
      const status = statusMap[order.status] || statusMap.pending;
      const date = new Date(order.createdAt).toLocaleDateString('es-MX', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      return `
        <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-md);padding:24px;margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px">
            <div>
              <div style="font-family:var(--font-display);font-weight:700;color:var(--white);margin-bottom:4px">
                ${order.orderNumber}
              </div>
              <div style="font-size:.85rem;color:var(--text-2)">${date}</div>
            </div>
            <div style="display:flex;align-items:center;gap:16px">
              <span style="color:${status.color};font-size:.85rem;font-weight:600">● ${status.label}</span>
              <span style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--white)">
                ${formatCurrency(order.total)}
              </span>
            </div>
          </div>
          <div style="font-size:.85rem;color:var(--text-2)">
            ${order.products.map((p) => `${p.name} × ${p.quantity}`).join(' · ')}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = `<p style="color:var(--danger)">Error al cargar los pedidos: ${error.message}</p>`;
  }
}

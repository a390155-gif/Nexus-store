/**
 * js/main.js - Script de la página principal
 * Carga los productos destacados y maneja la navegación mobile
 */

document.addEventListener('DOMContentLoaded', async () => {
  // ─── Toggle menú móvil ────────────────────────────────────────
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // ─── Cargar productos destacados ──────────────────────────────
  const grid = document.getElementById('featuredProducts');
  if (!grid) return;

  try {
    const { data: products } = await ProductsAPI.getAll({ sort: '-createdAt' });

    grid.innerHTML = '';

    // Mostrar los primeros 4 productos
    const featured = products.slice(0, 4);

    if (featured.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-2);grid-column:1/-1">No hay productos disponibles aún.</p>';
      return;
    }

    featured.forEach((product) => {
      grid.appendChild(createProductCard(product));
    });
  } catch (error) {
    grid.innerHTML = `<p style="color:var(--danger);grid-column:1/-1">
      No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.
    </p>`;
    console.error('Error al cargar productos:', error);
  }
});

/**
 * Crea y retorna un elemento DOM de tarjeta de producto
 */
function createProductCard(product) {
  const stockClass = product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : '';
  const stockText = product.stock === 0 ? 'Sin stock' : product.stock < 5 ? `Solo ${product.stock} disponibles` : `${product.stock} en stock`;

  const card = document.createElement('article');
  card.className = 'product-card';
  card.innerHTML = `
    <img
      class="product-img"
      src="${product.image}"
      alt="${product.name}"
      loading="lazy"
      onerror="this.src='https://via.placeholder.com/400x300?text=Producto'"
    />
    <div class="product-body">
      <span class="product-category">${product.category || 'General'}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-footer">
        <div>
          <div class="product-price">${formatCurrency(product.price)}</div>
          <div class="product-stock ${stockClass}">${stockText}</div>
        </div>
        <button
          class="btn btn-primary btn-sm"
          onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})"
          ${product.stock === 0 ? 'disabled' : ''}
        >
          ${product.stock === 0 ? 'Agotado' : '+ Carrito'}
        </button>
      </div>
    </div>
  `;
  return card;
}

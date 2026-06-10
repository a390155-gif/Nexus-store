/**
 * js/catalog.js - Lógica de la página de catálogo
 * Carga, filtra y muestra todos los productos
 */

let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

  await loadProducts();

  // Event listeners para filtros
  document.getElementById('searchInput').addEventListener('input', filterAndRender);
  document.getElementById('categoryFilter').addEventListener('change', filterAndRender);
  document.getElementById('sortFilter').addEventListener('change', filterAndRender);
});

/**
 * Cargar todos los productos desde la API
 */
async function loadProducts() {
  const grid = document.getElementById('productsGrid');

  try {
    const { data } = await ProductsAPI.getAll();
    allProducts = data;
    renderProducts(allProducts);
  } catch (error) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 24px">
        <p style="color:var(--danger);font-size:1.1rem">⚠️ No se pudo conectar con el servidor.</p>
        <p style="color:var(--text-2);margin-top:8px;font-size:.9rem">
          Asegúrate de que el backend esté corriendo en http://localhost:5000
        </p>
      </div>
    `;
  }
}

/**
 * Filtrar productos según búsqueda, categoría y orden
 */
function filterAndRender() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortFilter').value;

  let filtered = [...allProducts];

  // Filtrar por texto
  if (searchTerm) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );
  }

  // Filtrar por categoría
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  // Ordenar
  filtered.sort((a, b) => {
    if (sort === 'price') return a.price - b.price;
    if (sort === '-price') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    // Default: -createdAt
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  renderProducts(filtered);
}

/**
 * Renderizar lista de productos en el grid
 */
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  const counter = document.getElementById('resultsCount');

  counter.textContent = `${products.length} producto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`;

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 24px">
        <p style="font-size:2.5rem;margin-bottom:12px">🔍</p>
        <p style="color:var(--text-2)">No se encontraron productos con ese criterio.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';
  products.forEach((product) => {
    grid.appendChild(createProductCard(product));
  });
}

/**
 * Crear tarjeta de producto
 */
function createProductCard(product) {
  const stockClass = product.stock === 0 ? 'out' : product.stock < 5 ? 'low' : '';
  const stockText =
    product.stock === 0
      ? 'Sin stock'
      : product.stock < 5
      ? `Solo ${product.stock} disponibles`
      : `${product.stock} en stock`;

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

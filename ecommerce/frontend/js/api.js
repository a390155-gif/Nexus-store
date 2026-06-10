/**
 * js/api.js - Cliente de API centralizado
 * Todas las llamadas al backend pasan por aquí
 */

const API_BASE = (() => {
  const { protocol, hostname, port, origin } = window.location;
  if (protocol === 'file:') return 'http://localhost:5000/api';
  if (hostname === 'localhost' && port && port !== '5000') {
    return 'http://localhost:5000/api';
  }
  return `${origin}/api`;
})();

/**
 * Realiza una petición a la API con manejo de errores centralizado
 * @param {string} endpoint - Ruta relativa (ej: '/products')
 * @param {object} options  - Opciones de fetch
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    // Re-lanzar para que cada función maneje el error apropiadamente
    throw error;
  }
}

// ─── Productos ─────────────────────────────────────────────────

const ProductsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products${query ? '?' + query : ''}`);
  },
  getById: (id) => apiRequest(`/products/${id}`),
  create: (data) => apiRequest('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' })
};

// ─── Autenticación ─────────────────────────────────────────────

const AuthAPI = {
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => apiRequest('/auth/profile')
};

// ─── Pedidos ───────────────────────────────────────────────────

const OrdersAPI = {
  create: (data) => apiRequest('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiRequest('/orders'),
  getById: (id) => apiRequest(`/orders/${id}`)
};

// ─── Utilidades ────────────────────────────────────────────────

/**
 * Formatea un número como moneda en pesos mexicanos
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

/**
 * Muestra un toast de notificación
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

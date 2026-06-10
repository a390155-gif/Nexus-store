/**
 * js/auth.js - Gestión del estado de autenticación
 * Actualiza la navbar y protege rutas privadas
 */

/**
 * Obtener el usuario almacenado en localStorage
 */
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
}

/**
 * Guardar sesión de usuario
 */
function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Cerrar sesión
 */
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('Sesión cerrada correctamente', 'info');
  setTimeout(() => {
    window.location.href = getBasePath() + 'index.html';
  }, 800);
}

/**
 * Detectar si estamos en una subcarpeta y retornar el path base
 */
function getBasePath() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

/**
 * Actualizar el ítem de autenticación en la navbar
 */
function updateAuthNav() {
  const authNavItem = document.getElementById('authNavItem');
  if (!authNavItem) return;

  const user = getCurrentUser();

  if (user) {
    authNavItem.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        <a href="${getBasePath()}pages/orders.html" class="nav-link">Mis pedidos</a>
        <button onclick="logout()" class="btn btn-ghost btn-sm">Salir</button>
      </div>
    `;
  } else {
    authNavItem.innerHTML = `
      <a href="${getBasePath()}pages/login.html" class="nav-link">Iniciar sesión</a>
    `;
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', updateAuthNav);

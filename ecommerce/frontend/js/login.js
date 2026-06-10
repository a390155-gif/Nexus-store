/**
 * js/login.js - Lógica del formulario de inicio de sesión
 */

document.addEventListener('DOMContentLoaded', () => {
  // Si ya hay sesión activa, redirigir al inicio
  if (getCurrentUser()) {
    window.location.href = '../index.html';
    return;
  }

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

  const form = document.getElementById('loginForm');
  form.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const submitBtn = document.getElementById('submitBtn');
  const alertError = document.getElementById('alertError');
  const alertSuccess = document.getElementById('alertSuccess');

  // Limpiar alertas previas
  alertError.classList.remove('visible');
  alertSuccess.classList.remove('visible');

  // ─── Validación ────────────────────────────────────────────────
  let valid = true;

  // Validar correo
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email.value || !emailRegex.test(email.value)) {
    email.classList.add('error');
    document.getElementById('emailError').classList.add('visible');
    valid = false;
  } else {
    email.classList.remove('error');
    document.getElementById('emailError').classList.remove('visible');
  }

  // Validar contraseña
  if (!password.value) {
    password.classList.add('error');
    document.getElementById('passwordError').classList.add('visible');
    valid = false;
  } else {
    password.classList.remove('error');
    document.getElementById('passwordError').classList.remove('visible');
  }

  if (!valid) return;

  // ─── Petición a la API ─────────────────────────────────────────
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando...';

  try {
    const { token, user } = await AuthAPI.login({
      email: email.value,
      password: password.value
    });

    saveSession(token, user);

    alertSuccess.textContent = `¡Bienvenido, ${user.name}! Redirigiendo...`;
    alertSuccess.classList.add('visible');

    // Verificar si hay redirección pendiente (desde el carrito)
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');

    setTimeout(() => {
      window.location.href = redirect === 'cart' ? 'cart.html' : '../index.html';
    }, 1000);
  } catch (error) {
    alertError.textContent = error.message || 'Correo o contraseña incorrectos';
    alertError.classList.add('visible');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Iniciar sesión';
  }
}

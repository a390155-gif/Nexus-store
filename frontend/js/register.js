/**
 * js/register.js - Lógica del formulario de registro
 */

document.addEventListener('DOMContentLoaded', () => {
  if (getCurrentUser()) {
    window.location.href = '../index.html';
    return;
  }

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

  document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

async function handleRegister(e) {
  e.preventDefault();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const submitBtn = document.getElementById('submitBtn');
  const alertError = document.getElementById('alertError');
  const alertSuccess = document.getElementById('alertSuccess');

  alertError.classList.remove('visible');
  alertSuccess.classList.remove('visible');

  // ─── Validaciones ──────────────────────────────────────────────
  let valid = true;

  const setError = (input, errorId, condition) => {
    if (condition) {
      input.classList.add('error');
      document.getElementById(errorId).classList.add('visible');
      valid = false;
    } else {
      input.classList.remove('error');
      document.getElementById(errorId).classList.remove('visible');
    }
  };

  setError(name, 'nameError', !name.value || name.value.trim().length < 2);
  setError(email, 'emailError', !email.value || !/^\S+@\S+\.\S+$/.test(email.value));
  setError(password, 'passwordError', !password.value || password.value.length < 8);
  setError(confirmPassword, 'confirmError', password.value !== confirmPassword.value);

  if (!valid) return;

  // ─── Petición a la API ─────────────────────────────────────────
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creando cuenta...';

  try {
    const { token, user } = await AuthAPI.register({
      name: name.value.trim(),
      email: email.value,
      password: password.value
    });

    saveSession(token, user);

    alertSuccess.textContent = `¡Cuenta creada! Bienvenido, ${user.name}. Redirigiendo...`;
    alertSuccess.classList.add('visible');

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1200);
  } catch (error) {
    alertError.textContent = error.message || 'Error al crear la cuenta';
    alertError.classList.add('visible');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Crear cuenta';
  }
}

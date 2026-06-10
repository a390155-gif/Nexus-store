/**
 * routes/auth.routes.js - Rutas de Autenticación
 */

const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /api/auth/register - Registro de usuario
router.post('/register', register);

// POST /api/auth/login - Inicio de sesión
router.post('/login', login);

// GET /api/auth/profile - Perfil del usuario (protegido)
router.get('/profile', protect, getProfile);

module.exports = router;

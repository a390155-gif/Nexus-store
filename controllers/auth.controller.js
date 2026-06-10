/**
 * controllers/auth.controller.js - Controlador de Autenticación
 * Maneja registro, login y perfil de usuario
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Generar token JWT ─────────────────────────────────────────────────────────

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token válido por 7 días
  });
};

// ─── POST /api/auth/register ───────────────────────────────────────────────────

/**
 * @desc    Registrar nuevo usuario
 * @route   POST /api/auth/register
 * @access  Público
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verificar campos obligatorios
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Este correo ya está registrado'
      });
    }

    // Crear nuevo usuario (la contraseña se cifra en el modelo)
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Cuenta creada exitosamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/login ──────────────────────────────────────────────────────

/**
 * @desc    Iniciar sesión
 * @route   POST /api/auth/login
 * @access  Público
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son obligatorios'
      });
    }

    // Buscar usuario e incluir el campo password (excluido por defecto)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Sesión iniciada correctamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/profile ─────────────────────────────────────────────────────

/**
 * @desc    Obtener perfil del usuario autenticado
 * @route   GET /api/auth/profile
 * @access  Privado
 */
const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt
    }
  });
};

module.exports = { register, login, getProfile };

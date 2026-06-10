/**
 * middleware/auth.middleware.js - Middleware de autenticación JWT
 * Verifica el token en rutas protegidas
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect - Verifica que el usuario esté autenticado
 * Agrega req.user con los datos del usuario autenticado
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar que el header Authorization exista y sea Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Inicia sesión para continuar.'
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar al usuario en la base de datos
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'El usuario ya no existe.'
      });
    }

    // Adjuntar usuario a la request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expirado. Inicia sesión nuevamente.' });
    }
    next(error);
  }
};

/**
 * adminOnly - Solo permite acceso a usuarios con rol admin
 * Debe usarse después de protect
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({
    success: false,
    message: 'Acceso restringido a administradores.'
  });
};

module.exports = { protect, adminOnly };

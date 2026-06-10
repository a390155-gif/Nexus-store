/**
 * routes/order.routes.js - Rutas de Pedidos
 */

const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

// Todas las rutas de pedidos requieren autenticación
router.use(protect);

// POST /api/orders     - Crear pedido
// GET  /api/orders     - Mis pedidos
router.route('/').post(createOrder).get(getOrders);

// GET /api/orders/:id  - Ver pedido específico
router.get('/:id', getOrderById);

module.exports = router;

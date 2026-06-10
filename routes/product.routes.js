/**
 * routes/product.routes.js - Rutas de Productos (CRUD completo)
 */

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// GET  /api/products       - Listar todos los productos (público)
// POST /api/products       - Crear producto (solo admin)
router
  .route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

// GET    /api/products/:id - Ver producto (público)
// PUT    /api/products/:id - Actualizar producto (solo admin)
// DELETE /api/products/:id - Eliminar producto (solo admin)
router
  .route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;

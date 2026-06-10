/**
 * controllers/product.controller.js - Controlador de Productos
 * CRUD completo para la gestión del catálogo
 */

const Product = require('../models/Product');

// ─── GET /api/products ─────────────────────────────────────────────────────────

/**
 * @desc    Obtener todos los productos activos
 * @route   GET /api/products
 * @access  Público
 */
const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort = '-createdAt' } = req.query;

    // Construir filtro dinámico
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const products = await Product.find(filter).sort(sort);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/products/:id ─────────────────────────────────────────────────────

/**
 * @desc    Obtener un producto por ID
 * @route   GET /api/products/:id
 * @access  Público
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/products ────────────────────────────────────────────────────────

/**
 * @desc    Crear nuevo producto
 * @route   POST /api/products
 * @access  Privado (admin)
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, stock, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image,
      stock,
      category
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/products/:id ─────────────────────────────────────────────────────

/**
 * @desc    Actualizar producto
 * @route   PUT /api/products/:id
 * @access  Privado (admin)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto actualizado',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/products/:id ──────────────────────────────────────────────────

/**
 * @desc    Eliminar producto (soft delete)
 * @route   DELETE /api/products/:id
 * @access  Privado (admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

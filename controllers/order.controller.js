/**
 * controllers/order.controller.js - Controlador de Pedidos
 * Crea y consulta pedidos del usuario autenticado
 */

const Order = require('../models/Order');
const Product = require('../models/Product');

// ─── POST /api/orders ──────────────────────────────────────────────────────────

/**
 * @desc    Crear nuevo pedido
 * @route   POST /api/orders
 * @access  Privado
 */
const createOrder = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe tener al menos un producto'
      });
    }

    // Validar stock y construir ítems con snapshot de precio
    const orderItems = [];
    let total = 0;

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Producto ${item.product} no encontrado`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
        });
      }

      // Reducir stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: item.quantity
      });

      total += product.price * item.quantity;
    }

    // Crear el pedido
    const order = await Order.create({
      userId: req.user._id,
      products: orderItems,
      total: parseFloat(total.toFixed(2))
    });

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders ───────────────────────────────────────────────────────────

/**
 * @desc    Obtener pedidos del usuario autenticado
 * @route   GET /api/orders
 * @access  Privado
 */
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort('-createdAt')
      .populate('products.product', 'name image');

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/orders/:id ───────────────────────────────────────────────────────

/**
 * @desc    Obtener un pedido específico
 * @route   GET /api/orders/:id
 * @access  Privado
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById };

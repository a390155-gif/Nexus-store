/**
 * models/Order.js - Modelo de Pedido
 * Registra los pedidos realizados por los usuarios
 */

const mongoose = require('mongoose');

// Sub-esquema para los ítems del pedido
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },     // Snapshot del nombre al momento de compra
  price: { type: Number, required: true },    // Snapshot del precio al momento de compra
  image: { type: String },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La cantidad mínima es 1']
  }
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El pedido debe estar asociado a un usuario']
    },
    products: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'El pedido debe tener al menos un producto'
      }
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    orderNumber: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// Generar número de pedido único antes de guardar
orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

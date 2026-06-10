/**
 * models/Product.js - Modelo de Producto
 * Define el esquema del catálogo de productos en MongoDB
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede superar 100 caracteres']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres']
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x300?text=Producto'
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Índice para búsquedas por nombre y categoría
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);

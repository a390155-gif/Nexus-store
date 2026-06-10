/**
 * server.js - Punto de entrada del servidor Express
 * Tienda en Línea - Backend API REST
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

// Importar manejador de errores centralizado
const errorHandler = require('./middleware/error.middleware');

// Inicializar aplicación Express
const app = express();

// ─── Middleware global ─────────────────────────────────────────────────────────

// Habilitar CORS para el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Servir archivos estáticos (imágenes de productos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Rutas de la API ───────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Servir frontend estático (mismo origen para API y UI en producción/GitHub)
const frontendPath = path.join(__dirname, '../frontend');
if (require('fs').existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
}

// ─── Manejador de errores ──────────────────────────────────────────────────────

app.use(errorHandler);

// Ruta no encontrada (404) — solo para rutas /api
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// ─── Conexión a MongoDB ────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const { seedDatabase } = require('./config/seedData');

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB exitosamente');

    if (process.env.NODE_ENV === 'production') {
      await seedDatabase({ reset: false });
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  });

module.exports = app;

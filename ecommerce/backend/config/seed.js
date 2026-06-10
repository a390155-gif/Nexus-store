/**
 * config/seed.js - Script de datos semilla
 * Ejecutar con: npm run seed
 * Crea productos y un usuario admin de ejemplo
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const sampleProducts = [
  {
    name: 'Audífonos Inalámbricos Pro',
    description: 'Audífonos con cancelación de ruido activa, batería de 30h y sonido de alta fidelidad. Compatibles con Bluetooth 5.0.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    stock: 50,
    category: 'Electrónica'
  },
  {
    name: 'Smartwatch Serie X',
    description: 'Reloj inteligente con monitor de frecuencia cardíaca, GPS integrado, resistente al agua y pantalla AMOLED de 1.4".',
    price: 2499.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    stock: 30,
    category: 'Electrónica'
  },
  {
    name: 'Teclado Mecánico RGB',
    description: 'Teclado mecánico TKL con switches Cherry MX Red, retroiluminación RGB personalizable y cable trenzado desmontable.',
    price: 899.50,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    stock: 25,
    category: 'Periféricos'
  },
  {
    name: 'Mochila Urbana Tech',
    description: 'Mochila de 30L con compartimento acolchado para laptop de hasta 17", puerto USB integrado y material resistente al agua.',
    price: 649.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    stock: 40,
    category: 'Accesorios'
  },
  {
    name: 'Lámpara LED de Escritorio',
    description: 'Lámpara de escritorio con 10 niveles de brillo, temperatura de color ajustable, puerto USB cargador y brazo articulado.',
    price: 449.00,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
    stock: 60,
    category: 'Hogar'
  },
  {
    name: 'Cámara Web 4K',
    description: 'Cámara web con resolución 4K, micrófono con cancelación de ruido, corrección automática de iluminación y campo visual de 90°.',
    price: 1150.00,
    image: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=400&h=300&fit=crop',
    stock: 20,
    category: 'Electrónica'
  },
  {
    name: 'Mouse Ergonómico Vertical',
    description: 'Mouse vertical inalámbrico que reduce la fatiga del brazo, con sensor óptico de 1600 DPI y batería recargable.',
    price: 520.00,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    stock: 35,
    category: 'Periféricos'
  },
  {
    name: 'Altavoz Bluetooth Portátil',
    description: 'Altavoz inalámbrico con sonido 360°, resistente al agua IPX7, batería de 24h y conectividad TWS para vincular dos altavoces.',
    price: 799.00,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    stock: 45,
    category: 'Electrónica'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Colecciones limpiadas');

    // Insertar productos
    const products = await Product.insertMany(sampleProducts);
    console.log(`📦 ${products.length} productos creados`);

    // Crear usuario admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@tienda.com',
      password: 'Admin1234',
      role: 'admin'
    });
    console.log(`👤 Admin creado: ${admin.email} / Admin1234`);

    // Crear usuario de prueba
    const user = await User.create({
      name: 'Usuario Demo',
      email: 'demo@tienda.com',
      password: 'Demo1234'
    });
    console.log(`👤 Demo creado: ${user.email} / Demo1234`);

    console.log('\n✅ Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar datos:', error.message);
    process.exit(1);
  }
};

seedDatabase();

/**
 * config/seed.js - Script de datos semilla manual
 * Ejecutar con: npm run seed
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedDatabase } = require('./seedData');

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Conectado a MongoDB');

    await seedDatabase({ reset: true });
    console.log('\n✅ Base de datos inicializada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar datos:', error.message);
    process.exit(1);
  }
};

run();

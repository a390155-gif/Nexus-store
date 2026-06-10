/**
 * config/seedData.js - Datos de ejemplo y lógica de seed compartida
 */

const Product = require('../models/Product');
const User = require('../models/User');

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
  },
  {
    name: 'Monitor Gaming 27" 144Hz',
    description: 'Monitor IPS de 27 pulgadas con resolución 2560x1440, 144Hz, 1ms de tiempo de respuesta y HDR10.',
    price: 5499.00,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    stock: 15,
    category: 'Electrónica'
  },
  {
    name: 'Laptop Gamer i7',
    description: 'Laptop con procesador Intel Core i7, 16GB RAM, RTX 3060, SSD 512GB y pantalla 144Hz.',
    price: 18999.00,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    stock: 10,
    category: 'Electrónica'
  },
  {
    name: 'Tablet Gráfica Digital',
    description: 'Tableta gráfica con área activa de 10x6 pulgadas, 8192 niveles de presión y stylus sin batería.',
    price: 1299.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    stock: 25,
    category: 'Periféricos'
  },
  {
    name: 'Silla Ergonómica de Oficina',
    description: 'Silla con soporte lumbar ajustable, reposabrazos 4D, malla transpirable y base de aluminio.',
    price: 3499.00,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop',
    stock: 20,
    category: 'Hogar'
  },
  {
    name: 'Cable USB-C Multipuerto',
    description: 'Hub USB-C con 4 puertos USB 3.0, HDMI 4K, SD/TF card reader y USB-C PD 100W.',
    price: 599.00,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop',
    stock: 50,
    category: 'Accesorios'
  },
  {
    name: 'Disco SSD Externo 1TB',
    description: 'Disco SSD externo USB 3.2 Gen 2 con 1TB de capacidad, velocidad de 1050MB/s y carcasa resistente.',
    price: 1599.00,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop',
    stock: 30,
    category: 'Electrónica'
  },
  {
    name: 'Auriculares Gaming',
    description: 'Auriculares gaming con sonido 7.1 surround, micrófono con cancelación de ruido y almohadillas de espuma viscoelástica.',
    price: 899.00,
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop',
    stock: 35,
    category: 'Electrónica'
  },
  {
    name: 'Cargador Rápido 65W',
    description: 'Cargador GaN de 65W con 2 puertos USB-C y 1 puerto USB-A, compatible con laptops y dispositivos móviles.',
    price: 449.00,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop',
    stock: 60,
    category: 'Accesorios'
  },
  {
    name: 'Teclado Inalámbrico Compacto',
    description: 'Teclado 60% inalámbrico con switches mecánicos, batería de 2000mAh y retroiluminación RGB.',
    price: 1299.00,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    stock: 25,
    category: 'Periféricos'
  },
  {
    name: 'Soporte Monitor Ajustable',
    description: 'Soporte de monitor con brazo articulado, capacidad para hasta 27 pulgadas y ajuste de altura/ángulo.',
    price: 799.00,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    stock: 40,
    category: 'Accesorios'
  },
  {
    name: 'Mouse Pad XL',
    description: 'Mouse pad de gran tamaño (900x400mm) con superficie de tela antideslizante y bordes cosidos.',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1563299796-1358c8db8b5c?w=400&h=300&fit=crop',
    stock: 80,
    category: 'Accesorios'
  }
];

/**
 * @param {{ reset?: boolean }} options
 * reset=true borra todo y vuelve a sembrar (npm run seed)
 * reset=false solo sembra si la base está vacía (producción / Render)
 */
async function seedDatabase({ reset = false } = {}) {
  const existingProducts = await Product.countDocuments();

  if (!reset && existingProducts > 0) {
    console.log('📦 Base de datos ya tiene datos, omitiendo seed automático');
    return;
  }

  if (reset) {
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Colecciones limpiadas');
  }

  const products = await Product.insertMany(sampleProducts);
  console.log(`📦 ${products.length} productos creados`);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@tienda.com',
    password: 'Admin1234',
    role: 'admin'
  });
  console.log(`👤 Admin creado: ${admin.email}`);

  const user = await User.create({
    name: 'Usuario Demo',
    email: 'demo@tienda.com',
    password: 'Demo1234'
  });
  console.log(`👤 Demo creado: ${user.email}`);
}

module.exports = { seedDatabase, sampleProducts };

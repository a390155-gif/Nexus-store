# ⬡ Nexus Store — Tienda en Línea

Tienda en línea full-stack con catálogo de productos, carrito de compras, autenticación JWT y gestión de pedidos.

---

## Tecnologías

| Capa | Tecnologías |
|------|-------------|
| **Front-end** | HTML5, CSS3, JavaScript Vanilla, Fetch API |
| **Back-end** | Node.js, Express.js |
| **Base de datos** | MongoDB, Mongoose |
| **Autenticación** | JWT, bcryptjs |
| **Herramientas** | dotenv, cors, nodemon |

---

## Estructura del proyecto

```
ecommerce/
├── backend/
│   ├── controllers/          # Lógica de negocio por recurso
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   └── order.controller.js
│   ├── models/               # Esquemas Mongoose
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/               # Definición de rutas REST
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   └── order.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js    # Verificación JWT
│   │   └── error.middleware.js  # Manejador centralizado de errores
│   ├── config/
│   │   └── seed.js           # Script de datos de ejemplo
│   ├── server.js             # Punto de entrada del servidor
│   └── .env.example
│
├── frontend/
│   ├── pages/
│   │   ├── catalog.html      # Catálogo con búsqueda y filtros
│   │   ├── cart.html         # Carrito de compras
│   │   ├── login.html        # Inicio de sesión
│   │   ├── register.html     # Registro de usuario
│   │   ├── confirmation.html # Confirmación de pedido
│   │   └── orders.html       # Historial de pedidos
│   ├── css/
│   │   └── main.css          # Sistema de diseño completo
│   ├── js/
│   │   ├── api.js            # Cliente de API centralizado
│   │   ├── cart.js           # Lógica del carrito (localStorage)
│   │   ├── auth.js           # Estado de autenticación
│   │   ├── main.js           # Página de inicio
│   │   ├── catalog.js        # Catálogo con filtros
│   │   ├── cart-page.js      # Renderizado del carrito
│   │   ├── login.js          # Formulario de login
│   │   ├── register.js       # Formulario de registro
│   │   ├── confirmation.js   # Página de confirmación
│   │   └── orders.js         # Historial de pedidos
│   └── index.html            # Página de inicio
│
└── README.md
```

---

## Instalación

### Prerrequisitos

- Node.js v18 o superior
- MongoDB (local o MongoDB Atlas)
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/nexus-store.git
cd nexus-store

# 2. Instalar dependencias del backend
cd ecommerce/backend
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

---

## Variables de entorno

Crear el archivo `backend/.env` con los siguientes valores:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion
NODE_ENV=development
```

---

## Ejecución

```bash
# Dentro de /backend

# Sembrar datos de ejemplo (primera vez)
npm run seed

# Iniciar servidor en modo desarrollo
npm run dev

# Iniciar servidor en producción
npm start
```

El servidor corre en `http://localhost:5000` y sirve el frontend automáticamente.

También puedes abrir `frontend/index.html` con **Live Server** (el API apunta a `localhost:5000`).

---

## Credenciales de prueba

Después de ejecutar `npm run seed`:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Admin | admin@tienda.com | Admin1234 |
| Usuario | demo@tienda.com | Demo1234 |

---

## Endpoints de la API

### Autenticación

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `POST` | `/api/auth/register` | Registrar usuario | Público |
| `POST` | `/api/auth/login` | Iniciar sesión | Público |
| `GET` | `/api/auth/profile` | Perfil del usuario | Privado |

### Productos

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `GET` | `/api/products` | Listar productos | Público |
| `GET` | `/api/products/:id` | Ver producto | Público |
| `POST` | `/api/products` | Crear producto | Admin |
| `PUT` | `/api/products/:id` | Actualizar producto | Admin |
| `DELETE` | `/api/products/:id` | Eliminar producto | Admin |

**Query params para GET `/api/products`:**
- `category` — filtrar por categoría
- `search` — búsqueda de texto
- `sort` — ordenar (ej: `-price`, `name`)

### Pedidos

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| `POST` | `/api/orders` | Crear pedido | Privado |
| `GET` | `/api/orders` | Mis pedidos | Privado |
| `GET` | `/api/orders/:id` | Ver pedido | Privado |

---

## Funcionalidades implementadas

- **Catálogo dinámico** — productos desde MongoDB, sin datos hardcodeados
- **Búsqueda y filtros** — por nombre, descripción y categoría en tiempo real
- **Carrito persistente** — guardado en localStorage, actualización en tiempo real
- **Autenticación JWT** — registro, login, rutas protegidas
- **Contraseñas cifradas** — bcryptjs con salt de 12 rondas
- **Gestión de pedidos** — creación con control de stock, historial por usuario
- **Confirmación de compra** — número de pedido, fecha, productos y total
- **Diseño responsive** — Mobile First, funcional en móvil y escritorio
- **CRUD completo** — crear, leer, actualizar y eliminar productos (admin)
- **Manejo de errores** — centralizado en backend, mensajes claros en frontend

---

## Despliegue en Render

### Backend

1. Crear cuenta en [render.com](https://render.com)
2. Nuevo servicio → **Web Service**
3. Conectar repositorio de GitHub
4. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Agregar variables de entorno en el panel de Render:
   - `MONGODB_URI` — URI de MongoDB Atlas
   - `JWT_SECRET` — clave secreta segura
   - `NODE_ENV` — `production`

### Frontend

1. Nuevo servicio → **Static Site**
2. Conectar el mismo repositorio
3. Configurar:
   - **Root Directory:** `frontend`
   - **Publish Directory:** `frontend`
4. Actualizar `API_BASE` en `frontend/js/api.js` con la URL del backend desplegado

### MongoDB Atlas

1. Crear cuenta en [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crear cluster gratuito
3. Obtener la URI de conexión y usarla como `MONGODB_URI`

---

## Despliegue en Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Desde la carpeta backend
railway init
railway up

# Configurar variables de entorno en el dashboard de Railway
```

---

## Uso de IA en el desarrollo

Este proyecto fue desarrollado con asistencia de inteligencia artificial (Claude de Anthropic) para:
- Diseño de la arquitectura del proyecto
- Generación de la estructura de archivos
- Implementación de controladores y middleware
- Sistema de diseño CSS y componentes de UI
- Documentación y README

---

## Licencia

Proyecto académico — Libre para uso educativo.

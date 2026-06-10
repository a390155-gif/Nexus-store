# Nexus Store

Tienda en línea full-stack (Node.js + Express + MongoDB + frontend vanilla).

## Inicio rápido

```bash
cd ecommerce/backend
npm install
cp .env.example .env
npm run seed
npm start
```

Abre [http://localhost:5000](http://localhost:5000) — el backend sirve también el frontend.

## GitHub

1. Crea un repositorio en GitHub.
2. Sube el código:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/nexus-store.git
git push -u origin main
```

3. El workflow **CI** en `.github/workflows/ci.yml` se ejecuta automáticamente en cada push.

## Despliegue en la nube (desde GitHub)

### Render (recomendado)

1. Conecta tu repositorio en [render.com](https://render.com).
2. Usa el archivo `render.yaml` incluido o configura manualmente:
   - **Root Directory:** `ecommerce/backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Agrega `MONGODB_URI` (MongoDB Atlas) en las variables de entorno.

La app quedará en una sola URL: frontend + API.

Documentación completa en [ecommerce/README.md](ecommerce/README.md).

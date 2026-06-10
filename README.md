# Nexus Store

Tienda en línea full-stack (Node.js + Express + MongoDB + frontend vanilla).

## Inicio rápido (local)

```bash
cd ecommerce/backend
npm install
cp .env.example .env
npm run seed
npm start
```

Abre [http://localhost:5000](http://localhost:5000) — el backend sirve también el frontend.

**Credenciales de prueba:** `demo@tienda.com` / `Demo1234` (admin: `admin@tienda.com` / `Admin1234`)

---

## Despliegue en Render + MongoDB Atlas

### Paso 1 — Base de datos en MongoDB Atlas (gratis)

1. Entra a [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) y crea una cuenta.
2. Crea un cluster **M0 FREE** (Shared).
3. En **Database Access** → **Add New Database User**:
   - Usuario y contraseña (guárdalos).
   - Rol: `Atlas admin` o `readWriteAnyDatabase`.
4. En **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`).
5. En **Database** → **Connect** → **Drivers** → copia la URI. Debe verse así:

```
mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/nexus-store?retryWrites=true&w=majority
```

Reemplaza `<password>` por tu contraseña real (si tiene caracteres especiales, codifícalos en URL).

### Paso 2 — Desplegar en Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://dashboard.render.com/blueprint/new?repo=https://github.com/a390155-gif/Nexus-store)

O manualmente:

1. Entra a [render.com](https://render.com) e inicia sesión con **GitHub**.
2. Abre el enlace de arriba o ve a **Dashboard** → **New** → **Blueprint**.
3. Conecta el repositorio **a390155-gif/Nexus-store**.
4. Render detectará el archivo `render.yaml`. En **Environment Variables** pega tu URI:

| Variable      | Valor                          |
|---------------|--------------------------------|
| `MONGODB_URI` | tu URI de MongoDB Atlas        |

(`JWT_SECRET` y `NODE_ENV` se configuran solos.)

5. Haz clic en **Apply** y espera el deploy (2–5 min).

6. Cuando termine, abre la URL que te da Render, por ejemplo:
   `https://nexus-store.onrender.com`

La primera vez que arranque, el servidor **crea automáticamente** los productos y usuarios de prueba.

### Paso 3 — Verificar

- `https://TU-APP.onrender.com` → página de inicio
- `https://TU-APP.onrender.com/api/health` → `{"status":"OK",...}`
- `https://TU-APP.onrender.com/pages/catalog.html` → catálogo con productos

### Notas

- El plan **free** de Render apaga el servicio tras ~15 min sin uso; el primer acceso puede tardar ~1 min en despertar.
- Cada push a `main` vuelve a desplegar automáticamente.
- Para reiniciar los datos manualmente: en Render → **Shell** → `npm run seed`.

---

## GitHub

Repositorio: [github.com/a390155-gif/Nexus-store](https://github.com/a390155-gif/Nexus-store)

El workflow **CI** en `.github/workflows/ci.yml` se ejecuta en cada push.

Documentación del proyecto en [ecommerce/README.md](ecommerce/README.md).

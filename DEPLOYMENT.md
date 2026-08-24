# 🚀 Guía de Despliegue — Mundilex (Proyecto de Modalidad)

Esta guía explica las 3 formas más recomendadas de desplegar la aplicación:

---

## 🟢 Opción 1: Despliegue en la Nube (Vercel + Render / Railway)

### 1. Desplegar el Backend (Render o Railway)
1. Conecta tu repositorio de GitHub a **[Render](https://render.com/)** o **[Railway](https://railway.app/)**.
2. Configuración en Render:
   - **Root Directory:** `Proyecto-De-Modalidad/backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Environment Variables:**
     - `PORT`: `3001`
     - `DATABASE_URL`: `file:./prisma/educaplay.db`
     - `FRONTEND_URL`: URL de tu frontend en Vercel (ej. `https://mundilex.vercel.app`)
3. Render te proporcionará una URL pública para el backend (ejemplo: `https://mundilex-backend.onrender.com`).

---

### 2. Desplegar el Frontend (Vercel)
1. Conecta tu repositorio a **[Vercel](https://vercel.com/)**.
2. Configuración en Vercel:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (la raíz del repositorio)
   - **Build Command:** `npm run build`
   - **Environment Variables:**
     - `NEXT_PUBLIC_API_URL`: `https://mundilex-backend.onrender.com` (la URL del backend obtenida en el paso 1).
3. ¡Listo! Vercel compilará y publicará la aplicación con SSL automático.

---

## 🐳 Opción 2: Despliegue con Docker Compose (VPS / Servidor Propio)

Si tienes un servidor Linux (Ubuntu, Debian, AWS EC2, DigitalOcean Droplet, Linode, etc.):

1. Clona el repositorio en el servidor:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Proyecto-De-Modalidad
   ```
2. Ejecuta:
   ```bash
   docker compose up --build -d
   ```
3. La aplicación estará corriendo:
   - **Frontend:** `http://TU_IP:3000`
   - **Backend:** `http://TU_IP:3001`

---

## 💻 Opción 3: Ejecución en Producción Local / Red LAN

Para correr la versión de producción optimizada en tu propia máquina:

### 1. Iniciar Backend:
```bash
cd Proyecto-De-Modalidad/backend
npm run start:prod
```

### 2. Iniciar Frontend:
```bash
npm run build
npm run start
```
Abre tu navegador en `http://localhost:3000`.

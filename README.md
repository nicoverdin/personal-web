# 🚀 Personal Portfolio - Fullstack App

Este repositorio contiene una aplicación web completa (Fullstack) para gestionar y mostrar un portafolio de proyectos personales.

**Tecnologías:**
- **Backend:** NestJS, Prisma ORM, PostgreSQL, Passport (JWT Auth).
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
- **DevOps:** Docker, Docker Compose, GitHub Actions.

---

## 🛠️ Instalación y Uso (Modo Rápido con Docker)

La forma más sencilla de ejecutar el proyecto es usando Docker. Asegúrate de tener **Docker Desktop** instalado.

1. **Clonar el repositorio:**
   ```bash
   git clone <TU_REPO_URL>
   cd personal-web
   ```

2. **Crear archivo de entorno:**
   Crea un archivo `.env` en la carpeta `backend` (puedes copiar el ejemplo si existe o crear uno nuevo):
   ```bash
   JWT_SECRET="mi_secreto_super_seguro"
   ```

3. **Arrancar la aplicación:**
   ```bash
   docker compose up -d --build
   ```

4. **Acceder:**
   - **Frontend:** [http://localhost:3001](http://localhost:3001)
   - **Backend API:** [http://localhost:3000](http://localhost:3000)

---

## 💻 Desarrollo Local (Sin Docker)

Si prefieres ejecutar los servicios manualmente en tu máquina:

### Backend
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```
*Requiere una base de datos PostgreSQL corriendo en localhost:5432.*

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Tests

El proyecto cuenta con integración continua (CI) y tests unitarios.

Para ejecutarlos manualmente:
```bash
cd backend
npm run test
```

---

## 🔒 Endpoints Principales

| Método | Ruta | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/projects` | Listar proyectos | Público |
| `POST` | `/projects` | Crear proyecto | **Privado (JWT)** |
| `POST` | `/auth/register` | Registrar Admin | Público |
| `POST` | `/auth/login` | Obtener Token | Público |

---

## 🐳 Comandos Docker Útiles

- **Ver logs:** `docker compose logs -f`
- **Parar todo:** `docker compose down`
- **Reiniciar backend:** `docker compose restart backend`
- **Ejecutar migración DB:** `docker compose exec backend npx prisma migrate deploy`
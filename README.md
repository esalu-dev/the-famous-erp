# 🍕 The Famous Pizza & Beer ERP

> Sistema web de gestión de recursos empresariales para el restaurante The Famous Pizza & Beer.  
> Proyecto académico — Programación Web 8vo semestre · Instituto Tecnológico de Durango · 2026

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 + HeroUI + Tailwind CSS |
| Backend | NestJS (microservicios) + TypeScript |
| Base de datos | PostgreSQL + Prisma 7 |
| Monorepo | Turborepo + npm workspaces |
| Infraestructura | AWS (Amplify, ECS/Fargate, RDS, S3) |
| Contenedores | Docker + Docker Compose |

---

## 📁 Estructura del proyecto

```
the-famous-erp/
├── apps/
│   ├── web/                    ← Next.js frontend (puerto 3000)
│   ├── auth-service/           ← Autenticación y RBAC (puerto 3001)
│   ├── inventory-service/      ← Inventario y clasificación ABC (puerto 3002)
│   ├── analytics-service/      ← Precios históricos y utilidad (puerto 3003)
│   ├── notification-service/   ← Alertas y recordatorios (puerto 3004)
│   └── media-service/          ← Subida de imágenes (puerto 3005)
├── packages/
│   └── database-client/        ← Prisma 7 client compartido
├── .github/
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── docker-compose.yml          ← Solo Postgres en dev
├── turbo.json
├── package.json                ← Raíz del monorepo
└── .env.example
```

---

## ✅ Requisitos previos

Antes de instalar asegúrate de tener:

- [Node.js 20+](https://nodejs.org/)
- [npm 9+](https://www.npmjs.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_ORG/the-famous-erp.git
cd the-famous-erp
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

**Raíz del proyecto:**
```bash
cp .env.example .env
```

**Frontend:**
```bash
cp apps/web/.env.example apps/web/.env.local
```

**Base de datos:**
```bash
cp packages/database-client/.env.example packages/database-client/.env
```

> ⚠️ Edita cada `.env` con tus valores reales antes de continuar.

### 4. Levantar Postgres

```bash
npm run db:up
```

### 5. Generar el cliente de Prisma

```bash
cd packages/database-client
npx prisma generate
cd ../..
```

### 6. Correr migraciones

```bash
cd packages/database-client
npx prisma migrate dev
cd ../..
```

### 7. Arrancar el proyecto

```bash
npm run start
```

Esto levanta Postgres y todos los servicios en paralelo.

---

## 🌐 URLs en desarrollo

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Auth Service | http://localhost:3001 |
| Inventory Service | http://localhost:3002 |
| Analytics Service | http://localhost:3003 |
| Notification Service | http://localhost:3004 |
| Media Service | http://localhost:3005 |

---

## 📟 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start` | Levanta Postgres y todos los servicios |
| `npm run dev` | Levanta solo los servicios sin Postgres |
| `npm run build` | Construye todos los servicios |
| `npm run test` | Corre los tests de todos los servicios |
| `npm run lint` | Linter en todos los servicios |
| `npm run db:up` | Levanta Postgres en Docker |
| `npm run db:down` | Apaga Postgres |
| `npm run db:logs` | Ver logs de Postgres en tiempo real |
| `npm run db:migrate` | Corre migraciones pendientes |
| `npm run db:generate` | Regenera el cliente de Prisma |

---

## 🌿 Convenciones de Git

### Nomenclatura de ramas

```
feature/US-XX-descripcion-corta   ← nuevas funcionalidades
fix/descripcion-del-bug           ← corrección de bugs  
chore/descripcion                 ← configuración e infraestructura
hotfix/descripcion                ← parches urgentes en producción
```

### Formato de commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): implementar login con JWT
fix(inventory): corregir cálculo de categoría ABC
chore(infra): agregar Dockerfile para auth-service
test(inventory): agregar tests para endpoint de insumos
docs(readme): actualizar instrucciones de instalación
```

### Flujo de trabajo

```bash
# 1. Partir siempre de develop actualizado
git checkout develop
git pull origin develop

# 2. Crear tu rama
git checkout -b feature/US-01-login-jwt

# 3. Trabajar y commitear
git add .
git commit -m "feat(auth): implementar login con JWT"

# 4. Subir y abrir PR hacia develop
git push origin feature/US-01-login-jwt
```

### Reglas de PRs

- Todo feature va en su propio PR hacia `develop`
- Se requiere **1 aprobación** del Team Lead correspondiente
- `develop` → `main` solo en **Sprint Review** después de QA
- Nunca hacer push directo a `main` ni a `develop`

---

## 👥 Equipo

| Nombre | Rol | Área |
|--------|-----|------|
| Emilio Salas Luján | Product Owner | Gestión e infraestructura |
| Héctor Hugo González | Backend Team Lead | Microservicios y DB |
| Victoria Bueno Mijares | Frontend Team Lead | UI/UX y componentes |
| Sergio Ricardo López | Desarrollador | Backend |
| Diego Zendejas Hernández | Desarrollador | Frontend |
| Axell Roy Romo | Desarrollador | Backend |

---

## 📄 Licencia

MIT — Instituto Tecnológico de Durango · 2026
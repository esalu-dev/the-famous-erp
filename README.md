# 🍕 The Famous Pizza & Beer ERP

> A high-performance Enterprise Resource Planning (ERP) system designed to centralize and scale restaurant operations. Built with a modular **Microservices Architecture** and a **Monorepo** strategy to ensure industrial-grade maintainability and scalability.

---

## 🛠️ Engineering Highlights

- **Microservices Orchestration:** Managed 5 independent **NestJS** services, ensuring service isolation and independent scalability.
- **Monorepo Strategy:** Implemented **Turborepo** with npm workspaces to optimize builds and share core logic across the entire system.
- **Cloud-Native Infrastructure:** Engineered for the cloud using **Docker** and **AWS** (ECS, RDS, S3), following modern DevOps practices.
- **Type-Safe Data Layer:** Centralized database logic using a shared **Prisma 7** client, maintaining strict consistency across services.
- **Technical Leadership:** Heading a cross-functional team of 5 developers, enforcing **Conventional Commits**, rigorous **Code Reviews**, and Agile workflows.

---

## 🧱 Tech Stack

| Layer              | Technology                          |
| :----------------- | :---------------------------------- |
| **Frontend**       | Next.js 15 + HeroUI + Tailwind CSS  |
| **Backend**        | NestJS (Microservices) + TypeScript |
| **Database**       | PostgreSQL + Prisma 7               |
| **Monorepo**       | Turborepo + npm workspaces          |
| **Infrastructure** | AWS (Amplify, ECS/Fargate, RDS, S3) |
| **Containers**     | Docker + Docker Compose             |

---

## 📁 System Architecture

```text
the-famous-erp/
├── apps/
│   ├── web/                    ← Next.js frontend (Port 3000)
│   ├── auth-service/           ← Authentication & RBAC (Port 3001)
│   ├── inventory-service/      ← ABC Classification & Inventory (Port 3002)
│   ├── analytics-service/      ← Historical Pricing & Analytics (Port 3003)
│   ├── notification-service/   ← Real-time Alerts (Port 3004)
│   └── media-service/          ← Image Processing & S3 Uploads (Port 3005)
├── packages/
│   └── database-client/        ← Shared Prisma 7 client
├── docker-compose.yml          ← Development infrastructure
└── turbo.json                  ← Monorepo configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 20+ & npm 9+
- Docker Desktop

### 2. Installation

```bash
git clone https://github.com/esalu-dev/the-famous-erp.git
cd the-famous-erp
npm install
```

### 3. Environment Setup

Configure your `.env` files in the root, `apps/web/`, and `packages/database-client/` based on the provided `.env.example` templates.

### 4. Database & Launch

```bash
npm run db:up         # Spin up PostgreSQL via Docker
npm run db:migrate    # Run migrations
npm run start         # Launch all services in parallel
```

---

## 🌿 Engineering Standards

### Commit Strategy

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(scope):` New features
- `fix(scope):` Bug fixes
- `chore(infra):` Configuration & DevOps

### Pull Request Rules

- Every feature requires a dedicated PR to `develop`.
- **Mandatory Code Review:** At least 1 approval from the Tech Lead is required.
- Direct pushes to `main` or `develop` are strictly prohibited.

---

## 👥 The Engineering Team

| Name                   | Role                                 | Focus                                     |
| :--------------------- | :----------------------------------- | :---------------------------------------- |
| **Emilio Salas Luján** | **Project Manager & Lead Architect** | **Architecture, Infrastructure & DevOps** |
| Héctor Hugo González   | Backend Team Lead                    | Microservices & Database Design           |
| Victoria Bueno Mijares | Frontend Team Lead                   | UI/UX & Component Systems                 |
| Team Developers        | Software Engineers                   | Feature Development & Testing             |

---

## 📄 License

Distributed under the MIT License. Developed at Instituto Tecnológico de Durango, 2026.

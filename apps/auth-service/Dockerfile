FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración para resolver workspaces en el monorepo
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copiar el paquete compartido de base de datos
COPY packages/database-client ./packages/database-client

# Copiar la aplicación específica
COPY apps/auth-service ./apps/auth-service

# Instalar dependencias a nivel monorepo
RUN npm ci

# Generar el cliente de Prisma (con DATABASE_URL ficticia para la compilación)
RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npm run db:generate

# Compilar la aplicación y sus dependencias locales usando Turborepo
RUN npx turbo run build --filter=@the-famous-erp/auth-service...

EXPOSE 3001

CMD ["node", "apps/auth-service/dist/main"]
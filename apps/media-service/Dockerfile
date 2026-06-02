FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración para resolver workspaces en el monorepo
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copiar la aplicación específica (esta no requiere base de datos Prisma)
COPY apps/media-service ./apps/media-service

# Instalar dependencias a nivel monorepo
RUN npm ci

# Compilar la aplicación usando Turborepo
RUN npx turbo run build --filter=@the-famous-erp/media-service...

EXPOSE 3005

CMD ["node", "apps/media-service/dist/main"]

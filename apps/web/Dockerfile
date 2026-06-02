FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración para resolver workspaces en el monorepo
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./

# Copiar la aplicación específica
COPY apps/web ./apps/web

# Instalar dependencias a nivel monorepo
RUN npm ci

# Compilar la aplicación frontend Next.js usando Turborepo
RUN npx turbo run build --filter=@the-famous-erp/web...

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web"]
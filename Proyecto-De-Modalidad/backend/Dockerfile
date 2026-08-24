FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias y schema
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copiar código fuente y compilar
COPY tsconfig*.json nest-cli.json ./
COPY src ./src/
RUN npx prisma generate
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/src/main.js"]

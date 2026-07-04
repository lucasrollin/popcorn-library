# syntax=docker/dockerfile:1

# --- Builder stage: install deps, generate Prisma client, compile TS ---
FROM node:24-alpine AS builder

WORKDIR /app

# Install ALL dependencies (incl. dev) from the lockfile — we need
# typescript and the prisma CLI to build.
COPY package*.json ./
RUN npm ci

# Generate the Prisma client from the schema. This MUST run before the
# TS build, because src/ imports the generated @prisma/client.
COPY prisma ./prisma
RUN npx prisma generate

# Compile TypeScript to dist/
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- Runner stage: minimal image that just runs the compiled app ---
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Bring over everything needed to run: compiled JS, node_modules (which
# already contains the generated Prisma client), the manifest, and the
# schema (prisma migrate deploy needs it at startup).
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --chown=node:node package*.json ./

# Drop root privileges — the base image ships a non-root `node` user.
USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]

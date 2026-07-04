# syntax=docker/dockerfile:1

# --- Builder stage: install deps, generate Prisma client, compile TS ---
FROM node:24-alpine AS builder

WORKDIR /app

# Install ALL dependencies (incl. dev) from the lockfile — we need
# typescript and the prisma CLI to build.
COPY package*.json ./
RUN npm ci

# Copy sources FIRST, then generate. Generating after the COPY ensures the
# client produced for THIS platform (linux-musl) wins — otherwise a host-
# generated client (e.g. darwin) inside src/ would clobber it.
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate

# Compile TypeScript to dist/
RUN npm run build

# tsc only compiles .ts — the Prisma query-engine (.node) is a binary asset
# that must be copied next to the compiled client by hand.
RUN cp src/generated/prisma/*.node dist/generated/prisma/

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

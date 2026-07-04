# syntax=docker/dockerfile:1

# --- Builder stage: compile the Vite app to static files ---
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines env vars at BUILD time. Default to a relative /api so the
# app talks to whatever origin serves it (the reverse-proxy nginx routes
# /api -> backend). Override with --build-arg VITE_API_URL=... if needed.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Runner stage: serve the static build with nginx ---
FROM nginx:1.27-alpine AS runner

# SPA config: unknown routes fall back to index.html (React Router).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output from Vite.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

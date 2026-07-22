# Stage 1: Build the Vite React App
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Vite inlines env vars into the bundle at build time, so this must be a build
# arg, not a runtime container env var (which would arrive too late to matter).
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom Nginx config for SPAs
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from builder
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

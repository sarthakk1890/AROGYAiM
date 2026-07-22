# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first for layer caching
COPY package*.json ./
RUN npm install --legacy-peer-deps


# Copy the rest of the source code and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package info and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps --ignore-scripts


# Copy built application
COPY --from=builder /usr/src/app/dist ./dist

# Start the application
EXPOSE 5000
CMD ["npm", "start"]

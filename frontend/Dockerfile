# Multi-stage Dockerfile for React + Vite Frontend

# Stage 1: Build production bundle using Node.js
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy application source files
COPY . .

# Build argument for API URL with default localhost:5000
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundle into /app/dist
RUN npm run build

# Stage 2: Serve production assets using lightweight Nginx
FROM nginx:alpine

# Copy built static assets from build stage to Nginx public HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

# Use official Node.js 20 Alpine Linux image (lightweight & secure)
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first for optimal Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy backend application source code
COPY . .

# Expose backend port (default 5000)
EXPOSE 5000

# Start backend service using npm start (runs "node server.js")
CMD ["npm", "start"]

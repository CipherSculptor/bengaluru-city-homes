# Use Node.js 20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package.json files first for better caching
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies with specific flags to avoid issues
RUN npm ci --legacy-peer-deps --no-audit --no-fund
RUN cd backend && npm ci --legacy-peer-deps --no-audit --no-fund

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
CMD ["npm", "start"]

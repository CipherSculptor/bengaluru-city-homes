FROM node:20-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --legacy-peer-deps
RUN cd backend && npm ci --legacy-peer-deps && cd ..

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Expose the port
EXPOSE 5001

# Start the server
CMD ["npm", "start"]

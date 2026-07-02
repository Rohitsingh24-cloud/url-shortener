# Use official Node.js image
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose application port
EXPOSE 3000

# Start API server
CMD ["npm", "start"]
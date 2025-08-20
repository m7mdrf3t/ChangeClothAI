# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Expose port (Railway will set PORT env var)
EXPOSE ${PORT:-3000}

# Start the Express.js server
CMD ["node", "server.js"]

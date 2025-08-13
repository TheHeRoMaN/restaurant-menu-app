# Use official Node.js 18 Alpine image for a small footprint
FROM node:18-alpine

# Create app directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies first (cache friendly)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend files
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
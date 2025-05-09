# Use a base image for ARM architecture with the required Node.js version
FROM arm64v8/node:21.6.2-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json if available
COPY package*.json ./
COPY public/ ./public
COPY src/ ./src
COPY env ./.env

# Install dependencies
RUN npm install

# Copy the rest of the application files
# COPY . .

# Build the application
# RUN npm run build

# Serve the build folder using a lightweight web server
# RUN npm install -g serve

# Expose port 5001 for the application
EXPOSE 5001

# Start the application using serve
CMD ["npm", "start"]

# build image
# docker build -t tax-dashboard:0.0.1 .


FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source and config
COPY tsconfig.json next.config.js ./
COPY src ./src
COPY public ./public

# Expose port
EXPOSE 3000

# Run dev server
CMD ["npm", "run", "dev"]

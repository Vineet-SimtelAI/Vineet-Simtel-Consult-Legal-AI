# ─── Build Stage ───
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# ─── Production Stage ───
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json ./
COPY prisma ./prisma/
RUN npm install --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "dist/main.js"]

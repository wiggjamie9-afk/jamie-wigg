# Neural Twin Backend AIO Container
# Bundles: PostgreSQL + Node.js Backend + Job Server

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Runtime stage
FROM node:20-alpine

# Install PostgreSQL client and supervisord
RUN apk add --no-cache postgresql-client supervisor bash openssl

WORKDIR /app

# Create non-root user for PostgreSQL
RUN addgroup -S postgres && adduser -S postgres -G postgres

# Copy node_modules and app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Copy environment setup script
COPY --chmod=755 docker-entrypoint.sh ./
COPY --chmod=755 docker-healthcheck.sh ./
COPY supervisord.conf /etc/supervisord.conf

# Expose ports
EXPOSE 5000 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
    CMD /app/docker-healthcheck.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisord.conf"]

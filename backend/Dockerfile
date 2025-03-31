FROM node:18-alpine as builder

WORKDIR /usr/src/build

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with production flag to avoid dev dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Production image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy from builder stage
COPY --from=builder /usr/src/build ./

# Set proper ownership
RUN chown -R node:node /usr/src/app

# Use non-root user
USER node

# Set environment variables
ENV NODE_ENV production
ENV PORT 5000

# Expose port 5000
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
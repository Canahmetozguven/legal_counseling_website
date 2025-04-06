FROM node:20-alpine as builder

WORKDIR /usr/src/build

# Add ARG instructions for environment variables
ARG REACT_APP_API_URL
ARG NODE_ENV

# Set environment variables
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV NODE_ENV=$NODE_ENV

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with legacy-peer-deps flag to handle dependency conflicts
RUN npm ci --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production image using lightweight nginx
FROM nginx:stable-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage to nginx public directory
COPY --from=builder /usr/src/build/build /usr/share/nginx/html

# Add security headers to nginx
RUN echo 'add_header X-Content-Type-Options "nosniff";' >> /etc/nginx/conf.d/default.conf && \
    echo 'add_header X-XSS-Protection "1; mode=block";' >> /etc/nginx/conf.d/default.conf && \
    echo 'add_header X-Frame-Options "DENY";' >> /etc/nginx/conf.d/default.conf && \
    echo 'add_header Referrer-Policy "strict-origin-when-cross-origin";' >> /etc/nginx/conf.d/default.conf && \
    echo 'add_header Content-Security-Policy "default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\'' '\''unsafe-eval'\''; style-src '\''self'\'' '\''unsafe-inline'\'' https://fonts.googleapis.com; img-src '\''self'\'' data: blob:; font-src '\''self'\'' https://fonts.gstatic.com data:; connect-src '\''self'\'' http://localhost:* https://*.yourapi.com; frame-ancestors '\''none'\''; frame-src '\''none'\''; object-src '\''none'\''; upgrade-insecure-requests;";' >> /etc/nginx/conf.d/default.conf

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create custom directories for nginx
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/run/nginx && \
    mkdir -p /var/log/nginx

# Change ownership of nginx directories that need write access
RUN chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/run/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d

# Configure Nginx properly with the custom PID path
RUN echo 'pid /var/run/nginx/nginx.pid;' > /etc/nginx/nginx.conf && \
    echo 'worker_processes auto;' >> /etc/nginx/nginx.conf && \
    echo 'events { worker_connections 1024; }' >> /etc/nginx/nginx.conf && \
    echo 'http { include /etc/nginx/mime.types; default_type application/octet-stream; include /etc/nginx/conf.d/*.conf; }' >> /etc/nginx/nginx.conf

# Switch to non-root user
USER appuser

# Expose port 80
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
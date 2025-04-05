# Musti Internetsitesi

A modern, production-ready law firm management system with client-facing website and secure administrative dashboard.

## Production-Ready Features

This application has been built with a comprehensive set of production-ready features:

### 1. Code Quality & Best Practices

- ✅ ESLint and Prettier configured for consistent code style
- ✅ Husky and lint-staged for pre-commit validation
- ✅ Comprehensive TypeScript type definitions
- ✅ PropTypes validation for React components
- ✅ Component architecture with clear separation of concerns

### 2. Testing

- ✅ Jest unit tests for util functions and hooks
- ✅ React Testing Library for component tests
- ✅ Integration tests for API endpoints
- ✅ E2E testing with Playwright

### 3. Performance Optimization

- ✅ Code splitting and lazy loading
- ✅ Bundle size optimization and analysis
- ✅ Efficient rendering with React optimizations
- ✅ API response caching with configurable TTL
- ✅ Runtime performance monitoring
- ✅ Developer performance metrics dashboard

### 4. Error Handling & Monitoring

- ✅ Global error boundary for React components
- ✅ Centralized error tracking and reporting
- ✅ API error standardization and handling
- ✅ User-friendly error messages and recovery options

### 5. Security

- ✅ JWT authentication with secure storage
- ✅ CSRF protection
- ✅ XSS prevention with input sanitization
- ✅ Rate limiting for sensitive endpoints
- ✅ Secure HTTP headers
- ✅ Security logging and monitoring

### 6. Accessibility

- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ High contrast mode support
- ✅ Accessibility-enhancing HOC components

### 7. Documentation

- ✅ Comprehensive JSDoc documentation
- ✅ API documentation
- ✅ Code examples and usage patterns
- ✅ Developer guides

### 8. CI/CD Pipeline

- ✅ Automated testing on pull requests
- ✅ Build and deployment workflows
- ✅ Environment-specific configurations
- ✅ Docker containerization

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Docker and Docker Compose (for containerized deployment)

### Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/musti_internetsitesi.git
cd musti_internetsitesi
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   Create a `config.env` file in the backend directory based on the provided example.

4. Start development servers:

```bash
# Start both frontend and backend with Docker
docker-compose up

# Or start separately:
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Production Deployment

1. Build production assets:

```bash
# Frontend build
cd frontend
npm run build

# Start production environment
cd ..
docker-compose -f docker-compose.prod.yml up -d
```

2. Running tests:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## Additional Tools

### Performance Analysis

```bash
cd frontend
npm run analyze  # Run webpack bundle analyzer
```

### Documentation Generation

```bash
cd frontend
npm run docs      # Generate documentation
npm run docs:serve  # Serve documentation locally
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Legal Counseling Website

A full-stack web application for law firms to manage clients, cases, appointments, and blog content.

## Features

- 🔐 Secure Authentication System
- 👥 Client Management
- 📅 Appointment Scheduling
- 📁 Case Management
- 📝 Legal Blog Platform
- 📞 Contact Form with Admin Dashboard
- 📱 Responsive Design

## Technology Stack

### Frontend
- React.js
- Material-UI
- React Router
- Context API for State Management
- Axios for API communication

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Jest for Testing

### DevOps
- Docker & Docker Compose
- NGINX
- SSL/TLS with Certbot

## Prerequisites

- Node.js (v14.0.0 or later)
- MongoDB (v4.4 or later)
- NPM or Yarn
- Docker and Docker Compose (for containerized setup)

## Installation

### Traditional Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/legal-counseling-website.git
cd legal-counseling-website
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

4. Environment Setup
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the environment variables with your configuration

### Docker Setup (Recommended)

1. Clone the repository
```bash
git clone https://github.com/yourusername/legal-counseling-website.git
cd legal-counseling-website
```

2. Environment Setup
   - Review and update `.env.development` for development
   - Review and update `.env.production` for production

## Running the Application

### Development Mode

#### Traditional Method
1. Start Backend Server
```bash
cd backend
npm run dev
```

2. Start Frontend Development Server
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

#### Using Docker (Recommended)
```bash
# Start the development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the development environment
docker-compose down
```

The application will be available at `http://localhost:80` (routed through NGINX)

### Production Mode

#### Traditional Method
1. Build Frontend
```bash
cd frontend
npm run build
```

2. Start Production Server
```bash
cd ../backend
npm start
```

#### Using Docker for Production
```bash
# Build and start the production environment
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop the production environment
docker-compose -f docker-compose.prod.yml down
```

## Docker Infrastructure Details

Our Docker setup consists of:

- **Development Environment**: 
  - Hot-reload enabled for both frontend and backend
  - Local volume mounts for real-time code updates
  - NGINX for routing
  - MongoDB without authentication for ease of development

- **Production Environment**:
  - Optimized builds with minimal dependencies
  - NGINX with proper caching and security headers
  - MongoDB with authentication
  - SSL/TLS support via Certbot
  - Persistent volumes for database and uploads

## Testing

### Running Backend Tests
```bash
cd backend
npm test
```

### Running Frontend Tests
```bash
cd frontend
npm test
```

### Running Tests in Docker
```bash
docker-compose exec backend npm test
docker-compose exec frontend npm test
```

## Project Structure

```
├── backend/             # Backend Node.js/Express application
├── frontend/            # Frontend React application
├── nginx/               # NGINX configurations
│   ├── dev.conf         # Development NGINX configuration
│   └── prod.conf        # Production NGINX configuration
├── docker-compose.yml         # Docker Compose for development
├── docker-compose.prod.yml    # Docker Compose for production
├── .env.development           # Development environment variables
└── .env.production            # Production environment variables
```

## API Documentation

The API documentation is available at `/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Can Ahmet Ozguven - [canahmetozguven@gmail.com](mailto:canahmetozguven@gmail.com)

Project Link: [https://github.com/yourusername/legal-counseling-website](https://github.com/yourusername/legal-counseling-website)

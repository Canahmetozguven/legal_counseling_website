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

## Prerequisites

- Node.js (v14.0.0 or later)
- MongoDB (v4.4 or later)
- NPM or Yarn

## Installation

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

## Running the Application

### Development Mode

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

### Production Mode

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

## Project Structure

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── utils/
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── pages/
│       └── utils/
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

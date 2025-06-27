# ClearSky - Grade Management & Review System

A comprehensive microservices-based grade management and review system for educational institutions, developed as part of SAAS 2025 at ECE NTUA.

## 🚀 Overview

ClearSky is a modern web application that streamlines grade management, review processes, and academic analytics for universities and educational institutions. Built with a microservices architecture, it provides role-based access for students, instructors, and institutional representatives.

## 🏗️ Architecture

### Microservices Architecture
The system is composed of 5 independent microservices and a React frontend

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM 6** - Client-side routing
- **Styled-jsx** - Component styling
- **Google OAuth** - Authentication

### Backend
- **Node.js & Express 5** - Server framework
- **Sequelize ORM** - Database abstraction
- **JWT** - Authentication tokens
- **RabbitMQ (AMQP)** - Message queuing
- **Multer** - File upload handling
- **ExcelJS/XLSX** - Spreadsheet processing

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **MySQL 8** - Primary database
- **phpMyAdmin** - Database management
- **CORS** - Cross-origin resource sharing

## 🌟 Key Features

### 1. User Management
- **Three distinct roles**: Students, Instructors, Representatives
- **Google OAuth integration** for seamless authentication
- **JWT-based sessions** with configurable expiration
- **Role-based access control** throughout the application

### 2. Grade Management
- **Excel file upload** for bulk grade entry by instructors
- **Grade states management** (Open, Closed, etc.)
- **Examination linking** to courses and semesters
- **Real-time grade visibility** for students

### 3. Review System
- **Student-initiated review requests** for grade disputes
- **Instructor review management** dashboard
- **State-based workflow** for review processing
- **Audit trail** for all review actions

### 4. Analytics & Statistics
- **Performance metrics** for students and instructors
- **Course-level analytics** and trends
- **Examination statistics** and comparisons
- **Institution-wide reporting** capabilities

### 5. Institution Management
- **Multi-tenancy support** for different institutions
- **Representative dashboard** for institution management
- **Credit system** for resource allocation
- **Institution-specific configurations**

## 📁 Project Structure

```
clearsky_final_frontend_integration/
├── clearsky-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── App.jsx          # Main application
│   └── package.json
├── src/
│   ├── models/               # Shared data models
│   ├── services/            # Microservices implementations
│   │   ├── grades/          # Grades microservice
│   │   ├── review-management/ # Review microservice
│   │   ├── statistics/      # Statistics microservice
│   │   ├── user-management/ # User management microservice
│   │   └── institution/     # Institution microservice
│   └── tests/              # Test suites
├── ai-log/                  # Logging system with archives
├── docker-compose.yml       # Multi-container orchestration
└── init.sql                # Database initialization
```

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 16+ (for local development)
- Google OAuth credentials (for authentication)

### Quick Start
1. Clone the repository
2. Configure environment variables
3. Run with Docker Compose:
   ```bash
   docker-compose up
   ```
4. Access the application at `http://localhost:5173`

### Service Endpoints
- Frontend: `http://localhost:5173`
- User Management API: `http://localhost:3004`
- Grades API: `http://localhost:3002`
- Review Management API: `http://localhost:3003`
- Statistics API: `http://localhost:3001`
- Institution API: `http://localhost:3005`
- RabbitMQ Management: `http://localhost:15672`
- phpMyAdmin: `http://localhost:8080`

## 🔐 Security Features

- **JWT Authentication** with configurable secrets
- **CORS configuration** for secure cross-origin requests
- **Role-based access control** at API and UI levels
- **Secure password handling** (implementation review recommended)
- **Input validation** across all services

## 📊 Database Schema

The MySQL database includes comprehensive tables for:
- User management (`students`, `teachers`, `representatives`)
- Academic data (`institutions`, `examinations`, `grades`)
- Review workflow (`reviews`, `review_states`)
- Authentication (`credentials`, `tokens`)
- System tracking (`logs`, `uploads`)

## 🚢 Deployment

### Development
- Uses Docker Compose for local development
- Hot reload enabled via Vite
- Separate Dockerfiles for dev/prod environments

### Production
- Frontend deployable to Netlify/Vercel
- Backend microservices containerized for cloud deployment
- Environment-based configuration support
- Scalable microservices architecture

## 👥 Team

Developed by the SAAS 2025 team at ECE NTUA (National Technical University of Athens).


*ClearSky - Simplifying academic grade management through modern web technologies and microservices architecture.*

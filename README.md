# 🍽️ Restaurant Menu Management System

A full-stack web application for managing restaurant menus with admin authentication and customer view.

## Features

### Customer Features
- View restaurant menu organized by categories
- Browse dishes with images, descriptions, and prices
- Responsive design for mobile and desktop
- Real-time menu updates

### Admin Features
- Secure login system with JWT authentication
- Add, edit, and delete menu categories
- Add, edit, and delete menu items
- Upload and manage images
- Toggle item availability
- Real-time menu management

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

### Frontend
- **React** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP requests
- **React Toastify** - Notifications

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone and Setup Backend

```bash
# Install backend dependencies
npm install

# Create uploads directory
mkdir uploads

# Setup environment variables
cp .env.example .env
# Edit .env file with your MongoDB URI and JWT secret

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

### 2. Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the React development server
npm start
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Login**: 
  - Username: `admin`
  - Password: `restaurant123`

## Admin Login Credentials

- **Username**: admin
- **Password**: restaurant123

## Deployment

See DEPLOYMENT-GUIDE.md for complete deployment instructions using free hosting services.

## License

This project is licensed under the MIT License.
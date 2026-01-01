# Restro77 - Full Stack Restaurant Management System

Restro77 is a comprehensive full-stack solution for managing a restaurant's digital presence. It includes a robust backend API, a customer-facing frontend for food ordering, and a dedicated admin panel for management.

Vist the website here : https://restro77.com

## 🚀 Project Components

This repository contains three main modules:

1.  **Restro-Frontend**: The customer-facing web application where users can browse menus, place orders, and manage their profile.
2.  **Restro-Backend**: The server-side application handling API requests, database operations, payments, and real-time updates.
3.  **Restro-Admin**: The administrative dashboard for restaurant owners and staff to manage orders, update menus, and view insights.

## 🛠️ Technology Stack

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (with Mongoose)
*   **Real-time**: Socket.IO
*   **Authentication**: JSON Web Tokens (JWT), Clerk SDK
*   **Payments**: Stripe, Razorpay
*   **Security**: bcryptjs, express-rate-limit, validator

### Frontend (User App)
*   **Framework**: React (Vite)
*   **Routing**: React Router DOM
*   **State/API**: Axios, Context API
*   **Real-time**: Socket.IO Client
*   **UI/UX**: React Icons, React Toastify, Canvas Confetti
*   **Services**: Firebase

### Admin Panel
*   **Framework**: React (Vite)
*   **Routing**: React Router DOM
*   **Real-time**: Socket.IO Client
*   **UI Tools**: React Toastify, React Icons

## ⚙️ Usage & Installation

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB (Local or Atlas connection string)
*   npm or yarn

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Restro-Backend/Restro77-backend
npm install
```
Start the server:
```bash
npm run server
```
*Note: Ensure you have a `.env` file configured with your database URI and API keys.*

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd Restro-Frontend/Restro77-frontend
npm install
```
Start the development server:
```bash
npm run dev
```

### 3. Admin Panel Setup
Navigate to the admin directory:
```bash
cd Restro77-admin-main
npm install
```
Start the admin dashboard:
```bash
npm run dev
```

## ✨ Key Features
*   **Real-time Order Tracking**: Updates provided via Socket.IO across user and admin interfaces.
*   **Secure Payments**: Integrated with industry-standard payment gateways like Stripe and Razorpay.
*   **Menu Management**: Easy-to-use admin interface for updating food items and categories.
*   **Responsive Design**: Optimized for both desktop and mobile usage.

## 🤝 Contributing
1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

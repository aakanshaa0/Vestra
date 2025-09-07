# VESTRA Ecommerce

A full-stack ecommerce platform built with the MERN stack.

## Features

- **Authentication**: JWT-based user and admin authentication
- **Product Management**: CRUD operations with filters and search
- **Shopping Cart**: Add/remove items with persistence
- **Payment Integration**: Stripe payment processing
- **Admin Panel**: Product and order management
- **Responsive Design**: Tailwind CSS styling

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Cloudinary
- **Payments**: Stripe

## Quick Start

### Prerequisites
- Node.js
- MongoDB
- Cloudinary account
- Stripe account

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Admin Panel**
   ```bash
   cd admin
   npm install
   npm run dev
   ```

## Environment Variables

Create `.env` files in the backend folder:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@vestra.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## API Endpoints

- **Auth**: `/api/user/register`, `/api/user/login`
- **Products**: `/api/product/add`, `/api/product/list`
- **Cart**: `/api/cart/add`, `/api/cart/get`
- **Orders**: `/api/order/place`, `/api/order/list`
- **Admin**: `/api/user/admin`, `/api/user/admin-register`

## Project Structure

```
├── frontend/          # React frontend
├── backend/           # Express.js API
├── admin/             # Admin panel
└── README.md
```

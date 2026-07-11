# 🏋️ GearUp - Sports & Outdoor Gear Rental API

A robust RESTful Backend API for renting sports and outdoor equipment. Customers can browse and rent gear, providers can manage inventory, and admins can manage the entire platform.

---

# 🚀 Live Links

**Backend Repository:**  
https://github.com/Asadul1120/gearup-server.git

**Live API:**  
https://gearup-server.onrender.com

**API Documentation:**  
https://documenter.getpostman.com/view/xxx

**Demo Video:**  
https://drive.google.com/file/d/xxx/view

---

# 👨‍💼 Admin Credentials

**Email:** admin@gmail.com

**Password:** 12345678

---

# ✨ Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Role Based Authorization
- Current User Profile

---

## User Module

- Get All Users (Admin)
- Get Single User
- Update User Profile
- Suspend / Activate User
- Delete User

---

## Category Module

- Create Category
- Get All Categories
- Get Single Category
- Update Category
- Delete Category

---

## Gear Module

- Add New Gear
- Get All Gear
- Search Gear
- Filter Gear
- Update Gear
- Delete Gear

---

## Rental Module

- Create Rental Order
- View My Rentals
- View Single Rental
- Provider Incoming Orders
- Update Rental Status

Rental Status:

- PLACED
- CONFIRMED
- PAID
- PICKED_UP
- RETURNED
- CANCELLED

---

## Payment Module

Integrated with **Stripe Checkout**

Features:

- Create Checkout Session
- Stripe Webhook
- Payment History
- Payment Details

Payment Status:

- PENDING
- COMPLETED
- FAILED

---

## Review Module

- Create Review
- Get Gear Reviews
- Delete Review

Customers can review only after returning rented gear.

---

# 👥 User Roles

## Customer

- Register
- Login
- Browse Gear
- Rent Gear
- Make Payment
- View Rentals
- Review Gear

---

## Provider

- Manage Categories
- Manage Gear Inventory
- View Incoming Orders
- Update Rental Status

---

## Admin

- Manage Users
- Manage Categories
- Delete Gear
- Delete Reviews

---

# 🛠️ Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT
- bcryptjs
- Cookie Parser

## Payment

- Stripe Checkout
- Stripe Webhook


## Others

- CORS
- dotenv
- HTTP Status
- Express Async Handler

---

# 📁 Project Structure

```
src
│
├── app.ts
├── server.ts
│
├── config
├── middleware
├── errors
├── utils
├── lib
│
└── modules
    ├── auth
    ├── user
    ├── category
    ├── gear
    ├── rental
    ├── payment
    └── review
```

---

# ⚙️ Environment Variables

Create a `.env` file.

```env
PORT=5000

DATABASE_URL=

APP_URL=http://localhost:5000

CLIENT_URL=http://localhost:5173

BCRYPT_SALT_ROUNDS=10

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=7d


STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=
```

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/Asadul1120/gearup-server.git
```

Go to project

```bash
cd gearup-server
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev
```

Start Development Server

```bash
npm run dev
```

---

# 📚 API Endpoints

## Authentication

```
POST    /api/auth/register
POST    /api/auth/login
GET     /api/auth/me
```

---

## Users

```
GET     /api/users
GET     /api/users/:id
PATCH   /api/users
PUT     /api/users/status/:id
DELETE  /api/users/:id
```

---

## Categories

```
GET     /api/categories
GET     /api/categories/:id
POST    /api/categories
PATCH   /api/categories/:id
DELETE  /api/categories/:id
```

---

## Gear

```
GET     /api/gear
GET     /api/gear/:id
POST    /api/gear
PUT     /api/gear/:id
DELETE  /api/gear/:id
```

---

## Rentals

```
POST    /api/rentals
GET     /api/rentals
GET     /api/rentals/:id

GET     /api/rentals/provider/orders
PATCH   /api/rentals/provider/orders/:id
```

---

## Payments

```
POST    /api/payments/create
POST    /api/payments/webhook

GET     /api/payments
GET     /api/payments/:id
```

---

## Reviews

```
POST    /api/reviews
GET     /api/reviews/:gearId
DELETE  /api/reviews/:id
```

---

# 🔐 Authentication

Use JWT Token

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 📄 API Documentation

Postman Documentation

https://documenter.getpostman.com/view/xxx

---

# 🚀 Deployment

Backend is deployed on Render.

https://gearup-server.onrender.com

---

# 👨‍💻 Author

**Asadul Islam**

student of **Programming Hero**
student id: **L2B7-1205**


GitHub:

https://github.com/Asadul1120

---

# 📜 License

This project is developed for the **Programming Hero Backend Assignment-4**.
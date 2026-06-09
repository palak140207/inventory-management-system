# 📦 Inventory Management System

A full-stack Inventory Management System built with the MERN stack.

## Tech Stack

### Backend
- **Node.js** + **Express.js** — REST API server
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing

### Frontend
- **React** (Vite) — UI framework
- **React Router** — Client-side routing
- **Axios** — HTTP client
- **Tailwind CSS v4** — Styling
- **Lucide React** — Icons

---

## Features

- 🔐 **Authentication** — Register, Login, JWT-protected routes
- 📊 **Dashboard** — Stock valuation, low stock alerts, category distribution, recent transactions
- 📦 **Products** — Full CRUD with search, filters, sorting & pagination
- 🏷️ **Categories** — Create, edit, delete categories
- ↕️ **Stock In / Stock Out** — Record all inventory movements
- ⚠️ **Low Stock Alerts** — Threshold-based warnings
- 📜 **Transaction Logs** — Full audit history of all stock changes

---

## Folder Structure

```
inventory-management-system/
├── backend/
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & error handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express route definitions
│   ├── .env                # Environment variables (not tracked)
│   └── server.js           # Entry point
└── frontend/
    └── src/
        ├── components/     # Reusable UI components
        ├── context/        # Auth context
        ├── pages/          # Page views
        └── services/       # Axios API client
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/palak140207/inventory-management-system.git
cd inventory-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/<dbname>?appName=Cluster0
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT token |
| GET | `/api/auth/me` | Protected | Get current user |
| GET | `/api/categories` | Protected | List all categories |
| POST | `/api/categories` | Protected | Create a category |
| PUT | `/api/categories/:id` | Protected | Update a category |
| DELETE | `/api/categories/:id` | Protected | Delete a category |
| GET | `/api/products` | Protected | List products (search/filter/paginate) |
| POST | `/api/products` | Protected | Create a product |
| PUT | `/api/products/:id` | Protected | Update a product |
| DELETE | `/api/products/:id` | Protected | Delete a product |
| POST | `/api/transactions/stock-in` | Protected | Add stock |
| POST | `/api/transactions/stock-out` | Protected | Dispatch stock |
| GET | `/api/transactions` | Protected | Transaction history |
| GET | `/api/dashboard/stats` | Protected | Dashboard metrics |

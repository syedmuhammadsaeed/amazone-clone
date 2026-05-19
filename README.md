# Full-Stack Amazon Clone Lab Project

This project is a complete full-stack e-commerce application built for a university lab task.

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT and bcrypt
- API testing: Postman

## Features

- Product listing with image, name, price, category, rating, search, and category filter
- Product detail page with description, stock status, quantity selector, and Add to Cart
- User registration and login with JWT authentication
- Cart with quantity update, remove item, subtotal, and localStorage persistence
- Order placement for logged-in users
- Customer order history
- Admin dashboard for product add, edit, delete, and update
- Admin order list with order status update
- Protected customer routes and admin-only routes
- Seed script with 10 sample products and demo users

## Folder Structure

```text
backend/
  config/
  controllers/
  data/
  middleware/
  models/
  routes/
  scripts/
  server.js
frontend/
  src/
    components/
    context/
    pages/
    utils/
```

## Backend Setup

1. Open a terminal in `backend`.
2. Install dependencies:

```bash
npm install
```

3. Create your `.env` file from the example:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Make sure MongoDB is running locally, or replace `MONGO_URI` with your MongoDB Atlas connection string.
5. Seed the database:

```bash
npm run seed
```

6. Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

## Frontend Setup

1. Open a second terminal in `frontend`.
2. Install dependencies:

```bash
npm install
```

3. Optional: create `.env` from `.env.example` if you want to set the API URL manually.
4. Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Demo Accounts

After running the seed script:

- Admin: `admin@example.com` / `123456`
- Customer: `customer@example.com` / `123456`

## Required API Routes

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin only
- `PUT /api/products/:id` admin only
- `DELETE /api/products/:id` admin only

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Orders

- `POST /api/orders` logged-in users
- `GET /api/orders/my` logged-in users
- `GET /api/orders` admin only
- `PUT /api/orders/:id` admin only

## Postman Testing Guidance

Set a Postman environment variable:

- `baseUrl`: `http://localhost:5000`
- `token`: paste the JWT returned from login

### Test Flow

1. Register:

`POST {{baseUrl}}/api/auth/register`

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

2. Login:

`POST {{baseUrl}}/api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "123456"
}
```

Copy the returned `token`.

3. Use protected routes with this header:

```text
Authorization: Bearer {{token}}
```

4. List products:

`GET {{baseUrl}}/api/products`

5. Create product as admin:

`POST {{baseUrl}}/api/products`

```json
{
  "name": "USB-C Hub",
  "image": "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80",
  "brand": "PortPro",
  "category": "Computers",
  "description": "Compact USB-C hub with HDMI, USB, and SD card ports.",
  "price": 39.99,
  "countInStock": 20,
  "rating": 4.5,
  "numReviews": 12
}
```

6. Place order as a customer:

`POST {{baseUrl}}/api/orders`

```json
{
  "orderItems": [
    {
      "name": "Echo Dot Smart Speaker",
      "quantity": 1,
      "image": "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=900&q=80",
      "price": 49.99,
      "product": "PASTE_PRODUCT_ID_HERE"
    }
  ],
  "shippingAddress": {
    "address": "Street 1",
    "city": "Lahore",
    "postalCode": "54000",
    "country": "Pakistan"
  },
  "paymentMethod": "Cash on Delivery",
  "itemsPrice": 49.99,
  "shippingPrice": 8.99,
  "taxPrice": 4,
  "totalPrice": 62.98
}
```

7. View customer orders:

`GET {{baseUrl}}/api/orders/my`

8. View all orders as admin:

`GET {{baseUrl}}/api/orders`

9. Update order status as admin:

`PUT {{baseUrl}}/api/orders/ORDER_ID`

```json
{
  "status": "Shipped"
}
```

## Deployment Notes

- Backend can be deployed to Render, Railway, or cyclic-style Node hosting.
- Frontend can be deployed to Netlify or Vercel.
- Use MongoDB Atlas for a live database.
- Set production environment variables on the hosting platform.
- Update `FRONTEND_URL` on the backend and `VITE_API_URL` on the frontend for the live URLs.

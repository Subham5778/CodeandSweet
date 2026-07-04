# CodeandSweet - Cacao & Confection

CodeandSweet is a full-stack MERN web application for a sweet shop and restaurant ordering experience. Customers can browse sweets, cakes, chocolates, and food items, add products to cart, place delivery or dine-in table orders, track their order details, and review items after purchase.

The admin dashboard supports product management, stock control, availability toggles, and sales/order tracking.

---

## Live Links

- Frontend: [https://codeand-sweet.vercel.app/](https://codeand-sweet.vercel.app/)
- Backend API: [https://codeandsweet.onrender.com/api](https://codeandsweet.onrender.com/api)

---

## Tech Stack

### Frontend

- React.js with Vite
- Tailwind CSS and custom CSS
- Framer Motion
- Central API request helper

### Backend

- Node.js and Express.js
- MongoDB and Mongoose
- JWT authentication
- bcrypt.js password hashing
- Multer upload middleware
- Local uploads and Cloudinary-ready config

---

## Features

### Customer Features

- Browse sweets, cakes, chocolates, and restaurant food.
- Food menu sections include Chinese, Bihari, and Rajasthani categories.
- Search and filter products by menu section and category.
- Add items to cart and checkout securely.
- Choose delivery or restaurant table service.
- Delivery is limited to India.
- Dine-in orders require a table number.
- Receipt email is shown from the logged-in user account.
- Order history shows items, payment method, address or table number, and tracking status.
- Customers can submit or update reviews only for products they purchased.

### Admin Features

- Add, edit, delete, and restock products.
- Mark products available or unavailable for ordering.
- Stock decreases automatically after checkout.
- View sales, total transactions, revenue, best-selling product, customer email, order type, and tracking details.
- Manage sweets and food products from the same catalog panel.

---

## Project Structure

```text
CodeandSweet/
|-- backend/
|   |-- app.js
|   |-- server.js
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- seed/
|   |-- uploads/
|   `-- package.json
|
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- index.html
|   `-- package.json
|
|-- Admin Panel.png
|-- Cart.png
|-- Homepage.png
|-- Register.png
`-- README.md
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Subham5778/CodeandSweet.git
cd CodeandSweet
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in `backend/` with:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Optional frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Screenshots

Update these image files when you refresh the project screenshots. The README already points to the current filenames.

### Homepage and Menu

![Homepage](./Homepage.png)

### Cart and Checkout

![Cart](./Cart.png)

### Login and Register

![Register](./Register.png)

### Admin Dashboard

![Admin Panel](./Admin%20Panel.png)

---

## Main API Areas

- `/api/auth` - register, login, current user
- `/api/sweets` - product catalog and admin product actions
- `/api/cart` - logged-in cart
- `/api/transactions` - checkout, order history, admin sales
- `/api/reviews` - purchased product reviews

---

## Author

**Subham Kumar**  
B.Tech CSE | Full Stack Developer

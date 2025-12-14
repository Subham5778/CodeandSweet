🍰 CodeandSweet – Full Stack E-commerce Application

CodeandSweet is a full-stack e-commerce web application built using the MERN stack. The project allows users to browse sweets, add items to a cart, register/login, and place orders. It also includes an Admin Panel for managing products.


---

🚀 Tech Stack

Frontend

React.js (Vite)

Tailwind CSS

React Hooks & Components

Axios / Fetch API


Backend

Node.js

Express.js

MongoDB Atlas

JWT Authentication

bcrypt.js for password hashing



---

📂 Project Structure

CodeandSweet/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Sweet.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── sweets.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md


---

✨ Features

User Features

User Registration & Login

View sweets/products

Add to cart

Increase / decrease quantity

Remove items from cart

Responsive UI


Admin Features

Admin panel

Add / update / delete products

Manage product images



---

🔐 Environment Variables

Backend (backend/.env)

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key

Frontend (frontend/.env)

VITE_API_BASE_URL=https://your-backend-url/api


---

🛠 Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/your-username/CodeandSweet.git
cd CodeandSweet

2️⃣ Backend Setup

cd backend
npm install
npm run dev

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev


---

🌍 Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas


Make sure environment variables are added in Vercel Dashboard for both frontend and backend.


---

📸 Screenshots

Add screenshots of Home Page, Cart Page, Login/Register, and Admin Panel here.


---

🧑‍💻 Author

Subham Kumar
B.Tech CSE | Full Stack Developer


---

⭐ Support

If you like this project, give it a ⭐ on GitHub and feel free to contribute!

# 🎉 Prezify

Welcome to **Prezify**, a full-stack web application built using **Next.js** for the frontend and **Express.js** for the backend. Prezify is designed to offer a seamless development experience, combining modern technologies like **MongoDB**, **GrapesJS**, **Socket.IO**, and **Radix UI**.

---

## ✨ Features

- ⚡ Full-stack with Next.js & Express.js
- 🛢️ MongoDB integration with Mongoose
- 🎨 Visual Editor using GrapesJS
- 🧰 Form management using react-hook-form & Zod
- 📡 Real-time communication with Socket.IO
- 🎨 Styled with Tailwind CSS & Radix UI
- 🔐 Secure JWT-based authentication
- 📩 Email support via Nodemailer
- 📂 File uploads with Multer

---

## 📂 Project Structure


---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Prezify

2. Install dependencies
npm install


3. Setup environment variables
Create a .env file at the project root and add the following:

MONGO_URI=mongodb://localhost:27017/prezify
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_pass


📦 Available Scripts

Command	Description
npm run dev	Runs frontend (Next.js) and backend (Express.js) together in development mode
npm run dev:local	Same as above but using NODE_ENV=local
npm run dev:next	Runs only the Next.js frontend
npm run dev:server	Runs only the Express.js backend
npm run build	Builds the Next.js frontend
npm run start	Starts the production Next.js server (after build)
npm run prod	Builds Next.js & starts Express.js in production mode


NODE_ENV=production node app/server/server.js


npm run prod



---

### Copy-paste this directly into your `README.md`. Let me know if you want me to create a `.env.example` file too!

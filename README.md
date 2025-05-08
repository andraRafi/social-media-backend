# 📱 Social Media Backend API

This is the backend API for a social media application (clone instagram) built with **Node.js**, **Express**, and **MongoDB**, featuring **real-time communication** via **Socket.IO** for Direct Messaging and Notifications.

## 🚀 Features

- ✅ User authentication (Login, Register, JWT)
- 👤 Account management (update bio, username)
- 📰 Feed posting and comments
- 💬 Nested comments
- 🤝 Follow / Unfollow system
- 🔍 Search users and posts
- 📩 Real-time Direct Messaging
- 🔔 Real-time notifications (follow, comment, message)

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO (WebSocket-based real-time communication)
- Multer (image upload handling)
- TypeScript
- JWT (authentication)
- Cookie-based refresh tokens
- NodeMailer (otp)

## 🧪 Getting Started

### 1. Clone the repository & install dependencies

```bash
git clone https://github.com/username/social-media-backend.git
cd social-media-backend
npm install
```

### 2. Create a `.env` file

```env
PORT=5000
CONNECTION_STRING=mongodb://localhost:27017/socialmedia
JWT_SECRET=your_jwt_secret
EMAIL_USER=
EMAIL_PASSWORD=
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Build & run for production

```bash
npm run build
npm start
```

## ✨ Contributing

Pull Requests are welcome. Please make sure features are working properly and tested with Postman or frontend WebSocket clients before submitting a PR.

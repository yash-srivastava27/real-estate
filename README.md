# BUY SELL RENT 🏡

**BUY SELL RENT** is a modern, full‑stack web platform to **buy**, **sell**, and **rent** properties with ease. Built on the MERN stack with secure authentication, an intuitive UI, and robust API endpoints—perfect for demonstrating full‑stack proficiency in interviews.

---

## 📌 Table of Contents

1. [✨ Highlights](#-highlights)
2. [🚀 Features](#-features)
3. [🛠 Tech Stack](#-tech-stack)
4. [🏗 Architecture](#-architecture)
5. [⚙️ Installation & Setup](#️-installation--setup)
6. [📂 Project Structure](#-project-structure)
7. [🎯 Usage Workflow](#-usage-workflow)
8. [💡 Future Enhancements](#-future-enhancements)
9. [📜 License](#-license)

---

## ✨ Highlights

* **Secure Auth**: JWT‑based sessions and Google OAuth. 🔒
* **Image Uploads**: Used Cloudinary 📸
* **Dynamic Search**: Real‑time filtering and sorting of listings. 🔎
* **In‑App Messaging**: Connect buyers and sellers directly. 💬

---

## 🚀 Features

* **User Accounts**: Signup, login, password hashing, and secure JWT. 🎫
* **OAuth Integration**: One‑click sign‑in with Google. 🟢
* **CRUD Listings**: Create, read, update, delete property listings.
* **Image Management**: Upload, preview, and delete listing images.
* **Advanced Search**: Filter by location, price range, and type.
* **User Dashboard**: Manage profile, listings, and messages.

---

## 🛠 Tech Stack

|           Layer | Technology                                        |
| --------------: | ------------------------------------------------- |
|     **Backend** | Node.js, Express.js, MongoDB, Mongoose            |
|        **Auth** | JSON Web Tokens, Google OAuth, bcrypt             |
| **File Upload** | Cloudinary                                        |
|    **Frontend** | React, Vite, Redux Toolkit, React Router          |
|     **Styling** | CSS Modules (Optionally Tailwind CSS)             |
|  **Deployment** | Render                                            |

---

## 🏗 Architecture

```
[Client: React]  <-->  [Server: Express API]  <-->  [Database: MongoDB]
```

* **Client**: Component‑driven, state‑managed UI using Redux Toolkit.
* **Server**: RESTful API with layered controllers, middleware, and services.
* **Database**: NoSQL schema design for users, listings, and messages.

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js ≥ v14
* npm or yarn
* MongoDB instance (Atlas or local)

### Steps

1. **Clone Repo**

   ```bash
   git clone https://github.com/kushalgupta1906/real-state.git
   cd real-state
   ```
2. **Install Dependencies**

   ```bash
   # backend
   cd backend && npm install

   # frontend
   cd ../client && npm install
   ```

3. **Run Application**

   ```bash
   # Terminal A: backend
    npm run dev

   # Terminal B: Frontend
   cd client && npm run dev

   ```
5. **Access**: Open `http://localhost:5173`

---

## 📂 Project Structure

```
realestate-pro/
├── backend/
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # Auth & error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── index.js        # Entry point
└── client/
    ├── public/         # Static assets
    ├── src/
    │   ├── components/ # Reusable UI pieces
    │   ├── pages/      # Route-level views
    │   ├── redux/      # Slices & store
    │   └── main.jsx    # App init
    └── vite.config.js
```

---


## 🎯 Usage Workflow

1. **Sign Up / Login** via form or Google OAuth.
2. **Browse & Search** listings with dynamic filters.
3. **Create** a new property listing with images.
4. **Manage** your listings and profile in the dashboard.

---

## 💡 Future Enhancements

* Real‑time chat with WebSockets. 🔄
* Map‑based search integration (Google Maps). 🗺
* Admin panel for moderation. ⚙️
* Analytics dashboard & metrics. 📊

---


## 📜 License

This project is licensed under the **MIT License**. 

---


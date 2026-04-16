# ExamPortal — Full-Stack Online Quiz & Exam Platform

ExamPortal is a production-ready, high-performance examination platform built with a modern tech stack. It features real-time timers, auto-saving progress, administrative proctoring tools, and a global leaderboard.

## 🚀 Quick Start

### 1. Installation
Run the following command from the root directory to install all dependencies for both backend and frontend:
```bash
npm run install:all
```

### 2. Environment Setup
The project uses **Turso (LibSQL)** for the database. Ensure the `.env` file in the `backend` directory is correctly configured (provided by default):
```env
PORT=5000
JWT_SECRET=quiz_platform_super_secret_jwt_key_2025
TURSO_URL=libsql://exam-portal-anchalaprasanth82-maker.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=...
```

### 3. Running the App
Start both the backend server and frontend client concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 🔑 Demo Credentials

- **Admin Account:**
  - Email: `admin@quizapp.com`
  - Password: `Admin@123`
- **Student Account:**
  - Email: `alice@student.com`
  - Password: `Alice@123`

## ✨ Features

- **For Students:**
  - **Dynamic Exam Interface**: Adaptive layout for MCQ, Short Answer, and Coding questions.
  - **Auto-Save**: Progress is automatically synced every 5 seconds.
  - **Server-Side Timer**: Reliable countdown that persists across page refreshes.
  - **Global Leaderboard**: Real-time ranking with tie-breaking logic.
  
- **For Admins:**
  - **Dashboard Analytics**: Overview of student performance and platform growth.
  - **Exam Builder**: Create, edit, and publish certifications.
  - **Bulk Import**: Upload hundreds of questions via Excel/CSV.
  - **Manual Overrides**: Grant retake permissions and manage students.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Monaco Editor.
- **Backend**: Node.js, Express, LibSQL (Turso), JWT, Bcrypt.
- **Services**: Multer (Uploads), XLSX (Parsing), Cron (Timer cleanup).

## 📁 Project Structure

- `/backend`: Express API, Turso config, controllers, and services.
- `/frontend`: React source, Tailwind config, and Vite build setup.
- `/uploads`: Temporary storage for imported Excel files.

---
Built with ❤️ for High-Performance Education.

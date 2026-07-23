<div align="center">

# 🗂️ Attendance Management System

### A production-grade employee attendance tracking platform built with the MERN Stack

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Coming%20Soon-blue?style=for-the-badge)](https://github.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Madhusudan04337/ams)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

![Node](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Role-Based Access](#-role-based-access)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🌟 Overview

The **Attendance Management System** is a full-stack web application that digitizes and automates employee attendance tracking, leave management, and HR reporting for organizations of any size.

This is **not a basic CRUD application**. It implements real-world engineering patterns:

- 🔄 **JWT Refresh Token Rotation** — seamless session management without forcing re-login
- 🛡️ **Multi-layer Security** — Helmet, rate limiting, bcrypt, RBAC
- 🏗️ **Production MVC Architecture** — feature-based modules, clean separation of concerns
- 🗄️ **Database-level Duplicate Prevention** — compound indexes handling race conditions
- 📋 **Complete Audit Trail** — every action logged with performer, IP, and timestamps
- ⚡ **Real-time Updates** — Socket.io live attendance feed *(in progress)*

---

## 🔗 Live Demo

| Environment | URL |
|-------------|-----|
| Production | Coming soon after deployment |
| Local API | http://localhost:5000 |

### Demo Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| 👑 Admin | admin@ams.com | Admin@123 | Full system access |
| 👔 Manager | manager@ams.com | Manager@123 | Team management |
| 👤 Employee | employee@ams.com | Employee@123 | Own data only |

---

## ✨ Features

### ✅ Completed
- 🔐 JWT Authentication with Refresh Token Rotation
- 👥 Role-Based Access Control (Admin / Manager / Employee)
- 📅 Attendance Marking with Check-in Timestamp
- 📊 Attendance History with Pagination + Date/Status Filters
- ✏️ Admin/Manager Attendance Rectification with Audit Trail
- 🏖️ Leave Management with Multi-level Approval Workflow
- 💰 Leave Balance Tracking — Casual / Sick / Earned
- 📈 Analytics — Monthly Summary + Department Breakdown
- 📋 Audit Trail — Every action logged with IP + UserAgent
- 📤 Excel Report Export with professional styling
- 🛡️ Security — Helmet, Rate Limiting, CORS, bcrypt (12 rounds)
- 🚫 Centralized Error Handling — one handler for entire app
- 🗂️ API Versioning — /api/v1/
- 📦 Feature-based MVC Architecture

### ⏳ In Progress / Planned
- ⚡ Real-time Updates via Socket.io
- 📊 Analytics Charts with Recharts
- 📧 Email Notifications via Nodemailer
- 📍 Geolocation-based Check-in
- 🖼️ Profile Photo Upload via Cloudinary
- 🚀 Full Deployment on Render + Vercel

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime environment |
| Express.js | v4.18 | Web framework |
| MongoDB Atlas | Latest | Cloud database |
| Mongoose | v8 | ODM with schema validation |
| jsonwebtoken | v9 | JWT auth tokens |
| bcryptjs | v2.4 | Password hashing |
| Helmet | v8 | Security HTTP headers |
| express-rate-limit | v8 | Brute force protection |
| ExcelJS | v4 | Excel report generation |
| Socket.io | v4 | Real-time communication |
| dotenv | v16 | Environment variables |

### Frontend (In Progress)
| Technology | Purpose |
|------------|---------|
| React.js v18 | UI framework |
| Context API + useReducer | State management |
| Axios + Interceptors | HTTP client with auto token refresh |
| React Router v6 | Client-side routing |
| Recharts | Data visualization |
| TailwindCSS | Styling |

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────┐
│              CLIENT (React.js)                │
│   Admin Dashboard │ Manager View │ Employee   │
│   Analytics Charts │ Leave UI │ Notifications │
└───────────────────────┬──────────────────────┘
                        │ HTTPS + WebSocket
┌───────────────────────▼──────────────────────┐
│           API GATEWAY (Express.js)            │
│   Helmet │ CORS │ Rate Limit │ Body Parser    │
│   JWT Verify │ RBAC Guard │ Joi Validation    │
└───────────────────────┬──────────────────────┘
                        │
┌───────────────────────▼──────────────────────┐
│          BUSINESS LOGIC (Services)            │
│   Auth │ Attendance │ Leave │ Analytics       │
│   Audit │ Export │ Notifications              │
└───────────────────────┬──────────────────────┘
                        │
┌───────────────────────▼──────────────────────┐
│          DATA LAYER (MongoDB Atlas)           │
│   User │ Attendance │ LeaveRequest            │
│   RefreshToken │ AuditLog                     │
└──────────────────────────────────────────────┘
```

### Request Lifecycle
```
POST /api/v1/attendance/mark

Rate Limiter → CORS → Body Parser → verifyToken
→ requireRole("employee") → markAttendance()
→ AuditLog.create() → Socket.io emit → 201 Response
```

---

## 🚀 Getting Started

### Prerequisites
```
Node.js   v18 or higher
npm       v8 or higher
MongoDB Atlas account (free tier works)
Git
```

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/attendance-management-system.git
cd attendance-management-system
```

**2. Install backend dependencies**
```bash
cd server
npm install
```

**3. Create environment file**
```bash
# Create .env inside server/ folder
```

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ams
JWT_SECRET=your_minimum_32_character_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:3000
```

**4. Start development server**
```bash
npm run dev
```

**5. Verify**
```
GET http://localhost:5000
Response: { "success": true, "message": "AMS API is running." }
```

> Detailed setup → [server/README.md](./server/README.md)

---

## 📁 Project Structure

```
attendance-management-system/
│
├── README.md                        ← Project overview (you are here)
│
├── server/                          ← Node.js + Express Backend
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── rbac.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── LeaveRequest.js
│   │   ├── RefreshToken.js
│   │   └── AuditLog.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── analytics/
│   │   └── audit/
│   ├── utils/
│   │   ├── ApiResponse.js
│   │   ├── ApiError.js
│   │   ├── constants.js
│   │   └── generateTokens.js
│   ├── app.js
│   ├── server.js
│   ├── .env                         ← Never pushed to GitHub
│   ├── .gitignore
│   ├── package.json
│   └── README.md                    ← Backend technical docs
│
└── frontend/                        ← React.js Frontend (in progress)
    ├── src/
    ├── public/
    ├── package.json
    └── README.md                    ← Frontend technical docs
```

---

## 📬 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### All Endpoints

| Module | Method | Endpoint | Auth | Role |
|--------|--------|----------|------|------|
| Auth | POST | `/auth/register` | ❌ | — |
| Auth | POST | `/auth/login` | ❌ | — |
| Auth | POST | `/auth/refresh` | ❌ | — |
| Auth | GET | `/auth/me` | ✅ | All |
| Auth | POST | `/auth/logout` | ✅ | All |
| Attendance | POST | `/attendance/mark` | ✅ | Employee |
| Attendance | GET | `/attendance/my` | ✅ | Employee |
| Attendance | GET | `/attendance/all` | ✅ | Admin, Manager |
| Attendance | PUT | `/attendance/rectify/:id` | ✅ | Admin, Manager |
| Attendance | GET | `/attendance/export` | ✅ | Admin, Manager |
| Leave | POST | `/leave/apply` | ✅ | Employee |
| Leave | GET | `/leave/my` | ✅ | Employee |
| Leave | GET | `/leave/all` | ✅ | Admin, Manager |
| Leave | PUT | `/leave/:id/approve` | ✅ | Admin, Manager |
| Leave | PUT | `/leave/:id/reject` | ✅ | Admin, Manager |
| Analytics | GET | `/analytics/summary` | ✅ | All |
| Analytics | GET | `/analytics/department` | ✅ | Admin, Manager |
| Audit | GET | `/audit/logs` | ✅ | Admin |
| Audit | GET | `/audit/my` | ✅ | All |

> Full request/response examples → [server/README.md](./server/README.md)

---

## 👥 Role-Based Access

```
ADMIN
  ├── Manage all users
  ├── View all attendance
  ├── Rectify any record
  ├── Approve/reject any leave
  ├── View all audit logs
  ├── Department analytics
  └── Export reports

MANAGER
  ├── View team attendance
  ├── Rectify team records
  ├── Approve/reject team leaves
  ├── Department analytics
  └── Export reports

EMPLOYEE
  ├── Mark own attendance
  ├── View own history
  ├── Apply for leave
  ├── View leave status
  └── Own analytics summary
```

---

## 🔒 Security

### Two-Token Auth Flow
```
Login  →  accessToken (15 min)  +  refreshToken (7 days stored in DB)
           ↓ used for every API        ↓ used only to refresh
        Token expires?
           ↓
        Send refreshToken  →  get new accessToken  →  continue silently
           ↓
        Logout?
           ↓
        refreshToken.isRevoked = true  →  token permanently dead
```

### Security Measures
| Layer | Implementation |
|-------|---------------|
| Passwords | bcrypt — 12 salt rounds |
| Tokens | JWT — short-lived access + revocable refresh |
| Headers | Helmet.js — 11 security headers |
| Rate Limiting | 100 req / 15 min / IP |
| CORS | Restricted to frontend origin only |
| Duplicates | MongoDB compound unique index |
| Responses | Password never returned in any response |
| Secrets | All in .env — never in code |
| Deletes | Soft delete only — isActive flag |

---

## 🗺️ Roadmap

### ✅ Phase 1 — Backend Foundation
- [x] MVC architecture with feature-based modules
- [x] JWT authentication with refresh token rotation
- [x] Role-based access control middleware
- [x] Attendance management with compound index
- [x] Leave approval workflow
- [x] Analytics API
- [x] Complete audit logging
- [x] Excel export with ExcelJS

### 🔄 Phase 2 — Frontend (Current)
- [ ] React setup with production folder structure
- [ ] AuthContext + Axios interceptors for silent refresh
- [ ] Protected routes with role-based rendering
- [ ] Employee, Manager, Admin dashboards
- [ ] Leave management UI
- [ ] Analytics charts with Recharts

### 📋 Phase 3 — Advanced Features
- [ ] Socket.io real-time attendance feed
- [ ] In-app notification system
- [ ] Email notifications with Nodemailer
- [ ] PDF report export
- [ ] Geolocation-based check-in

### 🚀 Phase 4 — Production Deployment
- [ ] MongoDB Atlas production cluster
- [ ] Backend on Render
- [ ] Frontend on Vercel
- [ ] GitHub Actions CI/CD
- [ ] Seed script with realistic demo data
- [ ] Performance monitoring

---

## 🎯 Why This Project Stands Out

> This project demonstrates engineering judgment, not just coding ability.

| Decision | What It Shows |
|----------|--------------|
| Refresh token rotation | Understanding of stateless auth security |
| Compound DB index | Concurrency and race condition awareness |
| Feature-based MVC | Scalable architecture thinking |
| Central error handler | Cross-cutting concerns management |
| Soft delete | Data integrity in production systems |
| TTL index on tokens | Database self-maintenance patterns |
| Context API over Redux | Knowing when NOT to use a tool |

---

## 👨‍💻 Author

**Madhusudan**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/Madhusudan04337)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/madhusudan-chennai/)

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**⭐ Star this repository if you found it helpful**

*Built with production-grade practices from day one*

</div>

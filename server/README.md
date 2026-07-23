# 🖥️ AMS — Backend API Documentation

> Node.js + Express.js REST API for the Attendance Management System

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Setup](#-setup)
- [Environment Variables](#-environment-variables)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Error Handling](#-error-handling)
- [Security](#-security)

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.18+ | Web framework |
| mongoose | 8+ | MongoDB ODM |
| jsonwebtoken | 9+ | JWT tokens |
| bcryptjs | 2.4+ | Password hashing |
| helmet | 8+ | Security headers |
| express-rate-limit | 8+ | Rate limiting |
| exceljs | 4+ | Excel export |
| dotenv | 16+ | Env variables |
| nodemon | 3+ | Dev auto-restart |

---

## 📁 Folder Structure

```
server/
├── config/
│   └── db.js                    MongoDB Atlas connection
├── middleware/
│   ├── auth.js                  JWT verifyToken middleware
│   ├── rbac.js                  requireRole() factory function
│   ├── errorHandler.js          Central 4-param error handler
│   └── validate.js              Input validation
├── models/
│   ├── User.js                  Users + leaveBalance + soft delete
│   ├── Attendance.js            Compound unique index {user, date}
│   ├── LeaveRequest.js          Leave lifecycle tracking
│   ├── RefreshToken.js          Token store with TTL auto-cleanup
│   └── AuditLog.js              Immutable action history
├── modules/
│   ├── auth/
│   │   ├── auth.routes.js
│   │   ├── auth.controller.js
│   │   └── auth.service.js
│   ├── attendance/
│   │   ├── attendance.routes.js
│   │   ├── attendance.controller.js
│   │   └── attendance.service.js
│   ├── leave/
│   │   ├── leave.routes.js
│   │   ├── leave.controller.js
│   │   └── leave.service.js
│   ├── analytics/
│   │   ├── analytics.routes.js
│   │   ├── analytics.controller.js
│   │   └── analytics.service.js
│   └── audit/
│       ├── audit.routes.js
│       ├── audit.controller.js
│       └── audit.service.js
├── utils/
│   ├── ApiResponse.js           Standard success response class
│   ├── ApiError.js              Custom error class extends Error
│   ├── constants.js             ROLES, ATTENDANCE_STATUS, LEAVE_*
│   └── generateTokens.js        JWT + refresh token utilities
├── app.js                       Express config + middleware + routes
├── server.js                    HTTP server start + DB connect
├── .env                         Secrets — never commit this
├── .gitignore
└── package.json
```

---

## ⚙️ Setup

```bash
cd server
npm install
npm run dev
```

---

## 🔑 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ams
JWT_SECRET=your_minimum_32_character_random_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:3000
```

---

## 🏗️ Architecture

### MVC Pattern
```
routes.js      What   defines URL + method + middleware
controller.js  How    handles req/res, calls service
service.js     Why    business logic + DB operations
```

### Request Flow
```
Request → helmet → cors → rateLimit → body parser
       → verifyToken → requireRole → controller
       → service → DB → response
       → (on error) → errorHandler → error response
```

### Key Patterns

**catchAsync** — eliminates try/catch in every handler:
```js
const handler = catchAsync(async (req, res) => {
  // errors auto-forwarded to errorHandler
});
```

**ApiError** — throw from anywhere:
```js
throw new ApiError(404, "User not found.");
```

**ApiResponse** — consistent shape always:
```js
res.status(200).json(new ApiResponse(200, "Done.", { data }));
```

---

## 🗄️ Database Schema

### User
```
username      String    unique, min 3 chars
email         String    unique, lowercase
password      String    bcrypt hashed — never in responses
role          String    admin | manager | employee
managerId     ObjectId  ref: User (self-ref)
department    String    nullable
leaveBalance  Object    { casual: 12, sick: 10, earned: 15 }
isActive      Boolean   soft delete — default true
lastLogin     Date      updated on login
timestamps    auto      createdAt, updatedAt
```

### Attendance
```
user          ObjectId  ref: User
date          Date      normalized to midnight
status        String    present|absent|on_leave|half_day|holiday
checkIn       Date      exact marking timestamp
note          String    rectification reason
rectifiedBy   ObjectId  ref: User

COMPOUND INDEX: { user: 1, date: 1 } unique: true
Prevents duplicate entries AND race conditions
```

### LeaveRequest
```
user          ObjectId  ref: User
type          String    casual | sick | earned
from          Date
to            Date
totalDays     Number    pre-calculated
reason        String
status        String    pending | approved | rejected
approvedBy    ObjectId  ref: User
note          String    manager response

INDEXES: { user }, { status }, { createdAt: -1 }
```

### RefreshToken
```
token         String    unique 128-char hex
user          ObjectId  ref: User
expiresAt     Date      7 days from creation
isRevoked     Boolean   true after logout
ipAddress     String
userAgent     String

TTL INDEX: { expiresAt: 1 } — auto-deletes expired tokens
```

### AuditLog
```
action        String    marked|rectified|approved_leave|rejected_leave|login|logout
performedBy   ObjectId  ref: User — who did it
targetUser    ObjectId  ref: User — who was affected
attendanceId  ObjectId  ref: Attendance
oldStatus     String
newStatus     String
note          String
ipAddress     String
userAgent     String

INDEXES: { performedBy }, { targetUser }, { createdAt: -1 }
```

---

## 📬 API Reference

### Base URL: `http://localhost:5000/api/v1`

### Standard Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Operation successful.",
  "data": {}
}
```

---

### Auth Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | No | — | Create account |
| POST | `/auth/login` | No | — | Get both tokens |
| POST | `/auth/refresh` | No | — | New access token |
| GET | `/auth/me` | Yes | All | Own profile |
| POST | `/auth/logout` | Yes | All | Revoke refresh token |

**Register:**
```json
{
  "username": "johnsmith",
  "email": "john@company.com",
  "password": "John@123",
  "role": "employee",
  "department": "Engineering",
  "managerId": "MANAGER_ID"
}
```

**Login response:**
```json
{
  "data": {
    "user": {},
    "accessToken": "eyJhbGci... 15 min",
    "refreshToken": "a1b2c3... 7 days"
  }
}
```

---

### Attendance Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/attendance/mark` | Yes | Employee | Mark today |
| GET | `/attendance/my` | Yes | Employee | Own history |
| GET | `/attendance/all` | Yes | Admin, Manager | All records |
| PUT | `/attendance/rectify/:id` | Yes | Admin, Manager | Change record |
| GET | `/attendance/export` | Yes | Admin, Manager | Excel download |

**Mark:**
```json
{ "status": "present", "note": "Working from office" }
```

**My history with filters:**
```
GET /attendance/my?status=present&from=2026-04-01&to=2026-04-30&page=1&limit=10
```

**Rectify:**
```json
{ "status": "absent", "note": "Sick leave — corrected by admin" }
```

---

### Leave Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/leave/apply` | Yes | Employee | Apply |
| GET | `/leave/my` | Yes | Employee | Own requests |
| GET | `/leave/all` | Yes | Admin, Manager | All requests |
| PUT | `/leave/:id/approve` | Yes | Admin, Manager | Approve |
| PUT | `/leave/:id/reject` | Yes | Admin, Manager | Reject |

**Apply:**
```json
{
  "type": "casual",
  "from": "2026-04-25",
  "to": "2026-04-26",
  "reason": "Personal work"
}
```

**Approve/Reject:**
```json
{ "note": "Approved. Enjoy your time off." }
```

---

### Analytics Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/analytics/summary` | Yes | All | Monthly stats |
| GET | `/analytics/department` | Yes | Admin, Manager | Dept breakdown |

```
GET /analytics/summary?month=4&year=2026
```

---

### Audit Routes

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/audit/logs` | Yes | Admin | All logs |
| GET | `/audit/my` | Yes | All | Own activity |

```
GET /audit/logs?action=rectified&page=1&limit=10
```

---

## ❌ Error Handling

| Status | Scenario |
|--------|----------|
| 400 | Validation error, duplicate, bad request |
| 401 | No token, expired, invalid, revoked |
| 403 | Wrong role — authenticated but not authorized |
| 404 | Resource not found, unknown route |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

---

## 🔒 Security

| Feature | Implementation |
|---------|---------------|
| Passwords | bcrypt 12 salt rounds |
| Auth tokens | JWT 15 min access + 7 day refresh |
| Token revocation | MongoDB isRevoked flag |
| Headers | Helmet.js 11 headers |
| Rate limit | 100 req / 15 min / IP |
| CORS | Frontend origin only |
| Duplicates | DB compound unique index |
| Audit | IP + UserAgent on every auth action |
| Soft delete | isActive flag — data never destroyed |

---

*AMS Backend — built with production practices*
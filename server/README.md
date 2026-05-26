# Attendance Management System (AMS)

## Overview
This project is an Attendance Management System (AMS) built with Node.js. It provides features for managing user attendance, leave requests, analytics, authentication, and role-based access control (RBAC).

## Features
- User authentication (login, registration, token refresh)
- Attendance tracking and management
- Leave request submission and approval
- Analytics and reporting
- Role-based access control (RBAC)
- Audit logging
- Error handling middleware

## Project Structure
```
server/
  app.js                # Main Express app setup
  server.js             # Server entry point
  package.json          # Project dependencies and scripts
  config/
    db.js               # Database connection setup
  middleware/
    auth.js             # Authentication middleware
    errorHandler.js     # Error handling middleware
    rbac.js             # Role-based access control middleware
    validate.js         # Request validation middleware
  models/
    Attendance.js       # Attendance model
    AuditLog.js         # Audit log model
    LeaveRequest.js     # Leave request model
    RefreshToken.js     # Refresh token model
    User.js             # User model
  modules/
    analytics/          # Analytics feature (controller, routes, service)
    attendance/         # Attendance feature (controller, routes, service)
    auth/               # Authentication feature (controller, routes, service)
    leave/              # Leave feature (controller, routes, service)
    users/              # User management (not shown in structure above)
  utils/
    ApiError.js         # Custom API error class
    ApiResponse.js      # Standard API response class
    constants.js        # Project constants
    generateTokens.js   # Token generation utilities
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB (or your preferred database)

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-directory>/server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables as needed (e.g., database URI, JWT secrets).
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints
- `/api/auth` - Authentication routes
- `/api/attendance` - Attendance management
- `/api/leave` - Leave requests
- `/api/analytics` - Analytics and reports
- (Add more as needed)

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

## License
This project is licensed under the MIT License.

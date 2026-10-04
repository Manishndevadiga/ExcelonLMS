# LeavePro — Leave Management System

A full-stack Leave Management System built using the MERN stack. The application allows employees to apply for leaves and track their leave history, while administrators can review, approve, or reject leave requests and monitor employee leave balances.

This project was developed as a full-stack assessment with a focus on clean architecture, authentication, role-based access control, REST APIs, validation, and a simple professional UI.

---

## 🚀 Live Demo

### Frontend
https://excelon-p7rylpjq0-manish-s-projects-844e9815.vercel.app

### Backend
https://excelonlms.onrender.com

> The backend may take a few seconds to respond if it is running on Render's free tier.

---

## 👥 User Roles and Role-Based Authentication

The Leave Management System supports **two user roles: Employee and Admin**. Both roles use the same login page, but their dashboard and available functionality depend on their assigned role.

### 1. Admin — Automatically Created Using `seedAdmin()`

The application does not provide a public admin registration page. Instead, an administrator is automatically created using the `seedAdmin()` function when the backend server starts.

The function first checks whether an admin account already exists in MongoDB. If an admin exists, it skips the creation process to avoid creating duplicate admin accounts.

If no admin exists, the function creates one with the following details:

```js
{
  name: "Admin",
  email: "admin@leavepro.com",
  password: "admin123",
  role: "admin"
}
```

The admin seeding function is executed during server startup, after establishing the MongoDB connection.

```js
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
```

const LEAVE_LIMITS = {
  casual: 12,
  sick: 10,
  earned: 15,
};

is configured in /controllers/leave.controllers.js 

The admin can log in using the common login page and access the Admin Dashboard to manage employee leave requests.

**Default admin credentials for assessment:**

| Field    | Value                |
| -------- | -------------------- |
| Email    | `admin@leavepro.com` |
| Password | `admin123`           |
| Role     | `admin`              |

> **Security note:** These are demonstration credentials for the assessment. In production, the admin password should be provided through environment variables, changed before deployment, and never hardcoded in source code.

### 2. Employee — Registration and Login

Employees can create their own accounts through the signup page by providing their name, email address, and password.

During registration, the backend automatically assigns the `employee` role.

```js
role: "employee"
```

Users cannot select the `admin` role through the public registration process. This prevents employees from creating administrator accounts.

After registration, employees can log in and access their Employee Dashboard to apply for leave, view leave balances, track requests, and check leave history.

### 3. Role-Based Dashboard Redirection

Both employees and administrators use the same authentication system and login endpoint:

```http
POST /api/user/login
```

After successful authentication, the backend returns the authenticated user's information, including their role.

The frontend uses this role to display the appropriate dashboard and navigation.

| Role     | Dashboard          | Main Functionality                                                  |
| -------- | ------------------ | ------------------------------------------------------------------- |
| Employee | Employee Dashboard | Apply for leave, view balances and leave history                    |
| Admin    | Admin Dashboard    | Review, approve or reject leave requests and view employee balances |

**Authentication and redirection flow:**

```text
               Login Page
                   |
                   v
          Validate Credentials
                   |
                   v
           Identify User Role
                   |
          +--------+--------+
          |                 |
          v                 v
       Employee            Admin
          |                 |
          v                 v
   Employee Dashboard   Admin Dashboard
          |                 |
          v                 v
     Apply Leave       Approve / Reject
     Leave History     Leave Requests
     Leave Balance     Employee Balances
```

Role-based authorization is also enforced by the backend to prevent employees from accessing administrator-only operations.


## 📌 Features

### Employee

- Employee registration
- Employee login
- JWT-based authentication
- Secure HTTP-only authentication cookies
- Employee dashboard
- View leave balances
- Apply for leave
- Select leave type
- Select leave start and end dates
- Add leave reason
- View pending leave requests
- View recent leave requests
- View leave request status
- Logout

### Administrator

- Admin login
- Role-based access control
- Admin dashboard
- View leave statistics
- View pending leave requests
- Approve leave requests
- Reject leave requests
- View employee leave balances


### Backend

- RESTful API
- JWT authentication
- HTTP-only cookies
- Role-based authorization
- Password hashing using bcrypt
- MongoDB database
- Mongoose ODM
- Request validation
- Leave overlap validation
- Leave balance validation
- Centralized error handling
- CORS configuration
- Admin seeding

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Material UI (MUI)
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- CORS
- dotenv

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📂 Project Structure

```text
ExcelonLMS/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── common/
│   │   │   ├── config.js
│   │   │   └── scripts.js
│   │   │
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── users.controllers.js
│   │   │   └── leave.controllers.js
│   │   │
│   │   ├── database/
│   │   │   ├── db.js
│   │   │   └── seedAdmin.js
│   │   │
│   │   ├── middlewares/
│   │   │   └── users.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── leave.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── users.routes.js
│   │   │   ├── leave.routes.js
│   │   │   └── admin.routes.js
│   │   │
│   │   ├── utils/
│   │   │   ├── asyncHandler.js
│   │   │   ├── ApiError.js
│   │   │   └── ApiResponse.js
│   │   │
│   │   ├── app.js
│   │   └── index.js
│   │
│   ├── .env
│   └── package.json
│
└── README.md
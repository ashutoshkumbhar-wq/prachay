# ABC Company — Expense Voucher Management System

A full-stack **Expense Voucher Management System** developed for the Full Stack Developer Internship Assignment.

The application digitizes the complete employee expense reimbursement workflow:

**Employee creates voucher → saves Draft → submits → Director reviews → approves/rejects → Accounts monitors approved vouchers.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, React Router |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + bcrypt |
| File Uploads | Multer |
| Validation | Zod / server-side validation |
| Styling | Tailwind CSS |
| Containerization | Docker |
| API | REST API |

---

## Features

### Employee

- Secure login
- Employee dashboard
- Create expense vouchers
- Save incomplete vouchers as Drafts
- Edit and delete Draft vouchers
- Upload employee signature
- Submit vouchers for approval
- View only their own vouchers
- Search vouchers
- View complete voucher details
- Track Draft, Pending Approval, Approved and Rejected statuses
- View rejection reasons

### Director

- Secure login
- Director dashboard
- View all organization vouchers
- View pending approval vouchers
- Search and filter vouchers
- View complete voucher details
- Approve submitted vouchers
- Upload Director signature before approval
- Reject submitted vouchers
- Enter a mandatory rejection reason
- Cannot modify employee-entered voucher details

### Accounts Team

- Secure login
- Accounts dashboard
- View all organization vouchers
- Search and filter vouchers
- View complete voucher details
- View employee and Director signatures
- View approval/rejection status
- Read-only access
- Cannot create, edit, delete, approve or reject vouchers

### Additional Features

- Automatic unique voucher numbers
- Role-based protected routes
- JWT authentication and authorization
- Employee ownership checks
- Server-side validation
- Signature image validation
- Database-backed dashboards
- Search, filtering and pagination
- Voucher audit information
- Responsive UI
- Print-friendly voucher details
- Security headers
- Rate limiting
- Centralized error handling

---

# Employee Screens

## 1. Login

Employees, Directors and Accounts users log in through the same authentication screen. After successful authentication, the application redirects the user according to their role.

![ABC Company Login](Screenshot/1.png)

---

## 2. Employee Dashboard

The Employee dashboard displays the employee's own voucher statistics, including total, Draft, Pending, Approved and Rejected vouchers.

![Employee Dashboard](Screenshot/2.png)

---

## 3. Create Voucher

Employees can create a new expense voucher by entering the voucher date, expense date, department, title, category, amount and description.

An employee signature can also be uploaded before submission.

![Create Voucher](Screenshot/3.png)

---

## 4. Employee Voucher List

The employee can view their own vouchers and track the current status of each voucher.

The employee cannot access vouchers belonging to another employee.

![Employee Voucher List](Screenshot/4.png)

---

## 5. Voucher Details / Draft

The voucher details page displays the expense information, employee information, status and rejection information where applicable.

Draft vouchers remain editable until they are submitted.

![Voucher Details](Screenshot/5.png)

---

# Director Screens

## 6. Director Dashboard

The Director dashboard provides an organization-level overview of vouchers and their current workflow status.

![Director Dashboard](Screenshot/6.png)

---

## 7. Director Voucher List

The Director can view organization vouchers and review their status before approving or rejecting pending submissions.

![Director Voucher List](Screenshot/7.png)

---

# Accounts Screens

## 8. Accounts Dashboard

The Accounts dashboard provides a read-only overview of organization vouchers and reimbursement-related information.

![Accounts Dashboard](Screenshot/8.png)

---

## 9. Accounts Voucher View

Accounts users can view approved vouchers along with employee and Director approval information.

Accounts users cannot modify or approve/reject vouchers.

![Accounts Voucher View](Screenshot/9.png)

---

# Voucher Workflow

```text
DRAFT
   │
   │ Submit
   ▼
SUBMITTED / PENDING APPROVAL
   │
   ├──────────────► REJECTED
   │                    │
   │                    ▼
   │             Employee sees
   │             rejection reason
   │
   └──────────────► APPROVED
                        │
                        ▼
                Accounts Processing
```

### Draft

Employee can:

- View
- Edit
- Delete
- Submit

### Submitted / Pending Approval

Employee:

- View only

Director:

- View
- Approve
- Reject

### Approved

- Read-only
- Visible to authorized users
- Director approval information is preserved

### Rejected

- Read-only
- Employee can view the rejection reason

---

## Business Validation

Validation is enforced on the backend as well as the frontend.

- Department is required
- Expense Title is required
- Expense Date is required
- Amount is required
- Amount must be greater than zero
- Employee signature is required before submission
- Director signature is required before approval
- Rejection reason is required when rejecting

Drafts may remain incomplete because required business validation is enforced when submitting.

---

# Search, Filter and Pagination

Director and Accounts voucher listings support:

- Voucher Number
- Employee Name
- Department
- Expense Category
- Status
- Date Range
- Minimum Amount
- Maximum Amount
- Sorting
- Pagination

---

# Database

The application uses **PostgreSQL with Prisma ORM**.

### User

Stores:

- User ID
- Name
- Email
- Password hash
- Employee ID
- Role
- Created / updated timestamps

Roles:

```text
EMPLOYEE
DIRECTOR
ACCOUNTS
```

### Voucher

Stores:

- Voucher number
- Voucher date
- Expense date
- Department
- Expense title
- Expense category
- Expense description
- Amount
- Employee
- Employee signature
- Status
- Director
- Director signature
- Approval date
- Rejection reason
- Submission date
- Audit timestamps

---

# Project Structure

```text
expense-voucher-management/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── tests/
│   ├── uploads/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── Screenshot/
│   ├── 1.png
│   ├── 2.png
│   ├── 3.png
│   ├── 4.png
│   ├── 5.png
│   ├── 6.png
│   ├── 7.png
│   ├── 8.png
│   └── 9.png
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# Prerequisites

Install:

- Node.js 20+
- npm
- Docker Desktop
- Docker Compose

PostgreSQL runs through Docker.

---

# Setup

## 1. Start PostgreSQL

From the project root:

```powershell
docker compose up -d
```

Check the container:

```powershell
docker ps
```

The PostgreSQL container should be running.

---

## 2. Backend Setup

Open a new PowerShell terminal:

```powershell
cd backend
```

Install dependencies:

```powershell
npm install
```

Create `.env` from `.env.example`:

```powershell
Copy-Item .env.example .env
```

Generate Prisma Client:

```powershell
npx prisma generate
```

Apply migrations:

```powershell
npx prisma migrate dev
```

Seed demo data:

```powershell
npx tsx prisma/seed.ts
```

Start the backend:

```powershell
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## 3. Frontend Setup

Open another PowerShell terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start Vite:

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

**Important:** Port `5000` is the backend API. Port `5173` is the React application.

---

# Quick Restart

After the initial setup, you normally only need:

### Terminal 1 — PostgreSQL

```powershell
docker compose up -d
```

### Terminal 2 — Backend

```powershell
cd backend
npm run dev
```

### Terminal 3 — Frontend

```powershell
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# Environment Variables

### Backend `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_voucher"
JWT_SECRET="change-this-secret"
JWT_EXPIRES_IN="1d"
PORT=5000
FRONTEND_URL="http://localhost:5173"
UPLOAD_DIR="uploads"
```

### Frontend `.env`

```env
VITE_API_URL="http://localhost:5000/api"
```

**Never commit `.env` files or real secrets to GitHub.**

---

# Demo Credentials

The seed data contains demo accounts.

| Role | Email | Password |
|---|---|---|
| Employee | `employee1@abc.com` | `Password123!` |
| Employee | `employee2@abc.com` | `Password123!` |
| Director | `director@abc.com` | `Password123!` |
| Accounts | `accounts@abc.com` | `Password123!` |

These credentials are for local development and assignment demonstration.

---

# API Endpoints

## Authentication

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Vouchers

```text
GET    /api/vouchers
POST   /api/vouchers
GET    /api/vouchers/:id
PUT    /api/vouchers/:id
DELETE /api/vouchers/:id
POST   /api/vouchers/:id/submit
```

## Director

```text
GET  /api/vouchers/pending
POST /api/vouchers/:id/approve
POST /api/vouchers/:id/reject
```

## Dashboard

```text
GET /api/vouchers/dashboard
```

---

# Authentication and Authorization

- JWT is used for authenticated API access.
- Passwords are stored as bcrypt hashes.
- Protected frontend routes enforce the user's role.
- Backend middleware verifies JWTs and authorized roles.
- Employees can only access vouchers they own.
- Director and Accounts users can access organization-wide voucher data.
- Employees can modify only Draft vouchers.
- Only Directors can approve or reject vouchers.
- Accounts has read-only access.

---

# File Uploads

Signature uploads support image files such as:

```text
PNG
JPG
JPEG
```

The backend validates the uploaded file type, extension and size before storing it.

Employee signatures are required before submission.

Director signatures are required before approval.

For this assignment, uploaded signatures are stored locally in the backend uploads directory.

---

# Testing

Run backend tests:

```powershell
cd backend
npm test
```

Build the frontend:

```powershell
cd frontend
npm run build
```

Important business rules tested include:

- Authentication
- Authorization
- Voucher ownership
- Draft editing
- Draft deletion
- Voucher submission
- Approval validation
- Rejection validation
- Search/filter/pagination logic

---

# API Documentation

If Swagger is enabled in the backend, open:

```text
http://localhost:5000/api-docs
```

API endpoint details should also be documented in the project's API documentation files.

---

# Security

The application implements:

- JWT authentication
- bcrypt password hashing
- Role-based authorization
- Object-level ownership checks
- Backend validation
- Secure file upload handling
- Helmet security headers
- CORS configuration
- Login rate limiting
- Environment variables for secrets
- Prisma ORM
- Centralized error handling

---

# Acceptance Test

### Employee

1. Login as Employee A.
2. Create a voucher.
3. Save it as Draft.
4. Edit the Draft.
5. Upload employee signature.
6. Submit the voucher.
7. Confirm it becomes Pending Approval.
8. Confirm the employee can no longer edit it.
9. Confirm the employee cannot access another employee's voucher.

### Director

10. Login as Director.
11. Confirm the submitted voucher appears.
12. Open the voucher.
13. Attempt approval without a Director signature.
14. Confirm approval is rejected.
15. Upload the Director signature.
16. Approve the voucher.
17. Confirm the voucher becomes Approved.

### Accounts

18. Login as Accounts.
19. Confirm the approved voucher is visible.
20. Confirm employee and Director information is visible.
21. Confirm Accounts cannot modify the voucher.
22. Confirm Accounts cannot approve or reject vouchers.

### Rejection

23. Submit another voucher.
24. Login as Director.
25. Attempt rejection without a reason.
26. Confirm validation prevents rejection.
27. Enter a rejection reason.
28. Reject the voucher.
29. Login as Employee.
30. Confirm the rejection reason is visible.

---

# Screenshots

The repository contains the actual application screenshots in the `Screenshot/` directory. They are intentionally displayed throughout this README alongside the feature or role they demonstrate.

The screenshots were captured from the local development environment and demonstrate the implemented UI and workflow.

---

# Project Status

The application implements the core end-to-end expense reimbursement workflow:

```text
Employee
   ↓
Create Draft
   ↓
Submit
   ↓
Director Review
   ↓
Approve / Reject
   ↓
Accounts Processing
```

Core priorities are authentication, authorization, database persistence, voucher workflow, role restrictions, validation and signature handling.

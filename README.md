# ABC Company — Expense Voucher Management System

A full-stack reimbursement workflow:

Employee creates/saves draft → submits → Director approves/rejects → Accounts monitors.

## Stack
React + Vite + TypeScript, Express + TypeScript, PostgreSQL, Prisma, JWT, bcryptjs, Multer, Zod.

## Requirements
Node.js 20+, PostgreSQL 14+.

## Setup

### 1. Database
Create a PostgreSQL database named `expense_voucher`.

### 2. Backend
```bash
cd backend
npm install
copy .env.example .env
```
On macOS/Linux use `cp ../.env.example .env`.

Set `DATABASE_URL` and `JWT_SECRET` in `.env`, then:
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Demo credentials
All users use `Password123!`

- employee1@abc.com
- employee2@abc.com
- director@abc.com
- accounts@abc.com

## API
Backend: http://localhost:5000
Swagger: http://localhost:5000/api/docs
Health: http://localhost:5000/api/health

Important endpoints:
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout
- GET /api/vouchers
- POST /api/vouchers
- GET /api/vouchers/:id
- PUT /api/vouchers/:id
- DELETE /api/vouchers/:id
- POST /api/vouchers/:id/submit
- GET /api/vouchers/pending
- POST /api/vouchers/:id/approve
- POST /api/vouchers/:id/reject
- GET /api/vouchers/dashboard

## Workflow
DRAFT → PENDING_APPROVAL → APPROVED / REJECTED

Backend authorization and ownership checks are enforced.

## Screenshots

The `screenshots/` directory contains screenshots captured from the application during local testing.

| File | Screen / purpose |
|---|---|
| `1.png` | Login screen |
| `2.png` | Employee dashboard |
| `3.png` | Employee voucher list |
| `4.png` | Create Voucher form |
| `5.png` | Employee voucher details / draft |
| `6.png` | Director dashboard |
| `7.png` | Director voucher list |
| `8.png` | Accounts dashboard |
| `9.png` | Additional application/login screen |

These screenshots demonstrate the working UI, role-based dashboards, voucher management screens, and the reimbursement workflow.

### Recommended screenshots for a project report

For a concise report or presentation, use:

1. Employee Dashboard
2. Create Voucher Form
3. Draft Voucher
4. Director Dashboard
5. Director Voucher List
6. Accounts Dashboard

> Screenshots are demonstration evidence captured from the local development environment.


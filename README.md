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

## Notes
This is a runnable academic/project implementation. For production deployment, use HTTPS, a managed object store for signatures, refresh-token/session revocation, stronger audit logging, automated CI/CD, and comprehensive integration tests.

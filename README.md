# Safari Kenya Tourism App

A full-stack tourism management web application for browsing Kenyan travel experiences, managing bookings, publishing reviews, and administering activities, pricing tiers, and users.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, React Hook Form, Zod, Lucide React, Recharts, React Quill, react-datepicker, react-hot-toast
- Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, bcrypt, Multer, Cloudinary, Nodemailer
- Tooling: ESLint, Prettier, dotenv, concurrently, VS Code

## Project Structure

- client: React frontend
- server: Express backend
- prisma: Prisma schema and seed data
- package.json: root scripts for running both apps

## Prerequisites

- Node.js v20+
- PostgreSQL v15+
- VS Code extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense
  - Thunder Client
  - GitLens

## Installation

1. Run `npm install` from the project root.
2. Run `npm install --prefix server`.
3. Run `npm install --prefix client`.

## Environment Setup

### Server

Update [server/.env](server/.env) with your database, Cloudinary, and email credentials.

### Client

Update [client/.env](client/.env) if your backend URL changes.

## Database Setup

1. Run `npm run prisma:generate --prefix server`
2. Run `npx prisma migrate dev --name init --schema prisma/schema.prisma`
3. Run `npx prisma db seed --schema prisma/schema.prisma`

## Run the Application

Run `npm run dev` from the project root.

## Access URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Prisma Studio: run `npx prisma studio --schema prisma/schema.prisma`

## Default Admin Credentials

- Email: admin@safarikenya.com
- Password: Admin@12345

## Features

- Browse featured and filtered activities
- View detailed activity pages with pricing and reviews
- Register and log in with JWT authentication
- Create and manage bookings
- Submit reviews after booking
- Admin dashboard for overview, activities, pricing, bookings, and users
- Unsplash fallback imagery for all activity categories
- Booking confirmation emails with formatted references

## Notes

- Cloudinary uploads require valid credentials.
- Email confirmations require SMTP credentials.
- Seed data creates 12 Kenyan tourism activities with pricing tiers and a default admin.

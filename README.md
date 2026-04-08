# 🦁 SAFARI — Kenyan Tourism Management App

A full-stack tourism management app for exploring and booking Kenyan adventures, built with **React**, **TypeScript**, **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.

---

## ✨ Features

- 🌍 **Browse Destinations** — Explore 10+ Kenyan destinations with category filtering, search, and pagination
- 📅 **Book Adventures** — Reserve safaris, beach getaways, mountain treks, and more
- 🔐 **Authentication** — JWT-based register/login with role support (USER / ADMIN)
- 📋 **Manage Bookings** — View, track, and cancel your bookings
- 🦁 **Category Filters** — Safari, Beach, Mountain, Wildlife, Cultural, Adventure
- 📱 **Responsive Design** — Mobile-first, modern UI

---

## 🏗️ Tech Stack

| Layer    | Technologies                                                   |
|----------|----------------------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, React Router DOM, Axios            |
| Backend  | Node.js, Express, TypeScript                                   |
| Database | PostgreSQL, Prisma ORM                                         |
| Auth     | JSON Web Tokens (JWT), bcryptjs                                |
| Testing  | Jest (server), Vitest + Testing Library (client)               |

---

## 📁 Project Structure

```
SAFARI/
├── client/                  # React + TypeScript frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios API modules
│   │   ├── components/      # Shared UI components (Navbar, DestinationCard, Footer)
│   │   ├── context/         # AuthContext (JWT auth state)
│   │   ├── pages/           # Home, Destinations, DestinationDetail, Bookings, Login, Register
│   │   ├── types/           # TypeScript types
│   │   └── __tests__/       # Vitest tests
│   └── vite.config.ts
│
├── server/                  # Node.js + Express + TypeScript backend
│   ├── src/
│   │   ├── controllers/     # Business logic (auth, destinations, bookings, users)
│   │   ├── middleware/       # JWT auth middleware
│   │   ├── routes/          # Express routers
│   │   ├── lib/             # Prisma client
│   │   └── __tests__/       # Jest tests
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Sample data seeder
│   └── tsconfig.json
│
└── package.json             # Root workspace config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **PostgreSQL** database

### 1. Clone and Install

```bash
git clone https://github.com/cyber-urbanrebel/SAFARI.git
cd SAFARI

# Install all dependencies
npm install --workspace=server
npm install --workspace=client
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/safari_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### 3. Set Up Database

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data
npm run prisma:seed
```

### 4. Start Development Servers

```bash
# From root directory - starts both frontend and backend
npm run dev

# Or start individually:
npm run dev:server   # Backend on http://localhost:5000
npm run dev:client   # Frontend on http://localhost:5173
```

---

## 🧪 Running Tests

```bash
# All tests (server + client)
npm test

# Server tests only
cd server && npm test

# Client tests only
cd client && npm test
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| POST   | `/api/auth/register` | Register new user   |
| POST   | `/api/auth/login`    | Login               |

### Destinations
| Method | Endpoint                  | Description                    | Auth     |
|--------|---------------------------|--------------------------------|----------|
| GET    | `/api/destinations`       | List destinations (filterable) | None     |
| GET    | `/api/destinations/:id`   | Get destination details        | None     |
| POST   | `/api/destinations`       | Create destination             | Admin    |
| PUT    | `/api/destinations/:id`   | Update destination             | Admin    |
| DELETE | `/api/destinations/:id`   | Delete destination             | Admin    |

### Bookings
| Method | Endpoint                      | Description            | Auth  |
|--------|-------------------------------|------------------------|-------|
| GET    | `/api/bookings/my`            | My bookings            | User  |
| GET    | `/api/bookings`               | All bookings           | Admin |
| POST   | `/api/bookings`               | Create booking         | User  |
| PATCH  | `/api/bookings/:id/status`    | Update booking status  | User  |
| DELETE | `/api/bookings/:id`           | Delete booking         | User  |

### Users
| Method | Endpoint             | Description         | Auth  |
|--------|----------------------|---------------------|-------|
| GET    | `/api/users/profile` | Get my profile      | User  |
| PUT    | `/api/users/profile` | Update my profile   | User  |
| GET    | `/api/users`         | All users           | Admin |

---

## 🌍 Sample Destinations

The seed script adds 10 iconic Kenyan destinations:

- 🦁 **Maasai Mara** — The Great Migration
- 🐘 **Amboseli** — Mount Kilimanjaro views
- 🏖️ **Diani Beach** — Indian Ocean paradise
- ⛰️ **Mount Kenya** — Africa's second highest peak
- 🏛️ **Lamu Old Town** — UNESCO World Heritage Site
- 🦁 **Tsavo National Park** — Kenya's largest park
- 🐘 **Samburu Reserve** — Northern Kenya wildlife
- 🧗 **Hell's Gate** — Cycle through gorges
- 🦩 **Lake Nakuru** — Flamingo spectacle
- 🤿 **Watamu Marine Park** — Sea turtles & coral reefs

---

## 📝 Demo Accounts (after seeding)

| Email                  | Password   | Role  |
|------------------------|------------|-------|
| admin@safari.co.ke     | admin123   | Admin |
| jane@example.com       | user123    | User  |

---

*Built with ❤️ for Kenyan adventures*

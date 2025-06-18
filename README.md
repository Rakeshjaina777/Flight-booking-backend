# ✈️ Flight Booking Backend (NestJS + Prisma + PostgreSQL)

A fully production-ready backend REST API built with NestJS, Prisma ORM, PostgreSQL, Docker, JWT Auth, and Swagger.

---

## 🚀 Features

- ✨ Modular architecture (User, Booking, Flight, Seat, Fare, Auth)
- 🔒 JWT authentication + role-based guards
- 📊 Swagger-powered documentation
- 💾 Prisma ORM with PostgreSQL
- 🐳 Dockerized deployment setup
- 🛠️ Dynamic fare calculator engine
- 💡 Centralized error handling and logging (Winston)

---

## 📦 Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Language   | Node.js (TypeScript)          |
| Framework  | NestJS                        |
| ORM        | Prisma                        |
| Database   | PostgreSQL                    |
| Auth       | JWT + bcrypt                  |
| Docs       | Swagger (nestjs/swagger)      |
| DevOps     | Docker, Docker Compose        |
| Logger     | Winston + Interceptors        |

---

## ⚙️ Setup Instructions

### 🧪 Local Development

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev

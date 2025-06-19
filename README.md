# 🛫 Flight Booking Backend – NestJS + PostgreSQL + Prisma

A fully optimized and scalable backend for a flight booking and airline management system. Built with **NestJS**, **PostgreSQL**, and **Prisma ORM**, it supports seat selection, dynamic fares, booking flows (including group bookings), preference handling, countdown logic, JWT auth, logging, Swagger documentation, and containerization.

---

## 🚀 Tech Stack

| Layer             | Tech/Tool                           |
| ----------------- | ----------------------------------- |
| Backend Framework | [NestJS](https://nestjs.com)        |
| ORM               | [Prisma ORM](https://www.prisma.io) |
| Database          | PostgreSQL                          |
| Docs              | Swagger + OpenAPI                   |
| Validation        | `class-validator`, DTOs             |
| Logger            | Winston-based LoggerService         |
| Environment Mgmt  | dotenv                              |
| Containerization  | Docker + Docker Compose             |

---

## 📦 Core Features

### ✈️ Flight Management

* Add/edit/delete flights
* Set and retrieve flight statuses (On Time, Delayed, Cancelled)
* View/search flights by route/date
* Link seats and fare structure per flight

### 💺 Seat & Fare Handling

* Pre-assign seats by class (Economy, Business, First)
* Fare calculation based on class, preferences (e.g., window seat)
* Atomic seat lock utility to prevent double booking
* Countdown timer before departure

### 🧍 User & Booking Module

* JWT-based user registration/login
* Book/cancel seats with fare and preference
* View all user bookings and orphaned seat records
* Group booking support with adjacent seat allocation
* Email simulation on booking confirmation



### 📚 API Documentation

* Swagger UI at [`/api`](http://localhost:3000/api)
* ![image](https://github.com/user-attachments/assets/a21d5c1f-e7cb-47b3-8fa2-8adee8ab135d)

* Fully annotated with `@ApiTags`, `@ApiOperation`, `@ApiBody`, `@ApiResponse`

---

## 🛠️ Local Development Setup

```bash
# 1. Clone the project
git clone https://github.com/your-org/flight-booking-backend.git
cd flight-booking-backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start PostgreSQL using Docker
docker run -d --name pg-flight -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres

# 5. Migrate the database
npx prisma migrate dev --name init

# 6. Seed initial data
npm run seed

# 7. Start the dev server
npm run start:dev
```

---

## 🐳 Docker Setup

```bash
# Build and start using Docker Compose
docker-compose up --build
```

* **Backend**: [http://localhost:3000](http://localhost:3000)
* **Swagger API**: [http://localhost:3000/api](http://localhost:3000/api)
* **PostgreSQL**: exposed on port `5432`

---

## 📁 Folder Structure

```
src/
├── app.module.ts             # Root application module
├── main.ts                   # Entry point
├── common/                   # Shared utilities, guards, exceptions, enums
│   ├── utils/                # Email utility, seat lock helper
│   ├── interceptors/         # Logging interceptor
│   ├── decorators/           # Custom decorators
│   └── enums/                # Role, seat class, status enums
├── config/                   # Global configurations (e.g., env)
├── modules/
│   ├── auth/                 # Auth controller, DTOs, guards
│   ├── user/                 # User service and model
│   ├── flight/               # Flight logic, controller, service
│   ├── booking/              # Booking, cancel, group booking
│   └── fare/                 # Fare setup and calculation
├── prisma/
│   ├── schema.prisma         # DB schema
│   ├── seed.ts               # Seed data script
│   └── prisma.service.ts     # PrismaService provider
```

---

## 🧠 Prisma Schema (Partial)

```prisma
model User {
  id        String    @id @default(uuid())
  name      String
  email     String    @unique
  password  String
  bookings  Booking[]
}

model Flight {
  id        String    @id @default(uuid())
  from      String
  to        String
  date      DateTime
  status    FlightStatus
  fares     Fare[]
  seats     Seat[]
  bookings  Booking[]
}

model Seat {
  id         String    @id @default(uuid())
  flightId   String
  seatClass  SeatClass
  seatCode   String    @unique
  isBooked   Boolean   @default(false)
  bookingId  String?
  flight     Flight    @relation(fields: [flightId], references: [id])
}

model Booking {
  id         String     @id @default(uuid())
  userId     String
  flightId   String
  seatId     String
  status     BookingStatus
  bookedAt   DateTime   @default(now())
  user       User       @relation(fields: [userId], references: [id])
  seat       Seat       @relation(fields: [seatId], references: [id])
  flight     Flight     @relation(fields: [flightId], references: [id])
}

model Fare {
  id         String     @id @default(uuid())
  flightId   String
  economy    Float
  business   Float
  first      Float
  flight     Flight     @relation(fields: [flightId], references: [id])
}
```

### Enums

```prisma
enum FlightStatus {
  ON_TIME
  DELAYED
  CANCELLED
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
}

enum SeatClass {
  ECONOMY
  BUSINESS
  FIRST
}
```

---


## 📑 Swagger Documentation

* URL: [http://localhost:3000/api](http://localhost:3000/api)
* Features:

  * Auth routes: `/auth/login`, `/auth/signup`
  * Flight CRUD: `/flight`, `/flight/search`
  * Booking routes: `/booking`, `/booking/group`, `/booking/cancel`
  * Fare setup: `/fare/set`

---

## 📊 Logging & Error Handling

* Winston-based `LoggerService` with structured logs
* Centralized global exception filter
* Helpful status codes and error messages returned on failure

---


## ⚙️ Current Optimized System Capabilities

The current system is designed with **performance, modularity, and scalability** in mind. It follows modern backend engineering best practices and leverages third-party tools for enhanced production readiness.

### ✅ Key Optimizations Implemented

| Optimization Area          | Implementation Details                                                             |
| -------------------------- | ---------------------------------------------------------------------------------- |
| ⚡ **Performance**          | Optimized Prisma queries; selective data fetching via `include` to reduce overhead |
| 📦 **Caching**             | Integrated **Redis** to cache flight and fare data, minimizing DB load             |
| 📤 **Messaging**           | Utilized **RabbitMQ** for async operations like email dispatch and logging         |
| 🧵 **Concurrency Control** | Atomic seat locking with `seat-lock.util.ts` to prevent double-booking             |
| 🪝 **Security**            | Centralized **AccessTokenGuard** and **RoleGuard** for route protection            |
| 📈 **Logging**             | **Winston**-based `LoggerService` with levels, timestamps, and stack traces        |
| 🐳 **Containerization**    | **Docker + Compose** setup with `.env` management and service orchestration        |
| 🧪 **Dev Tooling**         | DTO validations, global exception filters, e2e tests, and modular services         |

---

## 📈 Future Enhancements Roadmap

Planned features to enhance **usability**, **analytics**, and **customization** for both users and administrators.

### 🔔 1. Email Notifications on Booking

* Auto-send confirmation emails after successful bookings.
* Powered by **RabbitMQ** + a **dedicated mailer microservice**.

### ⏳ 2. Countdown Timer API

* REST API to show time remaining before flight departure.
* Scheduled refreshes (e.g., every 5 mins) with **Redis TTL** support.

### 💺 3. Seat Preference Surcharge System

* Introduce additional charges for **window** or **aisle** preferences.
* `Seat` model will include a `preferenceType` field.


### 🧾 4. Booking History & Audit Logs

* Logs all user actions: book, cancel, reschedule, etc.
* Stores audit trail in `ActivityLog` table with timestamps.



### 🌐 . Internationalization (i18n)

* Support for multilingual interfaces: EN, FR, DE, etc.
* Use `nestjs-i18n` with language JSON files.
* Auto-detection from headers or user settings for localization.


---

## 🧑‍💻 Author & Maintainer

* 👤 **Rakesh Jain**
* ✉️ **Contact**: [rakeshjaina777@gmail.com](mailto:rakeshjaina777@gmail.com)
* 💻 **Tech**: Node.js · NestJS · PostgreSQL · Prisma · Swagger · Docker

---



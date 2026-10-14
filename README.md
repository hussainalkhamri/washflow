# WashFlow 🚗✨

> **Modern Full-Stack On-Demand Automotive Care & Fleet Dispatching Platform**  
> *Built with an API-only Laravel 13 backend and a responsive, glassmorphic React 18 Single-Page Application.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PHP](https://img.shields.io/badge/PHP-8.3%2B-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 📌 Executive Summary

**WashFlow** is an open-source demonstration of a decoupled web architecture designed for on-demand field-service dispatching. It eliminates the friction of traditional car wash facilities by allowing vehicle owners to schedule mobile detailing directly to their doorstep, while providing service managers with an administrative dashboard to manage dispatching, inventory, and revenue.

The project demonstrates:
- **Decoupled Architecture:** Strict separation between the Laravel RESTful API and the React Single Page Application.
- **RTL-Native Design System:** Tailored for Arabic Right-to-Left workflows, enhanced with Radix UI, Framer Motion, and Tailwind CSS.
- **Zero-Friction Reviewer Experience:** Built-in SQLite database support and synthetic seeders allow technical reviewers to boot and test the entire stack in under two minutes without third-party services.

---

## 📸 Verified UI Walkthrough

All screenshots below are captured from the live running application using synthetic evaluation data.

| Customer Onboarding & Authentication | Customer Dashboard & Active Bookings |
|:---:|:---:|
| ![Welcome Screen](docs/screenshots/01-welcome-screen.png) | ![Customer Home](docs/screenshots/02-customer-home.png) |
| *OTP Phone Login & Feature Highlights* | *Real-time booking status & quick actions* |

| Customer Vehicle Garage | Interactive Booking Wizard |
|:---:|:---:|
| ![Customer Vehicles](docs/screenshots/03-customer-vehicles.png) | ![Booking Wizard](docs/screenshots/04-booking-wizard.png) |
| *Vehicle management & plate tracking* | *Multi-step service bundling & scheduling* |

| Customer Order Tracking | Admin Operations Dashboard |
|:---:|:---:|
| ![Customer Orders](docs/screenshots/05-customer-orders.png) | ![Admin Dashboard](docs/screenshots/06-admin-dashboard.png) |
| *Live order lifecycle & review submission* | *Revenue KPIs, volume counters & trends* |

| Admin Dispatching Queue | Dynamic Service Catalog Management |
|:---:|:---:|
| ![Admin Orders Dispatch](docs/screenshots/07-admin-orders-dispatch.png) | ![Admin Services Catalog](docs/screenshots/08-admin-services-catalog.png) |
| *Field operations dispatch & status updater* | *Pricing, categories, and service toggles* |

---

## 🏗 System Architecture

The application adopts a decoupled client-server model communicating over a standardized JSON REST API.

```mermaid
graph TD
    subgraph Client["Presentation Layer (React 18 + Vite)"]
        UI["Customer & Admin Views (Tailwind CSS + Radix UI)"]
        AuthContext["Auth Context (Session / Me API)"]
        ReactQuery["TanStack React Query Cache"]
        Router["Wouter Router (RTL Native)"]
    end

    subgraph Gateway["HTTP Gateway"]
        ViteProxy["Vite Dev Proxy (/api -> http://127.0.0.1:8000)"]
    end

    subgraph Backend["API Layer (Laravel 13 on PHP 8.3+)"]
        Kernel["HTTP Kernel & Global Middleware"]
        SessionStore["Encrypted Cookie Session Store"]
        AuthGuard["AuthMiddleware & AdminMiddleware"]
        Controllers["RESTful Controllers (Auth, Booking, Car, Service, Admin)"]
        Eloquent["Eloquent ORM Models & Relationships"]
    end

    subgraph Persistence["Storage Layer"]
        SQLite[("SQLite Database (database.sqlite)")]
    end

    UI --> Router
    Router --> ReactQuery
    UI --> AuthContext
    ReactQuery --> ViteProxy
    AuthContext --> ViteProxy
    ViteProxy --> Kernel
    Kernel --> SessionStore
    SessionStore --> AuthGuard
    AuthGuard --> Controllers
    Controllers --> Eloquent
    Eloquent --> SQLite
```

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **PHP:** 8.2 or 8.3+ (PHP 8.5 tested)
- **Composer:** 2.x
- **Node.js:** v20.x or v22.x
- **NPM:** 10.x+

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/hussainalkhamri/washflow.git
cd washflow
```

---

### Step 2: Backend Setup
```bash
cd backend

# 1. Install dependencies
composer install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Create SQLite database & run migrations with seeders
touch database/database.sqlite
php artisan migrate --seed

# 4. Start backend server (listens on 127.0.0.1:8000)
php artisan serve
```

---

### Step 3: Frontend Setup
In a new terminal window:
```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Open your browser to **`http://localhost:5173`**.

---

## 🔑 Demo Login Accounts

For immediate reviewer evaluation, the database is pre-seeded with synthetic test profiles:

| Role | Phone Number | Demo OTP | Default Landed View |
|---|---|---|---|
| **System Admin** | `0500000000` | `1234` | `/admin` (Operations Dashboard) |
| **Customer (Tariq)** | `0511111111` | `1234` | `/customer` (Customer Dashboard) |
| **Customer (Fahad)** | `0522222222` | `1234` | `/customer` (Customer Dashboard) |

---

## 🧪 Testing & Code Quality

### Run Backend Tests (Pest / PHPUnit)
```bash
cd backend
php artisan test
```

### Run Frontend Static Typecheck
```bash
cd frontend
npm run check
```

### Build Production Bundle
```bash
cd frontend
npm run build
```

---

## 🔒 Security & Privacy Considerations

- **Demo OTP Simulation:** In this demonstration build, OTP verification statically accepts `1234`. This avoids third-party SMS gateway dependencies (Twilio, Unifonic) and API billing while enabling frictionless evaluation. Production deployment requires switching to a verified SMS provider driver.
- **Session API Authentication:** The API utilizes Laravel's native session middleware applied directly to `/api/*` routes with HTTP-only encrypted cookies and CSRF protection.
- **Zero Real PII:** All customer records, phone numbers, vehicle license plates, and street names are 100% synthetic fixtures.

---

## 📚 Technical Documentation

- [Architecture & Data Model Specifications](docs/architecture.md)
- [End-to-End User Journey Walkthrough](docs/user-journey.md)
- [RESTful API Reference](docs/api.md)
- [Testing & Quality Verification Matrix](docs/testing.md)
- [Security, Privacy, & Threat Assessment](docs/security-and-privacy.md)
- [Live Demo Script & Evaluation Guide](docs/demo-script.md)

---

## 👨‍💻 Author

**Hussain Alkhamri**  
- Email: [saleh7ussain@gmail.com](mailto:saleh7ussain@gmail.com)  
- GitHub: [@hussainalkhamri](https://github.com/hussainalkhamri)  

---

## ⚖️ License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for terms.

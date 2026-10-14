# System Architecture & Technical Specifications

**Document:** `docs/architecture.md`  
**System:** WashFlow  

---

## 1. Architectural Philosophy

WashFlow is engineered as a decoupled, multi-tier system with strict separation of concerns:
1. **Headless Backend (API Layer):** Built on Laravel 13 running on PHP 8.3+. It functions as a pure RESTful API server without server-side Blade presentation logic.
2. **Single Page Application (Client Layer):** Built on React 18 with TypeScript and Vite. It consumes JSON endpoints, manages asynchronous cache with TanStack React Query, and handles local state and routing via `wouter`.
3. **Relational Persistence Layer:** Backed by SQLite for portable zero-configuration demonstration, with normalized migrations compatible with MySQL and PostgreSQL.

---

## 2. Component Diagram

```mermaid
graph TD
    subgraph Browser["Client Browser (RTL / Arabic)"]
        Pages["React SPA Pages (Welcome, Home, Booking, Admin)"]
        Context["Auth Context & Session Observer"]
        QueryCache["TanStack Query Cache (5m Stale Time)"]
        UI["Radix UI Primitives & Tailwind CSS"]
    end

    subgraph API["Backend API (Laravel 13)"]
        Router["Route Dispatcher (routes/api.php)"]
        AuthGroup["API Session Middleware Group"]
        Guards["Custom Guards (auth.custom, admin.custom)"]
        Controllers["Controllers (Booking, Car, Service, Stats)"]
        Eloquent["Eloquent ORM Models"]
    end

    subgraph DB["Database"]
        SQLite[("database.sqlite")]
    end

    Pages --> UI
    Pages --> Context
    Pages --> QueryCache
    QueryCache --> Router
    Context --> Router
    Router --> AuthGroup
    AuthGroup --> Guards
    Guards --> Controllers
    Controllers --> Eloquent
    Eloquent --> SQLite
```

---

## 3. Entity-Relationship Data Model

```mermaid
erDiagram
    USERS ||--o{ CARS : "owns"
    USERS ||--o{ BOOKINGS : "places"
    USERS ||--o{ RATINGS : "submits"
    CARS ||--o{ BOOKINGS : "serviced in"
    BOOKINGS ||--o{ BOOKING_SERVICES : "bundles"
    SERVICES ||--o{ BOOKING_SERVICES : "referenced by"
    BOOKINGS ||--o| RATINGS : "evaluated by"

    USERS {
        int id PK
        string name
        string phone
        string role "customer | admin"
        timestamp created_at
    }

    CARS {
        int id PK
        int user_id FK
        string brand
        string model
        string color
        string plate_number
        string year
    }

    SERVICES {
        int id PK
        string name
        text description
        decimal price
        string category "main | extra"
        boolean is_active
    }

    BOOKINGS {
        int id PK
        int user_id FK
        int car_id FK
        string status "pending | confirmed | in_progress | completed | cancelled"
        date scheduled_date
        string scheduled_time
        string address
        text notes
        decimal total_price
    }

    BOOKING_SERVICES {
        int id PK
        int booking_id FK
        int service_id FK
        decimal price
    }

    RATINGS {
        int id PK
        int booking_id FK
        int user_id FK
        int rating
        text comment
    }
```

---

## 4. Architectural Trade-offs & Decisions

| Decision | Selected Approach | Trade-off Analysis |
|---|---|---|
| **API Authentication** | Session-Cookie over JWT | Cookies marked `HttpOnly` and `SameSite` mitigate XSS token exfiltration compared to `localStorage` JWT tokens, while eliminating client-side refresh token rotation complexity. |
| **Routing** | Wouter over React Router | Wouter provides a minimalist ~1.5kB footprint while satisfying all required routing features (nested layouts, parameterized routes, and programmatic navigation). |
| **State Management** | TanStack Query v5 | Server state is handled asynchronously with cache invalidation on mutations (e.g. invalidating `['/api/bookings']` immediately updates counters), eliminating Redux boilerplate. |
| **Database** | SQLite with Eloquent | Ensures portable zero-configuration deployment for reviewers while preserving full migration compatibility with enterprise RDBMS like MySQL and PostgreSQL. |

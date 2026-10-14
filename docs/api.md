# RESTful API Reference

**Document:** `docs/api.md`  
**System:** WashFlow API (Laravel 13)  
**Base URL:** `/api`  

---

## 1. Authentication Endpoints

### 1.1 Send OTP
- **Endpoint:** `POST /api/auth/send-otp`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "phone": "0511111111"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "تم إرسال رمز التحقق"
  }
  ```

### 1.2 Verify OTP
- **Endpoint:** `POST /api/auth/verify-otp`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "phone": "0511111111",
    "otp": "1234"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "user": {
      "id": 2,
      "name": "عبدالله محمد",
      "phone": "0511111111",
      "role": "customer"
    }
  }
  ```

### 1.3 Current User Session
- **Endpoint:** `GET /api/auth/me`
- **Access:** Authenticated (Cookie)
- **Response (200 OK):** User JSON object.

### 1.4 Logout
- **Endpoint:** `POST /api/auth/logout`
- **Access:** Authenticated
- **Response (200 OK):** `{ "success": true }`

---

## 2. Customer Endpoints

### 2.1 Services Catalog
- **Endpoint:** `GET /api/services`
- **Access:** Public
- **Response (200 OK):** Array of service objects with `id`, `name`, `price`, `category` (`main` | `extra`).

### 2.2 Vehicle Fleet
- **Endpoint:** `GET /api/cars`
- **Access:** Customer (`auth.custom`)
- **Response (200 OK):** List of cars belonging to authenticated user.

- **Endpoint:** `POST /api/cars`
- **Request Body:**
  ```json
  {
    "brand": "Toyota",
    "model": "Camry",
    "color": "White",
    "plate_number": "أ ب د 1234",
    "year": "2023"
  }
  ```

### 2.3 Bookings
- **Endpoint:** `GET /api/bookings`
- **Access:** Customer
- **Response (200 OK):** List of bookings with eager-loaded car, services, and rating.

- **Endpoint:** `POST /api/bookings`
- **Request Body:**
  ```json
  {
    "car_id": 1,
    "service_ids": [1, 4],
    "scheduled_date": "2026-10-20",
    "scheduled_time": "10:00",
    "address": "حي الملقا، شارع الأمير محمد بن سلمان",
    "notes": "الرجاء الاتصال عند الوصول"
  }
  ```

- **Endpoint:** `POST /api/bookings/{id}/rate`
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "خدمة ممتازة وسريعة جداً"
  }
  ```

---

## 3. Operations & Admin Endpoints

All admin endpoints require `admin.custom` middleware.

### 3.1 Statistics & Reports
- **Endpoint:** `GET /api/admin/stats`
  - Returns `total_revenue`, `active_bookings`, `completed_bookings`, `total_customers`, and `recent_bookings`.
- **Endpoint:** `GET /api/admin/reports`
  - Returns monthly trends, top services, and rating distribution.

### 3.2 Order Management
- **Endpoint:** `GET /api/admin/bookings`
  - Retrieves all system orders across all customers with search and status filtering.
- **Endpoint:** `PATCH /api/admin/bookings/{id}`
  - Updates order status (`pending`, `confirmed`, `in_progress`, `completed`, `cancelled`).

### 3.3 Service Catalog Administration
- **Endpoint:** `GET /api/admin/services`
- **Endpoint:** `POST /api/admin/services`
- **Endpoint:** `PATCH /api/admin/services/{id}`
- **Endpoint:** `DELETE /api/admin/services/{id}`

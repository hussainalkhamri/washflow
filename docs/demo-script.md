# Recruiter Demo Script & Evaluation Guide

**Document:** `docs/demo-script.md`  
**System:** WashFlow  
**Evaluation Time:** ~3-5 minutes  

---

## 1. Objective

This script guides technical interviewers, engineering managers, and recruiters through a structured live evaluation of WashFlow to assess architecture quality, state management, and user experience.

---

## 2. Step-by-Step Evaluation Walkthrough

### Part 1: Quick Boot (Time: 60s)
1. In `backend/`: Run `php artisan serve` (boots on `http://127.0.0.1:8000`).
2. In `frontend/`: Run `npm run dev` (boots on `http://localhost:5173`).
3. Open browser to `http://localhost:5173`.
4. *Evaluation Check:* Notice smooth Framer Motion page entrance, glassmorphism cards, and dark/light mode toggle in the top-left corner.

### Part 2: Customer Flow — Booking a Service (Time: 90s)
1. Click **"ابدأ الآن"** (Start Now).
2. Enter phone: `0511111111` -> Click **"إرسال رمز التحقق"** (Send OTP).
3. Enter PIN: `1234` -> Click **"تأكيد"** (Confirm).
4. *Evaluation Check:* Observe instant session hydration showing user "Abdullah Mohammed".
5. Navigate to **"حجز جديد"** (Book Service):
   - Select the pre-registered Lexus ES350.
   - Choose **"غسيل شامل"** (Comprehensive Wash - 80 SAR).
   - Check add-ons **"تنظيف المحرك"** (Engine Clean - 60 SAR) + **"تعطير داخلي"** (Scenting - 25 SAR).
   - *Evaluation Check:* Observe real-time dynamic total update to 165 SAR.
   - Select today's date, 10:00 AM slot, and neighborhood "حي الملقا".
   - Click Confirm.
6. User is redirected to `/customer/orders` showing the active order in `pending` status.

### Part 3: Operations Flow — Admin Dispatching (Time: 90s)
1. Click Profile -> Logout.
2. Login with Admin phone: `0500000000`, OTP: `1234`.
3. System routes to `/admin` dashboard.
4. *Evaluation Check:*
   - Real-time KPI summary (Total Revenue, Active Orders, Completed Orders, Customer Count).
   - Interactive charting for revenue trends.
5. Click **"إدارة الطلبات"** (Order Management):
   - The newly created 165 SAR booking is at the top of the queue.
   - Change status dropdown from `معلق` (Pending) to `مؤكد` (Confirmed), then `مكتمل` (Completed).
6. Click **"إدارة الخدمات"** (Services Catalog):
   - Review live pricing catalog and test toggling service availability.

---

## 3. Key Architecture Highlights to Inspect

1. **Clean Decoupled Setup:** Check `frontend/vite.config.ts` for clean API proxying to `127.0.0.1:8000`.
2. **Strict TypeScript Typing:** Inspect `frontend/src/lib/schema.ts` for end-to-end data type contracts.
3. **Session Middleware Group:** Inspect `backend/bootstrap/app.php` and `backend/routes/api.php` for clean custom middleware guards.
4. **Automated Test Suite:** Run `php artisan test` in `backend/` and `npm run check` in `frontend/`.

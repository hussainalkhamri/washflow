# End-to-End User Journey Walkthrough

**Document:** `docs/user-journey.md`  
**System:** WashFlow  

---

## 1. Customer Experience Flow

### Step 1: Onboarding & Authentication
1. Customer visits the landing page (`/`).
2. Inputs mobile phone number (e.g. `0511111111`) and triggers OTP request.
3. System responds with instant verification code (`1234`).
4. Upon submitting OTP, the server establishes a session cookie and hydrates the user context.

### Step 2: Vehicle Garage Setup
1. From `/customer/cars`, customer reviews their registered fleet.
2. Clicking "Add Vehicle" opens a modal dialog allowing input of Brand (e.g., Toyota), Model (Camry), Color (White), License Plate (أ ب د 1234), and Model Year (2023).
3. The newly registered vehicle is instantly selectable across the platform.

### Step 3: Interactive Booking Wizard
1. Customer navigates to `/customer/book`.
2. **Step 1 (Vehicle):** Selects from registered vehicles.
3. **Step 2 (Service Selection):**
   - Selects primary package: *Comprehensive Wash* (80 SAR).
   - Bundles optional detailing add-ons: *Engine Cleaning* (60 SAR) + *Interior Scenting* (25 SAR).
   - Dynamic total price counter calculates in real-time: **165 SAR**.
4. **Step 3 (Scheduling & Location):**
   - Picks execution date from interactive calendar and selects time window (e.g. 10:00 AM).
   - Selects delivery district (e.g., *Al-Malqa, Riyadh*) and enters street location.
5. **Step 4 (Review & Confirmation):**
   - Confirms order summary and submits booking request.

### Step 4: Tracking & Post-Service Evaluation
1. Redirected to `/customer/orders`.
2. Order card displays with live status badge (`pending`).
3. Once operations dispatchers mark the service as `completed`, a rating dialog appears allowing the customer to rate 1-5 stars and write a review.

---

## 2. Operations Manager & Admin Flow

### Step 1: Administrative Sign-In
1. Manager logs in with designated administrator phone `0500000000` and OTP `1234`.
2. Automatically routed to the `/admin` portal with elevated privileges.

### Step 2: Operational Dashboard Monitoring
1. Manager observes real-time business health cards:
   - Total Gross Revenue
   - Active In-Flight Jobs
   - Completed Washes
   - Registered Customer Count
2. Interactive charting breaks down weekly booking volume and popular service distribution.

### Step 3: Dispatching & Order Lifecycle Progression
1. Manager opens `/admin/orders`.
2. Inspects newly submitted customer bookings, requested delivery addresses, and customer phone numbers.
3. Updates booking status through operational lifecycle:
   - `pending` -> `confirmed` (team scheduled)
   - `confirmed` -> `in_progress` (technicians on-site)
   - `in_progress` -> `completed` (wash finished, review unlocked)

### Step 4: Dynamic Service Catalog Administration
1. Manager navigates to `/admin/services`.
2. Modifies prices for existing services (e.g., adjust Exterior Wash price during promotional seasons).
3. Toggles availability status (`is_active`) or introduces brand new service offerings.

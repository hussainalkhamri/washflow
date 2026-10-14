# Security, Privacy, & Data Protection

**Document:** `docs/security-and-privacy.md`  
**System:** WashFlow  

---

## 1. Threat Model & Safeguards

### 1.1 Secret Management
- **No Hardcoded Credentials:** The source repository contains no production database passwords, AWS credentials, payment provider secret keys, or private SSH keys.
- **Environment Separation:** All configuration values are loaded from `.env` using Laravel's `env()` helper. `.env` is permanently excluded via `.gitignore`. A clean template is maintained in `.env.example`.

### 1.2 Authentication Security
- **Encrypted Session Cookies:** Session IDs are stored in HTTP-only, encrypted browser cookies, mitigating token leakage from malicious JavaScript (XSS attacks).
- **Role-Based Authorization:** Requests to `/api/admin/*` pass through `App\Http\Middleware\AdminMiddleware`, which verifies both valid session authentication and the `admin` role before executing controller logic.

### 1.3 Input Validation & SQL Injection Mitigation
- **Eloquent ORM Parameter Binding:** All database queries utilize Eloquent parameter binding or query builders, preventing SQL injection vulnerabilities.
- **Form Request Validation:** All API inputs (`phone`, `car_id`, `service_ids`, `scheduled_date`, `scheduled_time`) are strictly validated using Laravel validator rules (`required`, `integer`, `string`, `date`).

---

## 2. Intentional Demo Simulations

To provide an optimal evaluation experience without requiring reviewers to subscribe to commercial SaaS providers, two capabilities are simulated:

1. **OTP Verification:**
   - In `AuthController.php`, the verification code is pre-configured to `1234`.
   - *Production Readiness:* For production deployment, replace this logic with a dedicated SMS gateway driver (e.g. Twilio, Unifonic, Taqnyat) that generates a random cryptographically secure 4-digit code with rate-limiting and a 5-minute TTL.

2. **Payment Processing:**
   - Orders confirm without requiring live credit card entry.
   - *Production Readiness:* Production architectures should integrate payment gateway webhooks (e.g., Stripe Checkout, Moyasar, or Apple Pay) with double-entry ledger bookkeeping.

---

## 3. Data Sanitization & PII Compliance

- All customer names ("Abdullah Mohammed", "Fahad Al-Otaibi", "Sultan Al-Shammari") and telephone numbers (`0511111111`, etc.) in seed files are completely artificial.
- Addresses reference general public districts in Riyadh without specific private residential villas.

# Testing & Quality Verification Guide

**Document:** `docs/testing.md`  
**System:** WashFlow  

---

## 1. Testing Strategy

WashFlow enforces a multi-layer verification strategy to prevent functional regressions, broken UI state, and security leaks:
1. **Automated Backend Testing:** PHPUnit / Pest Feature tests verify API route status codes, JSON structure, and database transactions.
2. **Static Type Checking:** TypeScript strict compiler checks prevent null references and parameter mismatches across components and API interfaces.
3. **Bundling & Optimization Checks:** Production Vite compilation ensures asset tree shaking, dynamic chunking, and PostCSS CSS processing.
4. **End-to-End Visual Verification:** Headless browser subagent tests full user flows against the live server.

---

## 2. Test Execution Commands

### 2.1 Backend Automated Tests (Pest / PHPUnit)
```bash
cd backend
php artisan test
```

Expected Output:
```text
   PASS  Tests\Unit\ExampleTest
  ✓ that true is true

   PASS  Tests\Feature\ExampleTest
  ✓ the application returns a successful response

  Tests:    2 passed (2 assertions)
```

### 2.2 Frontend TypeScript Typecheck
```bash
cd frontend
npm run check
```

Expected Output:
```text
> tsc
# Exits cleanly with code 0 (zero type errors)
```

### 2.3 Frontend Production Compilation
```bash
cd frontend
npm run build
```

Expected Output:
```text
vite v7.3.0 building client environment for production...
✓ 2924 modules transformed.
dist/index.html                   1.12 kB
dist/assets/index-*.css          79.21 kB
dist/assets/index-*.js          600.80 kB
✓ built in ~23s
```

---

## 3. Database Integrity & Seeder Verification

To verify that the database seeds properly without orphaned records or missing relationships:
```bash
cd backend
php artisan migrate:fresh --seed
```

This verifies the execution order of all seeders:
1. `UserSeeder` (Admin + 3 Customers)
2. `RegionSeeder` (6 Riyadh neighborhoods)
3. `ServiceSeeder` (3 main wash packages + 4 detailing add-ons)
4. `CarSeeder` (4 vehicles linked to customers)
5. `BookingSeeder` (Historic and active bookings with pivot records)

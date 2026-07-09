# 2nd Failed Test Results Report

Generated on: 7/10/2026, 1:30:32 AM
Showing failures logged since: 7/10/2026, 12:17:40 AM

---

## Test Case: POS-011 - Quick customer create

- **Project:** Bakery POS
- **Module:** POS, Shifts, Checkout, Receipts, And Offline Sync
- **Date Logged:** 7/10/2026, 12:54:05 AM

### Expected Result
> Customer is saved and selected in cart.

### Error / Actual Result
**Actual Result:** when create a customer on POS  some details are not obtained 

**Additional Notes:** when create a customer on POS  some details are not obtained 

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: POS-003 - Prevent duplicate shift

- **Project:** Bakery POS
- **Module:** POS, Shifts, Checkout, Receipts, And Offline Sync
- **Date Logged:** 7/10/2026, 12:44:57 AM

### Expected Result
> Duplicate shift is rejected.

### Error / Actual Result
**Actual Result:** Didnt happen expected result - can open shift twice for same outlet 

**Additional Notes:** Didnt happen expected result 

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: OUT-006 - Delete outlet

- **Project:** Bakery POS
- **Module:** Outlets
- **Date Logged:** 7/10/2026, 12:35:03 AM

### Expected Result
> Operation follows app rule: hard delete only when safe, otherwise inactive state is used.

### Error / Actual Result
**Actual Result:** Failed to fetch

**Additional Notes:** Access to fetch at 'https://bakery-pos-demo-api.onrender.com/api/outlets/cmrdvaq9w0093ax1sbhksgyhc' from origin 'https://bakery-pos-demo-web.onrender.com' has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.
bakery-pos-demo-api.onrender.com/api/outlets/cmrdvaq9w0093ax1sbhksgyhc:1  Failed to load resource: net::ERR_FAILED

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783623903/testbridge_screenshots/okpl3l8lxpegsewt9rho.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of an Outlet creation/edit form showing fields for Phone (+94710000001), Opening Hours (09-11), and a Status dropdown set to "Active". Below the form fields, a red error message states "Failed to fetch" just above the "Save Outlet" and "Clear" buttons.

---

## Test Case: OUT-005 - Deactivate outlet

- **Project:** Bakery POS
- **Module:** Outlets
- **Date Logged:** 7/10/2026, 12:33:44 AM

### Expected Result
> Outlet is no longer offered for new POS/public operations but historical data remains readable.

### Error / Actual Result
**Actual Result:** no error shown in page

**Additional Notes:** Access to fetch at 'https://bakery-pos-demo-api.onrender.com/api/outlets/cmrdvaq9w0093ax1sbhksgyhc' from origin 'https://bakery-pos-demo-web.onrender.com' has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.
bakery-pos-demo-api.onrender.com/api/outlets/cmrdvaq9w0093ax1sbhksgyhc:1  Failed to load resource: net::ERR_FAILED

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: OUT-004 - Edit outlet

- **Project:** Bakery POS
- **Module:** Outlets
- **Date Logged:** 7/10/2026, 12:29:35 AM

### Expected Result
> Changes persist after refresh and are reflected in POS outlet selector where active.

### Error / Actual Result
**Actual Result:** Failed to fetch

**Additional Notes:** Access to fetch at 'https://bakery-pos-demo-api.onrender.com/api/outlets/cmrdvaq9w0093ax1sbhksgyhc' from origin 'https://bakery-pos-demo-web.onrender.com' has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.
bakery-pos-demo-api.onrender.com/api/outlets/cmrdvaq9w0093ax1sbhksgyhc:1  Failed to load resource: net::ERR_FAILED

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783623575/testbridge_screenshots/qefddfqdkytynf6zkudo.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of an Outlet creation/edit form showing fields for Phone (+94710000001), Opening Hours (09-11), and a Status dropdown set to "Active". Below the form fields, a red error message states "Failed to fetch" just above the "Save Outlet" and "Clear" buttons.

---

## Test Case: NOT-003 - Template variables

- **Project:** Bakery POS
- **Module:** Notifications And Offline Monitoring
- **Date Logged:** 7/10/2026, 12:20:01 AM

### Expected Result
> Rendered log replaces variables such as total, bill link, customer name, and reward name.

### Error / Actual Result
**Actual Result:** Failed to fetch 

**Additional Notes:** Access to fetch at 'https://bakery-pos-demo-api.onrender.com/api/notifications/templates/cmrcvfwu70079rphhhov38q15' from origin 'https://bakery-pos-demo-web.onrender.com' has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.
bakery-pos-demo-api.onrender.com/api/notifications/templates/cmrcvfwu70079rphhhov38q15:1  Failed to load resource: net::ERR_FAILED

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: NAV-005 - Browser refresh

- **Project:** Bakery POS
- **Module:** Admin Navigation And Layout
- **Date Logged:** 7/10/2026, 12:19:37 AM

### Expected Result
> App restores authenticated user state or safely redirects to login.

### Error / Actual Result
**Actual Result:** Redirect to this URL - https://bakery-pos-demo-web.onrender.com/index.html 
and shows Page not found

**Additional Notes:** Redirect to this URL - https://bakery-pos-demo-web.onrender.com/index.html 
and shows Page not found

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: NAV-004 - Responsive shell

- **Project:** Bakery POS
- **Module:** Admin Navigation And Layout
- **Date Logged:** 7/10/2026, 12:18:18 AM

### Expected Result
> Text, buttons, tables, filters, and forms remain readable without overlapping.

### Error / Actual Result
**Actual Result:** no need for mobile layout

**Additional Notes:** no need for mobile layout

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---


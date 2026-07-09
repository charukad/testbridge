# Failed Test Results Report

Generated on: 7/10/2026, 12:17:40 AM

---

## Test Case: PUR-002 - Create supplier

- **Project:** Bakery POS
- **Module:** Suppliers And Purchases
- **Date Logged:** 7/10/2026, 12:07:54 AM

### Expected Result
> Supplier is saved and `supplier_created` audit event is written.

### Error / Actual Result
**Actual Result:** Invalid or expired access token

**Additional Notes:** Failed to load resource: the server responded with a status of 401 ()

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783622273/testbridge_screenshots/z40gkr7nelevuvuca2mc.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of a "New Supplier" form with inputs for Name, Code, Contact Person, Phone, Email, Address, and Notes filled with test data. Below the form, a red error message states "Invalid or expired access token" right above the Save Supplier button.

---

## Test Case: EXP-003 - Edit category

- **Project:** Bakery POS
- **Module:** Expenses And Profit Inputs
- **Date Logged:** 7/10/2026, 12:02:59 AM

### Expected Result
> Expense form/list reflect updated category status.

### Error / Actual Result
**Actual Result:** Failed to fetch

**Additional Notes:** Access to fetch at 'https://bakery-pos-demo-api.onrender.com/api/expenses/categories/cmrcvfu9e006frphhsz1fzqin' from origin 'https://bakery-pos-demo-web.onrender.com' has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.

bakery-pos-demo-api.…e006frphhsz1fzqin:1 
 Failed to load resource: net::ERR_FAILED



### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783621978/testbridge_screenshots/zdyrdy4hlxetm36yidjr.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot showing a "Status" dropdown set to "Active". Below it, a red error message reads "Failed to fetch" adjacent to a "Save Category" button.

---

## Test Case: INV-003 - Negative adjustment

- **Project:** Bakery POS
- **Module:** Inventory And Stock Movements
- **Date Logged:** 7/9/2026, 11:49:50 PM

### Expected Result
> Request is rejected and quantity remains unchanged.

### Error / Actual Result
**Actual Result:** 2.997

**Additional Notes:** product 2.997

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: UI-010 - Console errors

- **Project:** Bakery POS
- **Module:** Frontend Quality, Accessibility, And Usability
- **Date Logged:** 7/9/2026, 11:44:31 PM

### Expected Result
> No unhandled React/runtime errors.

### Error / Actual Result
**Actual Result:** Get several errors 

**Additional Notes:** Get several errors 

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: LOY-003 - Activate rule

- **Project:** Bakery POS
- **Module:** Loyalty And Rewards
- **Date Logged:** 7/9/2026, 11:38:19 PM

### Expected Result
> Previous active rule is deactivated so only one rule is active.

### Error / Actual Result
**Actual Result:** Failed to fetch

**Additional Notes:** Failed to fetch

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: LOY-002 - Create rule

- **Project:** Bakery POS
- **Module:** Loyalty And Rewards
- **Date Logged:** 7/9/2026, 11:35:41 PM

### Expected Result
> Rule is saved and visible in rule history.

### Error / Actual Result
**Actual Result:** Failed to fetch

Invalid or expired access token

**Additional Notes:** Failed to fetch

Invalid or expired access token

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783620340/testbridge_screenshots/fhihrcspxrtowviuacyy.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of a Settings form for a "Default Loyalty Rule" filled with various points and reward parameters. At the bottom of the form, two red error messages are visible: "Failed to fetch" and "Invalid or expired access token".

---

## Test Case: EXP-002 - Create category

- **Project:** Bakery POS
- **Module:** Expenses And Profit Inputs
- **Date Logged:** 7/9/2026, 11:27:41 PM

### Expected Result
> Category is saved and audit event is written.

### Error / Actual Result
**Actual Result:** Invalid or expired access token

**Additional Notes:** Invalid or expired access token

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783619860/testbridge_screenshots/qqwmgdnjfe6yhlo99ses.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of a "New Category" form with Name and Description inputs both filled with "test1". A red error message reading "Invalid or expired access token" appears above the Save Category button.

---

## Test Case: NOT-002 - Edit template

- **Project:** Bakery POS
- **Module:** Notifications And Offline Monitoring
- **Date Logged:** 7/9/2026, 11:18:10 PM

### Expected Result
> Template saves and `notification_template_updated` audit event is written.

### Error / Actual Result
**Actual Result:** Failed to fetch

**Additional Notes:** Failed to fetch

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783619290/testbridge_screenshots/nwyqpcwfxv90qvv08hxd.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of an "Edit SMS Bill" form. Both the Name and Message fields contain "test1" and the Active checkbox is ticked. Underneath the Save button, a red error message states "Failed to fetch".

---

## Test Case: CUS-008 - Customer import valid

- **Project:** Bakery POS
- **Module:** Customers And Imports
- **Date Logged:** 7/9/2026, 11:05:02 PM

### Expected Result
> Valid rows are created and import report shows success.

### Error / Actual Result
**Actual Result:** error
Row 2
Outlet code "Main Bakery Outlet" does not exist

appears

**Additional Notes:** error
Row 2
Outlet code "Main Bakery Outlet" does not exist

appears

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783618502/testbridge_screenshots/weoaizbnuzmfmyfitgzs.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of a CSV import summary for "customers.csv" showing 1 row failed. A specific error message is displayed: 'Row 2 Outlet code "Main Bakery Outlet" does not exist'.

---

## Test Case: CUS-005 - Deactivate customer

- **Project:** Bakery POS
- **Module:** Customers And Imports
- **Date Logged:** 7/9/2026, 10:54:10 PM

### Expected Result
> Customer is excluded from active flows but history remains.

### Error / Actual Result
**Actual Result:** only shows console errors 

**Additional Notes:** Access to fetch at 'https://bakery-pos-demo-api.onrender.com/api/customers/cmrdrxmwy0021ax1sq6or52vf' from origin 'https://bakery-pos-demo-web.onrender.com' has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.

 PATCH https://bakery-pos-demo-api.onrender.com/api/customers/cmrdrxmwy0021ax1sq6or52vf net::ERR_FAILED

### Uploaded Images / Screenshots
*No images were uploaded for this failed test result.*

---

## Test Case: CUS-004 - Edit customer

- **Project:** Bakery POS
- **Module:** Customers And Imports
- **Date Logged:** 7/9/2026, 10:50:42 PM

### Expected Result
> Changes persist and customer detail page reflects them.

### Error / Actual Result
**Actual Result:** Failed to fetch
&
Internal server error

**Additional Notes:** index-M7Qddy1m.js:12 
 GET https://bakery-pos-demo-api.onrender.com/api/customers/cmrcvfwdr0073rphhc72ujffi 500 (Internal Server Error)


Access to fetch at 'https://bakery-pos-demo-api.onrender.com/api/customers/cmrcvfwdr0073rphhc72ujffi' from origin 'https://bakery-pos-demo-web.onrender.com' has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.

index-M7Qddy1m.js:12 
 PATCH https://bakery-pos-demo-api.onrender.com/api/customers/cmrcvfwdr0073rphhc72ujffi net::ERR_FAILED

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783617642/testbridge_screenshots/eat5inrytk2unur5u4tl.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot showing two distinct UI sections. The top section is an Address input with a red "Failed to fetch" error above the Save Customer button. The bottom section is a "Customer Detail" block displaying a red "Internal server error" message.

---

## Test Case: AUTH-006 - Refresh token

- **Project:** Bakery POS
- **Module:** Authentication, Sessions, And Role Access
- **Date Logged:** 7/9/2026, 10:50:14 PM

### Expected Result
> New access token works and user profile is correct.

### Error / Actual Result
**Actual Result:** Page not found
Back to dashboard

**Additional Notes:** Page not found
Back to dashboard

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783617613/testbridge_screenshots/pmmvx92e3i5cjrbdoiqj.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of a blank grey web page displaying a large "Page not found" header in the center, accompanied by a "Back to dashboard" link.

---

## Test Case: AUD-003 - Product event

- **Project:** Bakery POS
- **Module:** Audit Logs
- **Date Logged:** 7/9/2026, 10:26:33 PM

### Expected Result
> Product audit events are present with entity context.

### Error / Actual Result
**Actual Result:** Failed to fetch

**Additional Notes:** Access to fetch at 'https://bakery-pos-demo-api.onrender.com/api/products/cmrdqyelj0011ax1sj72s70t8' from origin 'https://bakery-pos-demo-web.onrender.com' has been blocked by CORS policy: Method PATCH is not allowed by Access-Control-Allow-Methods in preflight response.

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783616192/testbridge_screenshots/qr5oduoh5ccnvohodvf1.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot of an "Edit Product" interface on the "Outlets" tab. The "Main Bakery Outlet" checkbox is selected, and a red error message stating "Failed to fetch" is visible above the action buttons.

---

## Test Case: SMK-002 - API health

- **Project:** Bakery POS
- **Module:** Smoke And Environment Tests
- **Date Logged:** 7/9/2026, 9:18:49 PM

### Expected Result
> Returns `status: ok`, service name, timestamp, and `x-request-id`.

### Error / Actual Result
**Actual Result:** sdfs

**Additional Notes:** sdfsdf

### Uploaded Images / Screenshots
![Screenshot 1](https://res.cloudinary.com/dzo0e94uz/image/upload/v1783612128/testbridge_screenshots/t7pthdaz8hmlwuw1tzl2.png)
*Screenshot 1 attached by tester.*

**Image Description (AI Analyzed):**
Screenshot showing the "System 42" logo, featuring a purple stylized hexagonal geometric emblem and bold text.

---


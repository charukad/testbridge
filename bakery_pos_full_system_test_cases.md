# Bakery POS Platform - Full System Test Cases

Use this document as the manual and regression test plan for validating the full bakery POS application before release.

Related references:

- `README.md`
- `bakery_pos_enterprise_tasklist.md`
- `docs/ops/api-routes.md`
- `docs/product/mvp-scope.md`
- `docs/product/non-functional-requirements.md`
- `docs/openapi.json`

## 1. Test Run Information

| Field               | Value                             |
| ------------------- | --------------------------------- |
| Test run date       |                                   |
| Tester              |                                   |
| Environment         | Local / Staging / Production-like |
| Frontend URL        | `http://localhost:5173`           |
| API URL             | `http://localhost:3001/api`       |
| Database            | PostgreSQL                        |
| Browser and version |                                   |
| Build or commit     |                                   |
| Result              | Pass / Fail / Blocked             |

## 2. Default Seed Data

Use fresh seed data unless a test case says otherwise.

| Data              | Value                                         |
| ----------------- | --------------------------------------------- |
| Business code     | `demo-bakery`                                 |
| Owner login       | `owner@demo-bakery.local` / `Admin@12345`     |
| Cashier login     | `cashier@demo-bakery.local` / `Cashier@12345` |
| Main outlet       | `MAIN` / `Main Bakery Outlet`                 |
| Sample barcodes   | `100001`, `100002`, `100003`, `100004`        |
| Sample customers  | `+94771112222`, `+94773334444`                |
| Currency/timezone | `LKR`, `Asia/Colombo`                         |

Additional roles to verify when available: owner, admin, outlet manager, cashier, website admin, report viewer.

## 3. Required Verification Commands

Run these before manual acceptance testing.

| ID          | Command                  | Expected Result                                                                                            |
| ----------- | ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| SYS-CMD-001 | `npm install`            | Dependencies install without errors.                                                                       |
| SYS-CMD-002 | `npm run db:up`          | PostgreSQL container starts.                                                                               |
| SYS-CMD-003 | `npm run db:migrate`     | Migrations apply cleanly on a fresh database.                                                              |
| SYS-CMD-004 | `npm run db:seed`        | Demo business, users, outlet, products, loyalty, tax, invoice, website, and notification data are created. |
| SYS-CMD-005 | `npm run build`          | Backend and frontend compile successfully.                                                                 |
| SYS-CMD-006 | `npm run lint`           | TypeScript lint/type checks pass.                                                                          |
| SYS-CMD-007 | `npm run test`           | Backend automated tests pass. Frontend may currently report no web tests.                                  |
| SYS-CMD-008 | `npm run api:docs:check` | Generated OpenAPI contract matches `docs/openapi.json`.                                                    |
| SYS-CMD-009 | `npm audit --omit=dev`   | No unresolved production-severity dependency issues, or approved risk note is recorded.                    |

## 4. Smoke And Environment Tests

| ID      | Area              | Steps                                                                    | Expected Result                                                                                  | Status |
| ------- | ----------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------ |
| SMK-001 | App startup       | Start the database, API, and frontend with `npm run dev`. Open `/login`. | Login page loads without console crashes. API health indicator is available.                     |        |
| SMK-002 | API health        | Call `GET /api/health`.                                                  | Returns `status: ok`, service name, timestamp, and `x-request-id`.                               |        |
| SMK-003 | Database health   | Call `GET /api/health/database`.                                         | Returns database connected status when PostgreSQL is running.                                    |        |
| SMK-004 | Public website    | Open `/website`.                                                         | Public bakery website loads menu/outlet/homepage content for `demo-bakery`.                      |        |
| SMK-005 | Protected routing | Open `/admin` while logged out.                                          | User is redirected to `/login`.                                                                  |        |
| SMK-006 | Not found route   | Open an unknown route.                                                   | Not found page renders without app crash.                                                        |        |
| SMK-007 | API error shape   | Send a bad request to a validated endpoint.                              | Error includes `statusCode`, `message`, `error`, `requestId`, `timestamp`, `path`, and `method`. |        |
| SMK-008 | Request ID        | Send custom `x-request-id` to API.                                       | Same request ID is preserved in response and error body when applicable.                         |        |

## 5. Authentication, Sessions, And Role Access

| ID       | Area                    | Steps                                                                                        | Expected Result                                                                                        | Status |
| -------- | ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------ |
| AUTH-001 | Owner login             | Log in with owner credentials.                                                               | Owner lands in admin dashboard with full navigation. Access and refresh tokens are stored by the app.  |        |
| AUTH-002 | Cashier login           | Log in with cashier credentials.                                                             | Cashier can access POS and permitted customer/shift functions only. Restricted admin links are hidden. |        |
| AUTH-003 | Invalid login           | Use wrong password for owner.                                                                | Login fails with safe error; no token is stored.                                                       |        |
| AUTH-004 | Business code isolation | Use valid email/password with invalid business code.                                         | Login fails without exposing whether user exists.                                                      |        |
| AUTH-005 | Logout                  | Log in, then log out.                                                                        | Session is ended, tokens are cleared, user is returned to login.                                       |        |
| AUTH-006 | Refresh token           | Log in, call refresh endpoint, then call `/auth/me`.                                         | New access token works and user profile is correct.                                                    |        |
| AUTH-007 | Forgot password         | Submit forgot password for existing and unknown users.                                       | Both return generic success message with no enumeration.                                               |        |
| AUTH-008 | Session list            | Owner opens Staff & Security page.                                                           | Recent sessions show user, role, outlet, expiry, revoked status, user agent, and IP metadata.          |        |
| AUTH-009 | Session revoke          | Owner revokes another active session.                                                        | Revoked token immediately fails on protected API requests.                                             |        |
| AUTH-010 | Permission denial       | Cashier attempts direct URL/API access to backups, audit, reports, products, or security.    | API returns forbidden and UI does not expose unauthorized navigation.                                  |        |
| AUTH-011 | Assigned outlet scope   | Cashier assigned to one outlet requests another outlet in POS, sales, dashboard, or reports. | Request is denied or scoped to assigned outlet only.                                                   |        |
| AUTH-012 | Token expiry behavior   | Use an expired or malformed token.                                                           | Protected requests fail safely and app returns to login or shows authenticated error state.            |        |

## 6. Admin Navigation And Layout

| ID      | Area               | Steps                                           | Expected Result                                                                                                                                                                                                                                                 | Status |
| ------- | ------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| NAV-001 | Owner navigation   | Log in as owner and review sidebar.             | Dashboard, POS, Sales, Orders, Day End, Products, Stock, Daily Baking, Kitchen Orders, Supplier Orders, Customers, Loyalty, Expenses, Reports, Outlets, Staff & Security, Activity Log, Backups, Website, Notifications, and Settings are visible as permitted. |        |
| NAV-002 | Cashier navigation | Log in as cashier.                              | Only permitted POS/customer/shift workflow navigation is visible.                                                                                                                                                                                               |        |
| NAV-003 | Active states      | Move through admin sections.                    | Active link styling follows the current page and pages load with no blank suspense state.                                                                                                                                                                       |        |
| NAV-004 | Responsive shell   | Test desktop, tablet, and mobile widths.        | Text, buttons, tables, filters, and forms remain readable without overlapping.                                                                                                                                                                                  |        |
| NAV-005 | Browser refresh    | Refresh while on a protected nested admin page. | App restores authenticated user state or safely redirects to login.                                                                                                                                                                                             |        |

## 7. Outlets

| ID      | Area              | Steps                                                                           | Expected Result                                                                                 | Status |
| ------- | ----------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------ |
| OUT-001 | List outlets      | Owner opens Outlets page.                                                       | Seeded Main Bakery Outlet appears with active status.                                           |        |
| OUT-002 | Create outlet     | Create a new active outlet with unique code, address, phone, and opening hours. | Outlet is created, listed, and audit event is written.                                          |        |
| OUT-003 | Duplicate code    | Create an outlet with existing code `MAIN`.                                     | Request is rejected with validation/business error.                                             |        |
| OUT-004 | Edit outlet       | Update outlet contact details and status.                                       | Changes persist after refresh and are reflected in POS outlet selector where active.            |        |
| OUT-005 | Deactivate outlet | Deactivate an outlet used by products/orders.                                   | Outlet is no longer offered for new POS/public operations but historical data remains readable. |        |
| OUT-006 | Delete outlet     | Delete/deactivate an outlet from API/UI if allowed.                             | Operation follows app rule: hard delete only when safe, otherwise inactive state is used.       |        |

## 8. Categories, Products, Variants, And Modifiers

| ID      | Area                    | Steps                                                                                             | Expected Result                                                                              | Status |
| ------- | ----------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| PRD-001 | Category list           | Open Products page.                                                                               | Seeded categories Bread, Cakes, Pastries, Short Eats, and Beverages are visible.             |        |
| PRD-002 | Create category         | Add a unique category.                                                                            | Category is created and available in product form.                                           |        |
| PRD-003 | Edit category           | Rename or deactivate category.                                                                    | Product listings reflect change without breaking existing products.                          |        |
| PRD-004 | Product list            | Review product grid/table.                                                                        | Seeded products and barcodes appear with status, price, category, and outlet availability.   |        |
| PRD-005 | Create product          | Create product with SKU, barcode, price, cost, category, and active outlet assignment.            | Product appears in admin and POS catalog for assigned outlet.                                |        |
| PRD-006 | Duplicate SKU/barcode   | Create product using existing SKU or barcode.                                                     | Request is rejected without creating duplicate.                                              |        |
| PRD-007 | Edit product price      | Change selling price and cost price.                                                              | New price is used for future sales; historical sale snapshots remain unchanged.              |        |
| PRD-008 | Deactivate product      | Mark product inactive.                                                                            | Product disappears from POS/public menu but historical sales remain readable.                |        |
| PRD-009 | Outlet availability     | Assign product to one outlet only.                                                                | POS catalog and barcode lookup only show product for assigned outlet.                        |        |
| PRD-010 | Barcode lookup          | Search barcode `100001` from product admin and POS.                                               | Correct product is returned and outlet scoping is respected.                                 |        |
| PRD-011 | Product variants        | Add, edit, and deactivate a product variant with separate price.                                  | Variant appears in POS, updates correctly, and deactivation preserves history.               |        |
| PRD-012 | Required modifier group | Add required modifier group with at least one active modifier. Try POS sale without selecting it. | Sale is blocked until required modifier is selected.                                         |        |
| PRD-013 | Optional modifiers      | Add optional add-ons and sell with selected modifiers.                                            | Modifier names/prices are snapshot on bill item.                                             |        |
| PRD-014 | Product export          | Export products CSV with filters.                                                                 | CSV downloads with expected columns and filtered records.                                    |        |
| PRD-015 | Product import valid    | Import CSV/XLSX with new products.                                                                | Valid rows create products and return row-level success report.                              |        |
| PRD-016 | Product import invalid  | Import duplicate SKU, missing required fields, bad prices, and invalid outlet/category rows.      | Invalid rows are rejected with row-level messages; valid rows still process where supported. |        |

## 9. Inventory And Stock Movements

| ID      | Area                      | Steps                                                                 | Expected Result                                                                                          | Status |
| ------- | ------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------ |
| INV-001 | Stock list                | Open Stock page and filter by outlet, product, low stock, and search. | Stock table and low-stock indicators match filters.                                                      |        |
| INV-002 | Manual adjustment         | Adjust tracked product stock upward with reason.                      | Stock increases, movement record has before/after quantity, and `stock_adjusted` audit event is written. |        |
| INV-003 | Negative adjustment       | Attempt to adjust stock below zero where not allowed.                 | Request is rejected and quantity remains unchanged.                                                      |        |
| INV-004 | Movement filters          | Filter movement list by outlet, product, type, and limit.             | Only matching stock movements appear.                                                                    |        |
| INV-005 | POS stock deduction       | Sell a tracked product.                                               | Stock decreases by sold quantity and movement is linked to sale.                                         |        |
| INV-006 | Sale cancellation restore | Cancel a tracked-stock sale.                                          | Stock is restored and reversal can be audited.                                                           |        |
| INV-007 | Purchase receive stock    | Receive purchase order with tracked product lines.                    | Stock increases through purchase movement.                                                               |        |
| INV-008 | Production stock          | Record production batch.                                              | Produced quantity increases stock and wastage decreases stock where applicable.                          |        |

## 10. Production Planning

| ID      | Area                | Steps                                                                | Expected Result                                                                           | Status |
| ------- | ------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| PRO-001 | Production summary  | Open Daily Baking page for outlet/date.                              | Planned, produced, wasted, sold, remaining, and stock-on-hand values load.                |        |
| PRO-002 | Create batch        | Record production lines for active products.                         | Batch is saved, summary updates, stock movements are created, and audit event is written. |        |
| PRO-003 | Wastage validation  | Enter wastage higher than available produced/stock where invalid.    | Request is rejected with clear validation.                                                |        |
| PRO-004 | Date/outlet filters | Change business date and outlet filters.                             | Summary and batch history update to selected scope.                                       |        |
| PRO-005 | Permission          | Report viewer views production summary if permitted by reports role. | Read-only access works where allowed; create action remains blocked.                      |        |

## 11. Suppliers And Purchases

| ID      | Area                  | Steps                                                                                                | Expected Result                                                                                          | Status |
| ------- | --------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------ |
| PUR-001 | Supplier list         | Open Supplier Orders page and filter suppliers by status/search.                                     | Matching suppliers appear.                                                                               |        |
| PUR-002 | Create supplier       | Create supplier with contact fields.                                                                 | Supplier is saved and `supplier_created` audit event is written.                                         |        |
| PUR-003 | Edit supplier         | Update supplier phone/status.                                                                        | Supplier updates and audit event is written.                                                             |        |
| PUR-004 | Create purchase order | Create purchase order with outlet, supplier, product lines, totals, paid amount, and payment status. | PO is created with correct totals and appears in order list.                                             |        |
| PUR-005 | Receive partial order | Receive fewer items than ordered.                                                                    | Received quantities update, payment status recalculates, and stock increases for received tracked lines. |        |
| PUR-006 | Receive full order    | Receive all remaining quantities.                                                                    | PO status becomes received/complete according to system rules.                                           |        |
| PUR-007 | Over receive          | Attempt to receive more than ordered.                                                                | Request is rejected and stock is unchanged.                                                              |        |
| PUR-008 | Purchase filters      | Filter orders by outlet, supplier, status, and date range.                                           | Results and order details match filters.                                                                 |        |

## 12. POS, Shifts, Checkout, Receipts, And Offline Sync

| ID      | Area                    | Steps                                                                                  | Expected Result                                                                                                               | Status |
| ------- | ----------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------ |
| POS-001 | POS access              | Log in as cashier and open `/pos`.                                                     | POS loads assigned outlet, catalog, settings, and current shift state.                                                        |        |
| POS-002 | Open shift              | Open shift with starting cash.                                                         | Current shift becomes open and `shift_opened` audit event is written.                                                         |        |
| POS-003 | Prevent duplicate shift | Try opening another shift for same cashier/outlet while one is open.                   | Duplicate shift is rejected.                                                                                                  |        |
| POS-004 | Catalog search          | Search by product name/category.                                                       | Active outlet-available products appear only.                                                                                 |        |
| POS-005 | Barcode scan            | Scan or type barcode `100001`.                                                         | Product is added or selected in cart with correct price.                                                                      |        |
| POS-006 | Unknown barcode         | Scan unknown barcode.                                                                  | User gets clear not-found state and cart is unchanged.                                                                        |        |
| POS-007 | Cart quantity           | Add, increase, decrease, and remove items.                                             | Totals recalculate correctly. Quantity cannot go below allowed minimum.                                                       |        |
| POS-008 | Variant price           | Sell a product variant.                                                                | Cart and bill use variant price/name snapshot.                                                                                |        |
| POS-009 | Modifier price          | Sell product with add-on modifiers.                                                    | Modifier selections and prices are included in line total and bill snapshot.                                                  |        |
| POS-010 | Customer lookup         | Lookup sample customer by phone.                                                       | Customer details, points, and rewards are displayed.                                                                          |        |
| POS-011 | Quick customer create   | Create customer from POS with phone/name.                                              | Customer is saved and selected in cart.                                                                                       |        |
| POS-012 | Cash sale               | Complete cash sale with open shift.                                                    | Sale is created, bill number is generated, stock/customer/loyalty/cash expected totals update, audit/log records are written. |        |
| POS-013 | Card/digital sale       | Complete sale with non-cash payment method.                                            | Sale is paid and does not affect expected cash drawer total.                                                                  |        |
| POS-014 | Discount permission     | Cashier without `pos.discount.apply` tries non-zero discount.                          | Discount is rejected unless role has permission.                                                                              |        |
| POS-015 | Fixed discount          | Owner/admin applies fixed discount.                                                    | Total decreases correctly, discount audit event is written.                                                                   |        |
| POS-016 | Percentage discount     | Owner/admin applies percentage discount.                                               | Percentage is calculated correctly with rounding rules.                                                                       |        |
| POS-017 | Insufficient stock      | Sell more tracked stock than available.                                                | Sale is rejected and no partial side effects remain.                                                                          |        |
| POS-018 | No open shift           | Try completing sale with no open shift.                                                | Sale is blocked with clear message.                                                                                           |        |
| POS-019 | Loyalty earning         | Complete eligible customer sale.                                                       | Customer points increase based on active loyalty rule.                                                                        |        |
| POS-020 | Reward creation         | Customer crosses reward threshold.                                                     | Reward is created, notification log may be recorded, and reward appears for redemption.                                       |        |
| POS-021 | Reward redemption       | Redeem available reward during checkout.                                               | Reward status and customer points update; duplicate redemption is blocked.                                                    |        |
| POS-022 | Receipt page            | Open `/bill/:saleId` for created sale.                                                 | Receipt renders business info, bill number, items, modifiers, totals, QR/share data, and customer/payment details.            |        |
| POS-023 | Receipt print           | Use browser print flow from receipt/POS.                                               | Print view is formatted for configured receipt width and no critical text is cut off.                                         |        |
| POS-024 | WhatsApp bill           | Choose WhatsApp or print-and-digital delivery.                                         | WhatsApp share link/log uses rendered bill details.                                                                           |        |
| POS-025 | SMS bill mock           | Choose SMS delivery when configured in mock/log mode.                                  | Notification log is created with rendered variables and correct recipient.                                                    |        |
| POS-026 | Cash movement in        | Add cash-in movement with reason.                                                      | Shift expected cash increases and audit event is written.                                                                     |        |
| POS-027 | Cash movement out       | Add cash-out movement with reason.                                                     | Shift expected cash decreases and audit event is written.                                                                     |        |
| POS-028 | Drawer open permission  | Attempt drawer-open movement with and without permission.                              | Only authorized role can record drawer-open movement.                                                                         |        |
| POS-029 | Close shift             | Close shift with counted cash.                                                         | Shift closes, variance is calculated, report is available, and same shift cannot create new sale.                             |        |
| POS-030 | Offline queue           | Simulate API unavailable, create offline sale in POS queue, then restore API and sync. | Offline event records queued/syncing/synced states and final sale is created once.                                            |        |
| POS-031 | Offline failure         | Sync an invalid offline sale.                                                          | Offline event records failed status with message; failed sale is reviewable.                                                  |        |
| POS-032 | Idempotent sync         | Submit the same `clientSyncId` twice.                                                  | API returns existing sale and does not duplicate bill, stock movements, points, rewards, or notifications.                    |        |

## 13. Sales Admin, Cancellation, And Day-End

| ID      | Area                   | Steps                                                                      | Expected Result                                                                                                                                                 | Status |
| ------- | ---------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| SAL-001 | Sales list             | Open Sales page after several sales.                                       | Paginated bills appear with status, payment status, customer, outlet, totals, and summary totals.                                                               |        |
| SAL-002 | Sales filters          | Filter by outlet, status, payment status, search, and date range.          | List and summary update to matching records.                                                                                                                    |        |
| SAL-003 | Sale detail            | Open a bill detail.                                                        | Items, variants, modifiers, payments, customer, cashier, stock, loyalty, and audit-relevant details are visible.                                                |        |
| SAL-004 | Cancel sale            | Cancel completed sale with reason.                                         | Sale becomes cancelled/refunded, stock is restored, customer spending/points reverse, generated rewards are cancelled if available, and audit event is written. |        |
| SAL-005 | Cancel permission      | Cashier or report viewer tries to cancel sale without permission.          | Cancellation is blocked.                                                                                                                                        |        |
| SAL-006 | Duplicate cancellation | Cancel an already cancelled sale.                                          | Request is rejected and reversal is not duplicated.                                                                                                             |        |
| SAL-007 | Day-end summary        | Open day-end section for outlet/date.                                      | Sales, refunds, discounts, payments, cash movements, open shifts, expected cash, and existing close status are correct.                                         |        |
| SAL-008 | Close with open shift  | Attempt day-end close while shift is open.                                 | Close is refused with open-shift message.                                                                                                                       |        |
| SAL-009 | Close day-end          | Close all shifts, enter counted cash, then close day.                      | Day-end close is saved, variance is calculated, report is available, and audit event is written.                                                                |        |
| SAL-010 | Duplicate day-end      | Try to close same outlet/date again.                                       | Duplicate close is refused.                                                                                                                                     |        |
| SAL-011 | Block after day-end    | Try same-day shift opening, billing, or bill cancellation after day close. | Normal same-day operations are blocked according to day-end rules.                                                                                              |        |

## 14. Customers And Imports

| ID      | Area                    | Steps                                                                         | Expected Result                                                                         | Status |
| ------- | ----------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------ |
| CUS-001 | Customer list           | Open Customers page.                                                          | Seeded customers appear with points, spending, and status.                              |        |
| CUS-002 | Create customer         | Create customer with unique phone.                                            | Customer is saved and available in POS lookup.                                          |        |
| CUS-003 | Duplicate phone         | Create customer with existing phone.                                          | Request is rejected without duplicate.                                                  |        |
| CUS-004 | Edit customer           | Update name, email, birthday, address, and status.                            | Changes persist and customer detail page reflects them.                                 |        |
| CUS-005 | Deactivate customer     | Deactivate customer.                                                          | Customer is excluded from active flows but history remains.                             |        |
| CUS-006 | Phone lookup            | Search customer by phone from POS and API.                                    | Correct customer returned only within business scope.                                   |        |
| CUS-007 | Customer export         | Export customers CSV with filters.                                            | CSV contains expected rows and columns.                                                 |        |
| CUS-008 | Customer import valid   | Import valid CSV/XLSX customers.                                              | Valid rows are created and import report shows success.                                 |        |
| CUS-009 | Customer import invalid | Import duplicates, invalid phones, missing names, and malformed file content. | Invalid rows are rejected with row-level errors.                                        |        |
| CUS-010 | Privacy check           | Review customer pages and exports.                                            | Only necessary personal data is displayed/exported; no passwords/tokens/secrets appear. |        |

## 15. Loyalty And Rewards

| ID      | Area             | Steps                                                                                             | Expected Result                                                 | Status |
| ------- | ---------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------ |
| LOY-001 | Settings load    | Open Loyalty page.                                                                                | Active earning/reward settings load.                            |        |
| LOY-002 | Create rule      | Create loyalty rule with points per amount, minimum bill, threshold, reward name, and valid days. | Rule is saved and visible in rule history.                      |        |
| LOY-003 | Activate rule    | Activate a new rule.                                                                              | Previous active rule is deactivated so only one rule is active. |        |
| LOY-004 | Invalid rule     | Submit zero/negative amount, missing reward name, or invalid threshold.                           | Validation blocks save.                                         |        |
| LOY-005 | Earn points      | Complete eligible customer sale.                                                                  | Points are calculated from active rule and added once.          |        |
| LOY-006 | Below minimum    | Complete customer sale below minimum bill amount.                                                 | No points are earned.                                           |        |
| LOY-007 | Reward expiry    | Attempt to redeem expired reward.                                                                 | Redemption is rejected.                                         |        |
| LOY-008 | Already redeemed | Attempt to redeem same reward twice.                                                              | Second redemption is rejected.                                  |        |
| LOY-009 | Audit trail      | Review audit logs after points/reward actions.                                                    | Points/reward actions are auditable with user/entity context.   |        |

## 16. Website, Public Cake Inquiries, And CMS

| ID      | Area                       | Steps                                                                                | Expected Result                                                                                                                         | Status |
| ------- | -------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| WEB-001 | Public home                | Open `/website` or call `GET /website/public?business_code=demo-bakery`.             | Homepage content, SEO metadata, active banners/gallery, active menu products, variants, outlet availability, and active outlets return. |        |
| WEB-002 | Invalid business code      | Request public website with invalid code.                                            | Safe not-found or validation response; no other business data leaks.                                                                    |        |
| WEB-003 | Submit inquiry             | Public user submits cake inquiry with contact and cake details.                      | Inquiry is created with status `new` and appears in admin Website page.                                                                 |        |
| WEB-004 | Inquiry validation         | Submit inquiry missing required contact/cake fields.                                 | Validation errors appear and no inquiry is created.                                                                                     |        |
| WEB-005 | Admin summary              | Website admin opens Website page.                                                    | Summary shows home page, banners, gallery, inquiries, and content state.                                                                |        |
| WEB-006 | Update homepage            | Edit homepage title, subtitle, SEO metadata, keywords, or Open Graph image URL.      | Public page updates and `website_content_changed` audit event is written.                                                               |        |
| WEB-007 | Banner create/edit/delete  | Create banner, update it, then deactivate/delete it.                                 | Public page shows only active banners in correct order.                                                                                 |        |
| WEB-008 | Gallery create/edit/delete | Create gallery item, update it, then deactivate/delete it.                           | Public gallery shows only active items.                                                                                                 |        |
| WEB-009 | Inquiry status             | Change inquiry status to contacted, accepted, rejected, and completed where allowed. | Status and notes update with audit trail.                                                                                               |        |
| WEB-010 | Website role access        | Website admin accesses website/online order/notification pages only.                 | Unauthorized admin areas are hidden/forbidden.                                                                                          |        |

## 17. Online Orders

| ID      | Area                | Steps                                                                                                       | Expected Result                                                             | Status |
| ------- | ------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| ORD-001 | Public order        | Submit public online order with business code, customer details, outlet, fulfillment type, and valid items. | Order is created unpaid with status `new`, item snapshots, and audit event. |        |
| ORD-002 | Public lookup       | Open public order lookup by order number.                                                                   | Customer can view correct order details only by valid order number.         |        |
| ORD-003 | Invalid outlet/item | Submit order for inactive outlet, inactive product, invalid variant, or empty items.                        | Request is rejected.                                                        |        |
| ORD-004 | Admin list          | Owner/website admin opens Online Orders page.                                                               | Orders list loads with status and fulfillment filters.                      |        |
| ORD-005 | Status update       | Move order through allowed lifecycle statuses and payment states.                                           | Status, notes, timestamps, and audit event update correctly.                |        |
| ORD-006 | Invalid transition  | Attempt unsupported status transition if business rules restrict it.                                        | Request is rejected without side effects.                                   |        |
| ORD-007 | Outlet scoping      | Assigned-outlet user filters another outlet.                                                                | Data is restricted to assigned outlet.                                      |        |

## 18. Cake Quotations, Advance Orders, And Kitchen

| ID       | Area                 | Steps                                                                               | Expected Result                                                                                     | Status |
| -------- | -------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------ |
| CAKE-001 | Quotation list       | Open Website admin cake quotations.                                                 | Existing quotations load.                                                                           |        |
| CAKE-002 | Create quotation     | Create quotation from a new cake inquiry with quote amount and deposit requirement. | Quotation is created, inquiry becomes contacted, and audit event is written.                        |        |
| CAKE-003 | Invalid quote        | Enter negative quote/deposit or deposit greater than quote.                         | Request is rejected.                                                                                |        |
| CAKE-004 | Update quotation     | Update quotation amount, status, notes, or expiry.                                  | Quotation updates and audit event is written.                                                       |        |
| CAKE-005 | Convert quotation    | Convert accepted quotation to advance order with kitchen due date/details.          | Advance order and linked kitchen ticket are created; inquiry is accepted; audit events are written. |        |
| CAKE-006 | Duplicate conversion | Convert same quotation twice.                                                       | Second conversion is rejected.                                                                      |        |
| KIT-001  | Kitchen list         | Open Kitchen Orders page and filter by outlet/status.                               | Tickets load with priority, due date, linked order/quotation, and status.                           |        |
| KIT-002  | Update ticket        | Change ticket status, priority, and notes.                                          | Lifecycle timestamps update and linked advance order status stays consistent.                       |        |
| KIT-003  | Kitchen permissions  | User without kitchen/production permission opens kitchen route/API.                 | Access is forbidden.                                                                                |        |

## 19. Expenses And Profit Inputs

| ID      | Area            | Steps                                                                                            | Expected Result                                                                                           | Status |
| ------- | --------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------ |
| EXP-001 | Category list   | Open Expenses page.                                                                              | Seeded expense categories appear.                                                                         |        |
| EXP-002 | Create category | Create new expense category.                                                                     | Category is saved and audit event is written.                                                             |        |
| EXP-003 | Edit category   | Rename/deactivate category.                                                                      | Expense form/list reflect updated category status.                                                        |        |
| EXP-004 | Record expense  | Create expense with date, amount, payment method, vendor, reference, notes, and optional outlet. | Expense is saved, appears in filters, and audit event is written.                                         |        |
| EXP-005 | Invalid expense | Submit negative/zero amount or missing required category/date.                                   | Validation blocks save.                                                                                   |        |
| EXP-006 | Void expense    | Void expense with reason.                                                                        | Expense status becomes voided, reports exclude/include it according to rules, and audit event is written. |        |
| EXP-007 | Expense filters | Filter by outlet, category, status, and date range.                                              | Results match selected filters.                                                                           |        |

## 20. Dashboard, Reports, And Analytics

| ID      | Area               | Steps                                                                                                       | Expected Result                                                                                                                                                                               | Status |
| ------- | ------------------ | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| REP-001 | Dashboard summary  | Owner opens Dashboard with seed and newly created data.                                                     | Daily sales, estimated profit, bill count, low stock count, pending online orders, cash difference, setup counts, alerts, sales-by-hour, best sellers, payment totals, and latest bills load. |        |
| REP-002 | Dashboard filters  | Filter dashboard by outlet/date.                                                                            | Metrics reflect only selected outlet/date and assigned-outlet scoping is respected.                                                                                                           |        |
| REP-003 | Reports overview   | Open Business Reports.                                                                                      | Sales, products, outlets, gross/net profit, COGS, expenses, loyalty totals, rewards, cashier performance, cancelled bills, shifts, day-end, payment mix, refunds, discounts, and taxes load.  |        |
| REP-004 | Reports CSV        | Export overview CSV with filters.                                                                           | CSV downloads and matches on-screen filters/totals.                                                                                                                                           |        |
| REP-005 | Analytics overview | Load analytics overview.                                                                                    | Trend, product ranking, hourly sales, outlet comparison, customer behavior, loyalty behavior, staff performance, and insights are present.                                                    |        |
| REP-006 | Granular analytics | Call sales-trend, product-ranking, time-of-day, outlets, customers, loyalty, staff, and insights endpoints. | Each route returns the matching dataset with consistent filters.                                                                                                                              |        |
| REP-007 | Empty date range   | Use a date range with no data.                                                                              | Reports show zero/empty states without crashes or misleading totals.                                                                                                                          |        |
| REP-008 | Permission         | Report viewer can view reports/sales but cannot mutate products, POS, expenses, or backups.                 | Role access matches permissions.                                                                                                                                                              |        |

## 21. Notifications And Offline Monitoring

| ID      | Area                 | Steps                                                                  | Expected Result                                                                                                                                 | Status |
| ------- | -------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| NOT-001 | Template list        | Open Notifications page.                                               | Seeded SMS Bill, Reward SMS, and WhatsApp Bill templates appear.                                                                                |        |
| NOT-002 | Edit template        | Update template name/body/active status.                               | Template saves and `notification_template_updated` audit event is written.                                                                      |        |
| NOT-003 | Template variables   | Complete bill/reward flows after template update.                      | Rendered log replaces variables such as total, bill link, customer name, and reward name.                                                       |        |
| NOT-004 | Notification logs    | Filter logs by channel, status, and trigger type.                      | Matching logs show linked bill/reward/customer where applicable.                                                                                |        |
| NOT-005 | Monitoring summary   | Open notification monitoring.                                          | SMS totals, failure rate, stale pending, recent failures, offline sync totals, stale syncing, pending review, and recent offline failures load. |        |
| NOT-006 | Stale/failure states | Seed or create failed/stale notification/offline events.               | Monitoring flags them accurately.                                                                                                               |        |
| NOT-007 | Permissions          | User without notifications/settings permission accesses notifications. | Access is forbidden.                                                                                                                            |        |

## 22. Audit Logs

| ID      | Area            | Steps                                                                    | Expected Result                                                                                   | Status |
| ------- | --------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ------ |
| AUD-001 | Audit list      | Owner opens Activity Log.                                                | Recent audit events load with user, action, entity, timestamps, and before/after where available. |        |
| AUD-002 | Auth events     | Log in and log out, then filter `auth_login`/`auth_logout`.              | Auth events are present.                                                                          |        |
| AUD-003 | Product event   | Create/edit/deactivate product and filter product actions.               | Product audit events are present with entity context.                                             |        |
| AUD-004 | Sale event      | Create/cancel sale and filter bill actions.                              | Bill created/cancelled events are present.                                                        |        |
| AUD-005 | Reward event    | Redeem reward and filter reward action.                                  | Reward redemption event is present.                                                               |        |
| AUD-006 | Filter behavior | Filter by action type, entity type, user, search, date range, and limit. | Results match filters and remain scoped to business.                                              |        |
| AUD-007 | Permission      | Non-audit user tries to open Activity Log/API.                           | Access is forbidden.                                                                              |        |

## 23. Backups And Restore Procedure

| ID      | Area           | Steps                                                                                                    | Expected Result                                                                                                                | Status |
| ------- | -------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
| BAK-001 | Backup list    | Owner opens Backups page.                                                                                | Latest backup jobs load with type, status, size, checksum, timestamps, and error fields where applicable.                      |        |
| BAK-002 | Manual backup  | Run backup from UI/API or `npm run db:backup`.                                                           | Backup job completes, dump file exists in configured path/storage, checksum and size are recorded, and audit event is written. |        |
| BAK-003 | Backup failure | Run backup with invalid backup location or database URL in safe test environment.                        | Job records failed status and safe error.                                                                                      |        |
| BAK-004 | Restore test   | Run guarded restore test using `ALLOW_DATABASE_RESTORE=true`, `BACKUP_FILE`, and `RESTORE_DATABASE_URL`. | Restore completes into test database only and does not affect active database.                                                 |        |
| BAK-005 | Permission     | Cashier/report viewer attempts backup access.                                                            | Access is forbidden.                                                                                                           |        |

## 24. API Standards And Contract Tests

| ID      | Area                | Steps                                                                                                     | Expected Result                                                            | Status |
| ------- | ------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------ |
| API-001 | OpenAPI freshness   | Run `npm run api:docs:check`.                                                                             | No contract drift.                                                         |        |
| API-002 | Auth required       | Call protected route without token.                                                                       | Returns unauthorized with standard error shape.                            |        |
| API-003 | Permission required | Call route with token missing required permission.                                                        | Returns forbidden with standard error shape.                               |        |
| API-004 | Pagination defaults | Call paginated list without page/page_size.                                                               | Uses page `1`, page size `25`, and returns pagination metadata.            |        |
| API-005 | Pagination cap      | Request page size greater than `100`.                                                                     | Page size is capped or rejected according to API standard.                 |        |
| API-006 | Invalid enum        | Send invalid status/payment/status query.                                                                 | Returns 400 with useful validation message.                                |        |
| API-007 | Invalid date        | Send invalid `from`/`to` date.                                                                            | Returns 400 with useful validation message.                                |        |
| API-008 | Date range          | Use valid `YYYY-MM-DD` ranges across reports/sales/expenses/purchases.                                    | Data is filtered correctly by business date.                               |        |
| API-009 | CSV content type    | Call CSV export endpoints.                                                                                | Response content type and file contents are valid CSV.                     |        |
| API-010 | Tenant isolation    | Create or simulate a second business and attempt cross-business IDs.                                      | API refuses cross-business read/write access.                              |        |
| API-011 | Transaction safety  | Force failure in multi-step operations such as sale, purchase receive, production batch, or cancellation. | No partial records, stock movements, points, or logs remain after failure. |        |
| API-012 | Safe 500 errors     | Trigger controlled unexpected error in non-production test.                                               | Response hides stack/secrets and includes request ID for logs.             |        |

## 25. Frontend Quality, Accessibility, And Usability

| ID     | Area                 | Steps                                                                   | Expected Result                                                                                                     | Status |
| ------ | -------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------ |
| UI-001 | Forms                | Test create/edit forms in every admin module.                           | Required fields, disabled states, validation errors, loading states, success states, and reset/close behavior work. |        |
| UI-002 | Tables/lists         | Test sorting/filtering/search/pagination where available.               | Data updates without layout breaks or stale selections.                                                             |        |
| UI-003 | Empty states         | Use filters with no data in every module.                               | Clear empty state appears without app errors.                                                                       |        |
| UI-004 | Error states         | Stop API and interact with pages.                                       | User sees recoverable error state; app does not crash.                                                              |        |
| UI-005 | Loading states       | Throttle network and navigate pages.                                    | Loading indicators appear and do not shift layout badly.                                                            |        |
| UI-006 | Keyboard             | Navigate login, POS, forms, menus, dialogs, and buttons using keyboard. | Focus is visible and workflow is usable without mouse.                                                              |        |
| UI-007 | Screen reader basics | Check labels, headings, buttons, and status messages.                   | Interactive controls have accessible names and status updates are announced where needed.                           |        |
| UI-008 | Responsive POS       | Test POS at mobile/tablet/desktop sizes.                                | Product grid, cart, customer panel, shift controls, checkout, and offline queue remain usable.                      |        |
| UI-009 | Receipt layout       | Test 80mm receipt, desktop print, and mobile bill page.                 | Receipt text is readable and totals/QR/share data are not clipped.                                                  |        |
| UI-010 | Console errors       | Navigate every route and complete core workflows with dev tools open.   | No unhandled React/runtime errors.                                                                                  |        |

## 26. Security And Data Protection

| ID      | Area               | Steps                                                                                        | Expected Result                                                                        | Status |
| ------- | ------------------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------ |
| SEC-001 | Password storage   | Inspect user records in test DB.                                                             | Passwords are hashed; no plaintext password exists.                                    |        |
| SEC-002 | Token storage      | Inspect browser storage after login/logout.                                                  | Tokens exist only as intended during session and are removed on logout.                |        |
| SEC-003 | Secrets exposure   | Search built frontend bundle and API responses.                                              | Database URLs, JWT secrets, passwords, and private environment values are not exposed. |        |
| SEC-004 | CORS               | Test allowed local/staging origins and disallowed origin.                                    | Allowed origins work; disallowed origins are rejected by browser/API policy.           |        |
| SEC-005 | Input injection    | Submit HTML/script strings in customer/product/website fields.                               | Data is stored/rendered safely without executing scripts.                              |        |
| SEC-006 | File import safety | Upload unsupported extension, oversized file, malformed base64, and formula-like CSV values. | Import rejects unsafe/invalid files and reports safe row errors.                       |        |
| SEC-007 | PII access         | User without customer permission attempts customer endpoints.                                | Access is forbidden.                                                                   |        |
| SEC-008 | Audit immutability | Attempt to modify/delete audit logs through UI/API.                                          | No mutation path exists for normal users.                                              |        |

## 27. Performance And Reliability

| ID       | Area                      | Steps                                                                           | Expected Result                                                                             | Status |
| -------- | ------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------ |
| PERF-001 | POS catalog load          | Seed a large product catalog and open POS.                                      | Catalog loads within accepted target and search remains responsive.                         |        |
| PERF-002 | Checkout speed            | Complete sale with many items, modifiers, customer, loyalty, and notifications. | Sale completes within accepted target and no duplicate side effects occur.                  |        |
| PERF-003 | Reports range             | Load reports over large date range.                                             | Response completes within accepted target or shows clear loading state.                     |        |
| PERF-004 | Import size               | Import large product/customer file.                                             | Import completes with row report and does not block unrelated app use longer than accepted. |        |
| PERF-005 | Backup duration           | Run backup on realistic database size.                                          | Backup completes within operational target and records size/checksum.                       |        |
| PERF-006 | Recovery from API restart | Restart API while frontend is open.                                             | App recovers on retry/login refresh; no corrupted local state.                              |        |
| PERF-007 | Offline resilience        | Use POS during temporary network loss.                                          | Offline queue preserves pending sales and syncs when network returns.                       |        |

## 28. End-To-End Release Scenarios

| ID      | Scenario                       | Steps                                                                                                                                        | Expected Result                                                                                 | Status |
| ------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------ |
| E2E-001 | Fresh setup to first sale      | Migrate, seed, log in as owner, verify dashboard, create product, assign outlet, log in as cashier, open shift, sell product, print receipt. | First sale completes and appears in sales, dashboard, reports, stock, audit, and receipt pages. |        |
| E2E-002 | Customer loyalty loop          | Create customer, configure loyalty, complete enough sales to earn reward, redeem reward, cancel one sale.                                    | Points, rewards, notifications, customer totals, and audit logs update correctly at every step. |        |
| E2E-003 | Bakery production loop         | Adjust starting stock, record production, sell produced item, record wastage, review inventory and reports.                                  | Stock and profit inputs stay consistent.                                                        |        |
| E2E-004 | Supplier to sale loop          | Create supplier, purchase tracked product, receive order, sell item, cancel sale.                                                            | Purchase receipt increases stock, sale decreases stock, cancellation restores stock.            |        |
| E2E-005 | Public website to kitchen loop | Public user submits inquiry, admin creates quotation, converts to advance order, kitchen updates ticket to completed.                        | Inquiry, quotation, advance order, kitchen ticket, and audit trail are linked.                  |        |
| E2E-006 | Online order loop              | Public user submits online order, admin updates status/payment, report/dashboard reflects pending/completed order.                           | Online order lifecycle and metrics are correct.                                                 |        |
| E2E-007 | Daily close loop               | Cashier opens shift, records cash sale and cash movements, closes shift, owner closes day-end, reviews day-end report.                       | Expected cash, counted cash, variance, and close restrictions are correct.                      |        |
| E2E-008 | Owner management loop          | Owner updates website, templates, products, expenses, runs backup, reviews audit and reports.                                                | All management actions persist, are auditable, and appear in reporting where applicable.        |        |

## 29. Regression Checklist By Route

Mark each route as Pass after at least one positive and one negative/permission test has been completed.

| Module        | Routes                                                                                                                                                                                                                                                           | Status |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Health        | `GET /health`, `GET /health/database`                                                                                                                                                                                                                            |        |
| Auth          | `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`                                                                                                                                                      |        |
| Dashboard     | `GET /dashboard/summary`                                                                                                                                                                                                                                         |        |
| Reports       | `GET /reports/overview`, `GET /reports/overview.csv`                                                                                                                                                                                                             |        |
| Analytics     | `GET /analytics/overview`, `GET /analytics/sales-trend`, `GET /analytics/product-ranking`, `GET /analytics/time-of-day`, `GET /analytics/outlets`, `GET /analytics/customers`, `GET /analytics/loyalty`, `GET /analytics/staff`, `GET /analytics/insights`       |        |
| Backups       | `GET /backups`, `POST /backups`                                                                                                                                                                                                                                  |        |
| Inventory     | `GET /inventory/stocks`, `GET /inventory/movements`, `POST /inventory/adjustments`                                                                                                                                                                               |        |
| Production    | `GET /production/summary`, `GET /production/batches`, `POST /production/batches`                                                                                                                                                                                 |        |
| Purchases     | `GET /purchases/suppliers`, `POST /purchases/suppliers`, `PATCH /purchases/suppliers/:id`, `GET /purchases/orders`, `GET /purchases/orders/:id`, `POST /purchases/orders`, `POST /purchases/orders/:id/receive`                                                  |        |
| Expenses      | `GET /expenses/categories`, `POST /expenses/categories`, `PATCH /expenses/categories/:id`, `GET /expenses`, `POST /expenses`, `POST /expenses/:id/void`                                                                                                          |        |
| Online Orders | `POST /online-orders/public`, `GET /online-orders/public/:order_number`, `GET /online-orders`, `PATCH /online-orders/:id/status`                                                                                                                                 |        |
| Cake Orders   | `GET /cake-orders/quotations`, `POST /cake-orders/quotations`, `PATCH /cake-orders/quotations/:id`, `POST /cake-orders/quotations/:id/convert`, `GET /cake-orders/advance-orders`                                                                                |        |
| Kitchen       | `GET /kitchen/tickets`, `PATCH /kitchen/tickets/:id`                                                                                                                                                                                                             |        |
| Audit Logs    | `GET /audit-logs`                                                                                                                                                                                                                                                |        |
| Outlets       | `GET /outlets`, `POST /outlets`, `GET /outlets/:id`, `PATCH /outlets/:id`, `DELETE /outlets/:id`                                                                                                                                                                 |        |
| Categories    | `GET /categories`, `POST /categories`, `GET /categories/:id`, `PATCH /categories/:id`, `DELETE /categories/:id`                                                                                                                                                  |        |
| Products      | `GET /products`, `GET /products/export.csv`, `POST /products/import`, `POST /products`, `GET /products/:id`, `PATCH /products/:id`, `DELETE /products/:id`, `POST /products/:id/outlets`, `GET /products/barcode/:barcode`, variants, modifier groups, modifiers |        |
| POS           | `GET /pos/catalog`, `GET /pos/barcode/:barcode`, `GET /pos/outlets`, `GET /pos/settings`, `POST /pos/offline-sync-events`, `GET /pos/sales/:id`, `POST /pos/sales`                                                                                               |        |
| Notifications | `GET /notifications/templates`, `PATCH /notifications/templates/:id`, `GET /notifications/logs`, `GET /notifications/monitoring`                                                                                                                                 |        |
| Sessions      | `GET /sessions`, `POST /sessions/:id/revoke`                                                                                                                                                                                                                     |        |
| Shifts        | `GET /shifts/current`, `POST /shifts/open`, `POST /shifts/:id/cash-movements`, `POST /shifts/:id/close`, `GET /shifts/:id/report`                                                                                                                                |        |
| Day-End       | `GET /day-end`, `GET /day-end/summary`, `POST /day-end/close`, `GET /day-end/:id/report`                                                                                                                                                                         |        |
| Sales         | `GET /sales`, `GET /sales/:id`, `POST /sales/:id/cancel`                                                                                                                                                                                                         |        |
| Customers     | `GET /customers`, `GET /customers/export.csv`, `POST /customers/import`, `POST /customers`, `GET /customers/:id`, `PATCH /customers/:id`, `DELETE /customers/:id`, `GET /customers/phone/:phone`                                                                 |        |
| Website       | `GET /website/public`, `POST /website/inquiries`, `GET /website/admin/summary`, `PATCH /website/admin/pages/home`, banner routes, gallery routes, inquiry admin routes                                                                                           |        |
| Loyalty       | `GET /loyalty/settings`, `PUT /loyalty/settings`, `GET /loyalty/rules`, `POST /loyalty/rules`, `GET /loyalty/rules/:id`, `PATCH /loyalty/rules/:id`, `DELETE /loyalty/rules/:id`, `POST /loyalty/rewards/:id/redeem`                                             |        |

## 30. Release Sign-Off

| Gate           | Requirement                                                                                                         | Status | Notes |
| -------------- | ------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| GATE-C-001     | Every MVP acceptance item passes manual testing.                                                                    |        |       |
| GATE-C-002     | Critical automated tests pass.                                                                                      |        |       |
| GATE-C-003     | Backup and restore process is tested.                                                                               |        |       |
| GATE-C-004     | Production deployment checklist is complete.                                                                        |        |       |
| API contract   | `npm run api:docs:check` passes.                                                                                    |        |       |
| Security       | No open critical/high security findings.                                                                            |        |       |
| Data integrity | POS, inventory, loyalty, sales cancellation, purchases, production, day-end, and reports agree after E2E scenarios. |        |       |
| UX             | No blocking responsive, receipt, accessibility, or navigation issues.                                               |        |       |

Final release decision:

- [ ] Approved
- [ ] Approved with known issues
- [ ] Rejected

Known issues:

| ID  | Severity | Area | Description | Owner | Target Fix |
| --- | -------- | ---- | ----------- | ----- | ---------- |
|     |          |      |             |       |            |

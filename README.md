# HopePulse Server

Backend REST API for **HopePulse**, built with Node.js, Express, MongoDB, JWT authentication, and Stripe payments.

- **Live Client URL:** [HopePulse](https://hopepulse-90981.web.app/)
- **Live Server URL:** [HopePulse API](https://hope-pulse-server.vercel.app/)

**Admin Panel Demo Credentials**
- **Username:** `alamrayhan025@gmail.com`
- **Password:** `123456`

---

## About HopePulse

HopePulse is a platform dedicated to bridging the gap between blood donors and recipients. The platform is designed to make blood donation accessible, efficient, and community-driven, supporting donor registration, blood donation requests, role-based dashboards (Donor, Volunteer, Admin), community blogs, and Stripe-powered funding.

---

## Tech Stack

- **Runtime & Framework:** Node.js, Express `^4.21.2`
- **Database:** MongoDB (`mongodb ^6.12.0` native driver)
- **Authentication:** JSON Web Tokens (`jsonwebtoken ^9.0.2`)
- **Payments:** Stripe (`stripe ^17.5.0`)
- **Utilities & Middleware:** `cors`, `dotenv`
- **Deployment:** Vercel (`@vercel/node`)

---

## Project Structure

```text
hopePulse-server-a12/
├── index.js                         # Entry point: connects MongoDB, starts server, exports app for Vercel
├── package.json
├── vercel.json                      # Vercel routing & build configuration
└── src/
    ├── app.js                       # Express app setup, core middlewares, routes, 404 & error handlers
    ├── config/
    │   ├── env.js                   # Centralized environment variable configuration
    │   ├── db.js                    # MongoDB client, connection helper, and collection getters
    │   └── stripe.js                # Stripe SDK initialization
    ├── middlewares/
    │   ├── auth.middleware.js       # verifyToken (JWT) & verifyAdmin (role check)
    │   └── error.middleware.js      # asyncHandler, notFoundHandler, global errorHandler
    ├── utils/
    │   └── objectId.js              # Safe MongoDB ObjectId validation/parsing
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── donationRequest.controller.js
    │   ├── blog.controller.js
    │   └── payment.controller.js
    └── routes/
        ├── index.js                 # Aggregates all route modules
        ├── auth.routes.js
        ├── user.routes.js
        ├── donationRequest.routes.js
        ├── blog.routes.js
        └── payment.routes.js
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas cluster (or MongoDB URI)
- Stripe account (for payment intents)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of `hopePulse-server-a12`:

```env
PORT=5000
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
ACCESS_TOKEN_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Run Locally

```bash
npm start
```

The server will start on `http://localhost:5000` (or the `PORT` defined in `.env`).

---

## Authentication & Error Handling

- **JWT Auth:** Protected routes require an `Authorization: Bearer <token>` header issued by `POST /jwt`. Tokens expire in `1h`.
- **Role-Based Access:** Admin-only routes run `verifyToken` followed by `verifyAdmin` (checks `user.role === "Admin"`).
- **Standard Status Codes:**
  - `400` — Invalid ObjectId or invalid request payload/status
  - `401` — Missing or invalid JWT token
  - `403` — Authenticated user lacks required Admin/owner permissions
  - `404` — Unmatched route
  - `500` — Internal server error

---

## API Endpoints

### Health Check

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Returns `"HopePulse server is running"` |

### Authentication

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/jwt` | Public | Generates a signed JWT token (`1h` expiry) |

### Users

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/users` | Public | Registers a new user if email does not exist |
| `GET` | `/user?email=...` | JWT | Fetches a single user by email |
| `GET` | `/user/admin/:email` | JWT | Checks if the authenticated user has the `Admin` role |
| `GET` | `/allUsers` | JWT | Lists all users |
| `PATCH` | `/user-update/:id` | JWT | Updates user profile (`name`, `bloodGroup`, `district`, `upazilla`, `image`) |
| `PATCH` | `/user-update/role/:id` | JWT + Admin | Updates a user's `role` |
| `PATCH` | `/user-update/status/:id` | JWT | Updates a user's `status` |

### Donation Requests

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/createDonationRequest` | JWT | Creates a new blood donation request |
| `GET` | `/pending-donation-requests` | Public | Lists all requests with `donationStatus: "pending"` |
| `GET` | `/donationRequests?email=...` | JWT | Fetches the 3 most recent requests for a requester |
| `GET` | `/allDonationRequests?email=...` | JWT | Fetches all requests for a requester |
| `GET` | `/allDonationRequestsAd` | JWT | Lists all donation requests |
| `GET` | `/donationRequest/:id` | JWT | Fetches a single donation request by ID |
| `PATCH` | `/requestUpdate/:id` | JWT | Updates editable fields of a donation request |
| `PATCH` | `/request-status-update/:id` | JWT | Updates `donationStatus` (`canceled`, `done`, or `inprogress` with donor info) |
| `DELETE` | `/requestDelete/:id` | JWT + Admin | Deletes a donation request by ID |

### Blogs

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/createBlog` | JWT | Creates a new blog post |
| `GET` | `/allBlogs` | JWT | Lists all blogs |
| `GET` | `/publishedBlogs` | Public | Lists all blogs with `status: "published"` |
| `PATCH` | `/blog-status-update/:id` | JWT | Updates blog `status` (`"draft"` or `"published"`) |

### Funding & Payments

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/create-payment-intent` | Public | Creates a Stripe `PaymentIntent` in USD for `donationAmount` |
| `POST` | `/payments` | Public | Saves a completed payment record |
| `GET` | `/allFunding` | JWT | Lists all funding/payment records |
| `GET` | `/allFunding10` | JWT | Lists the 10 most recent funding/payment records |

---

## Deployment (Vercel)

The repository includes [vercel.json](vercel.json) configured to route all incoming requests to `index.js`.

1. Add `DB_USER`, `DB_PASS`, `ACCESS_TOKEN_SECRET`, and `STRIPE_SECRET_KEY` in **Vercel Dashboard → Project Settings → Environment Variables**.
2. In **MongoDB Atlas → Network Access**, allow `0.0.0.0/0` so Vercel serverless functions can connect.
3. Deploy from `hopePulse-server-a12`:

```bash
vercel --prod
```

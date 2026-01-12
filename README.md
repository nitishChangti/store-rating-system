# Rating

A simple, pragmatic full‑stack app for letting users rate stores, admins to manage users/stores, and store owners to view ratings for their business. It’s designed to be easy to run locally and to extend as your needs grow.

---

## Table of contents
- What this project is
- Tech stack
- Quick start
- Environment variables
- Database schema
- API reference
- Authentication & security notes
- Development notes & suggestions
- Contributing
- License & contact

---

## What this project is
This repository contains:
- A backend (Node + Express + PostgreSQL) that exposes a small set of REST endpoints for auth, stores, ratings, and admin operations.
- A frontend (React + Vite) that consumes the API using `axios` and stores session tokens in httpOnly cookies.

The goal was to keep things simple, readable, and easy to extend.

---

## Tech stack
- Backend: Node.js (ESM), Express 5, PostgreSQL (`pg`), `jsonwebtoken`, `bcrypt`  
- Frontend: React (Vite), Axios, Redux Toolkit  
- Dev ergonomics: dotenv, clear project structure, and direct SQL access via `pg`.

---

## Quick start

Prerequisites
- Node.js (v16+/v18+ recommended)  
- PostgreSQL (local or hosted, e.g., Supabase)

Backend
1. cd `backend`  
2. npm install  
3. Copy `.env` (or create one) and set required variables (see below)  
4. Start the dev server:
   - `npm run dev` (uses `node --watch src/index.js`)

Frontend
1. cd `frontend`  
2. npm install  
3. Set `VITE_BASE_URL` in `frontend/.env` (e.g., `http://localhost:3000`)  
4. `npm run dev` (starts Vite)

---

## Environment variables

Backend (`backend/.env`):
- `PORT` — server port (e.g., `3000`)  
- `DATABASE_URL` — Postgres connection string  
- `ACCESS_TOKEN_SECRET` — JWT secret for access tokens  
- `ACCESS_TOKEN_EXPIRY` — e.g., `1d`  
- `REFRESH_TOKEN_SECRET` — JWT refresh secret  
- `REFRESH_TOKEN_EXPIRY` — e.g., `10d`

Frontend (`frontend/.env`):
- `VITE_BASE_URL` — backend base URL (e.g., `http://localhost:3000`)

> ⚠️ The backend’s config helper exits the process if a required env var is missing (see `src/config/config.js`). If the server quits on startup, check the console for which var is missing.

---

## Database schema (example)

Use this schema as a starting point:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address TEXT,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address TEXT,
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  rating NUMERIC(2,1),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ratings (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, store_id)
);


Below is a **clean, corrected, and professional `README.md`** version of your content.
It is properly structured, recruiter-friendly, and ready to paste directly into `README.md`.

```
## API Response Format

All API responses follow a consistent structure:

```json
{
  "statusCode": 200,
  "data": { },
  "message": "Success message",
  "success": true
}
```

---

## Authentication & Authorization

* Authentication is handled using **JWT (JSON Web Tokens)**.
* Tokens are stored in an **httpOnly cookie** named `accessToken`.
* Clients may also send the token using:

  ```
  Authorization: Bearer <token>
  ```
* Role-based access control is enforced via middleware.

---

## Public & User Routes

### Register User

**POST** `/register`

**Body**

```json
{
  "name": "John Amazing Name",
  "email": "me@example.com",
  "address": "123 Main Street",
  "password": "Pass!Word1"
}
```

**Validations**

* Name: 20–60 characters
* Email: valid email format
* Address: max 400 characters
* Password: 8–16 characters, at least one uppercase letter and one special character

---

### Login

**POST** `/login`

**Body**

```json
{
  "email": "me@example.com",
  "password": "Pass!Word1"
}
```

**Response**

* Sets `accessToken` cookie
* Returns:

```json
{
  "existingUser": { },
  "accessToken": "jwt-token"
}
```

---

### Get Current User

**GET** `/getcurrentuser`

**Auth**

* Cookie or Bearer token

---

### Update Password

**POST** `/update-password`

**Auth**

* User required

**Body**

```json
{
  "currentPassword": "OldPass!1",
  "newPassword": "NewPass!2"
}
```

---

### Get Profile

**GET** `/profile`

**Auth**

* User required

---

### Logout

**GET** `/logout`

* Clears authentication cookie

---

## Store Routes

### Get All Stores (Public)

**GET** `/getallstores`

---

### Get Store Details

**GET** `/stores/:id`

**Auth**

* User required

---

### Submit Rating

**POST** `/ratings`

**Auth**

* User required

**Body**

```json
{
  "storeId": 1,
  "rating": 5
}
```

**Rules**

* Rating must be between **1 and 5**
* Returns updated store average rating

---

## Admin Routes

All admin routes require **admin role**
Prefix: `/admin/*`

### Create User

**POST** `/admin/registerUser`

---

### Fetch Store Owners

**GET** `/admin/fetch-store-owners`

---

### Create Store

**POST** `/admin/createstore`

---

### Get All Stores

**GET** `/admin/getallstores`

---

### Dashboard Statistics

**GET** `/admin/dashboard-stats`

Returns:

* Total users
* Total stores
* Total submitted ratings

---

### Users With Store Averages

**GET** `/admin/users`

---

## Store Owner Routes

### Store Dashboard Details

**GET** `/store-owner/dashboard/store-details`

**Role**

* `store_owner`

Returns:

* Store information
* Ratings and averages

---

## Middleware

* **verifyJWT** – verifies JWT and populates `req.user`
* **authorization(roles)** – enforces role-based access (403 if unauthorized)

---

## Security Notes

* Use **HTTPS** in production
* Set cookies:

  ```js
  secure: true
  sameSite: 'none'
  ```

  (if frontend and backend are on different domains)
* Never commit JWT secrets to source control

---

## Development Notes & Suggestions

* Add database migrations (e.g., `node-pg-migrate` or `knex`)
* Write unit and integration tests for controllers and models
* Consider adding:

  * OpenAPI / Swagger documentation
  * Postman collection
* Backend exits on missing critical environment variables—check logs if startup fails

---

## Example Usage (cURL)

### Register

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Amazing Name","email":"me@example.com","address":"123 Main","password":"Pass!Word1"}' \
  -c cookies.txt
```

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"me@example.com","password":"Pass!Word1"}' \
  -c cookies.txt
```

### Submit Rating

```bash
curl -X POST http://localhost:3000/ratings \
  -H "Content-Type: application/json" \
  -d '{"storeId":1,"rating":5}' \
  -b cookies.txt
```

---

## Contributing

* Open an issue for bugs or feature requests
* Fork the repository and submit a pull request
* Keep changes focused and include tests where possible

---

# Deployment Guide

This project has been configured to be **hosting-independent**. You can deploy the Backend, Frontend, and Admin panel to any platform (Vercel, DigitalOcean, Heroku, AWS, etc.) by simply configuring the Environment Variables.

## 1. Backend Deployment (Restro-Backend)

The backend can be hosted on any Node.js capable platform.

### Environment Variables
You must set these variables in your hosting provider's dashboard:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `PORT` | Port to run the server (usually handled by provider) | `4000` or blank |
| `MONGO_DBurl` | MongoDB Connection String | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secret for token signing | `your-secret-key` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `yoxw...` |
| `ALLOWED_ORIGINS` | (Optional) Comma-separated list of allowed frontend URLs | `https://www.restro77.com,https://admin.restro77.com` |

> **Note:** If `ALLOWED_ORIGINS` is not set, the backend will default to allowing **all origins** (useful for testing or initial setup).

---

## 2. Frontend Deployment (Restro-Frontend)

The frontend is a Vite + React app. It can be hosted on Vercel, Netlify, or similar static sites.

### Environment Variables
You must set this variable during build time (in Vercel/Netlify settings):

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_BACKEND_URL` | URL of your deployed Backend | `https://api.restro77.com` or `https://your-app.vercel.app` |

> **Local Development:** A `.env` file has been created in `Restro-Frontend/Restro77-frontend/.env` set to `http://localhost:4000` for local use.

---

## 3. Admin Panel Deployment (Restro77-admin-main)

The Admin panel is also a Vite + React app.

### Environment Variables
Similar to the Frontend:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_BACKEND_URL` | URL of your deployed Backend | `https://api.restro77.com` or `https://your-app.vercel.app` |

> **Local Development:** A `.env` file has been created in `Restro77-admin-main/.env` set to `http://localhost:4000` for local use.

---

## Summary of Changes Made
1.  **Backend:** Updated `server.js` to accept `ALLOWED_ORIGINS` env var for CORS (HTTP and Socket.IO). Removed unused hardcoded URLs.
2.  **Frontend:** Verified `StoreContext.jsx` uses `VITE_BACKEND_URL`. Created `.env` for local dev.
3.  **Admin:** Updated `assets.js` and `App.jsx` to use `VITE_BACKEND_URL`. Created `.env` for local dev.

Now you can switch from "hither to thither" freely! Just update the `VITE_BACKEND_URL` on your frontend/admin deployments to point to wherever your backend is running.

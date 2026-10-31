# FoodBridge 🍲🌿
> **“Turning Surplus Food into Hope.”**

A modern, responsive full-stack web application connecting surplus food donors (hotels, restaurants, hostels, catering services, function halls) with verified NGOs, orphanages, old-age homes, and community shelters to reduce food waste and combat hunger.

---

## 🌟 Key Highlights & Features

### 1. Landing Page & Public Discovery
- **Hero Showcase**: Tagline *“Turning Surplus Food into Hope”* with imagery, quick demo accounts switch, and prominent action buttons: **Donate Food**, **Find Food**, and **Join Us**.
- **How It Works in 3 Simple Steps**: Visual workflow explaining donor listing, NGO claiming, and verified volunteer distribution.
- **Audited Platform Impact**: Transparent impact counter distinguishing **Actual Verified Figures** (delivered meals, participating donors, NGOs) from **Estimated Environmental Projections** (kg of food diverted from landfills, CO2 emissions prevented).
- **Testimonials & Trust**: Real feedback from executive chefs, orphanage directors, and catering heads.

### 2. Role-Based Authentication & Security
- **JWT-Protected Authentication**: Secure bcrypt password hashing and token expiration.
- **Separate Registration Profiles**: Specialized onboarding for **Food Donors** (Hotel, Restaurant, Hostel, Function Hall, Catering) and **NGOs / Charitable Organizations** (Orphanage, Old-Age Home, Shelter, Relief Trust).
- **1-Click Demo Logins**: Instant demo switcher to test as a Hotel Donor, NGO Shelter, or Platform Administrator.

### 3. Food Donor Dashboard
- **Donation Analytics**: Active batches, incoming NGO requests, total servings provided, and completed deliveries.
- **Post Food Donation Form**:
  - Title, description, category (Cooked Meals, Bakery, Groceries, Produce, etc.), dietary preference (Vegetarian, Non-Veg, Vegan, Eggetarian).
  - Servings count and batch quantity.
  - Food preparation time & Safe Consumption Deadline (Expiry) date-time pickers.
  - Pickup location, loading gate, city, and pickup time window.
  - Photo upload or selection from 6 realistic food presets.
  - **Mandatory Food Safety Certification**: Strict declaration ensuring food is fresh, unadulterated, and stored at safe temperatures (>65°C hot or <5°C cold).
- **Incoming Request Management**: Donors review NGO volunteer and vehicle info, with the ability to **Accept** or **Decline** claims.
- **Pickup Verification PIN**: Generates a 4-digit code once matched so kitchen loading staff can verify the NGO driver before releasing food.
- **Edit & Cancel**: Modify or cancel eligible active batches.

### 4. NGO Dashboard & Food Rescue Hub
- **Available Food Feed**: Search and filter by dish name, city, category, and dietary type.
- **Claim Food Modal**: NGOs request desired servings, specify arrival ETA, volunteer name, phone, vehicle number, and beneficiary note.
- **My Rescue Claims Tracker**:
  - **Pending**: Awaiting donor approval.
  - **Accepted**: Displays donor contact, address, and the 4-digit verification PIN.
  - **In Transit (Picked Up)**: Volunteer marks food collected.
  - **Delivered**: Confirms meals reached beneficiaries, updating verified impact counters.

### 5. 5-Step Lifecycle Tracking Timeline
Full auditable journey:
1. `Available` ➔ 2. `Requested` ➔ 3. `Accepted` ➔ 4. `Picked Up` ➔ 5. `Delivered` *(or `Cancelled`)*
- Shows timestamped activity logs with author roles and status transitions.

### 6. Admin Governance & Safety Reporting
- **Platform Analytics**: Verified delivered meals vs. estimated food waste saved.
- **User Management**: View, search, verify NGOs, and suspend or activate accounts.
- **Safety Review**: Inspect reported listings, dismiss false alarms, or remove unsafe food batches.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Lucide React icons, Axios, React Router v6
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js, Morgan, Multer
- **Database**: MongoDB & Mongoose *(with built-in zero-config in-memory fallback for offline testing)*
- **Deployment Ready**: Vercel (`vercel.json`), Render (`render.yaml`), MongoDB Atlas

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (optional — FoodBridge connects to local/Atlas MongoDB, or uses its built-in in-memory engine if MongoDB is not running)

### 1. Clone & Install Dependencies

```bash
# Navigate to project directory
cd Foodbridge

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 2. Environment Configuration

```bash
# Backend environment variables
cp backend/.env.example backend/.env
```

`backend/.env` contents:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/foodbridge
JWT_SECRET=foodbridge_super_secret_jwt_key_998811
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Realistic Sample Data

```bash
cd backend
npm run seed
cd ..
```
*Seeds 7 accounts (donors, NGOs, admin), 5 active/delivered food batches with high-res photography, requests, and tracking logs.*

### 4. Run Application

In separate terminal windows (or concurrently):

**Terminal 1 (Backend API on port 5000):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend Client on port 5173):**
```bash
cd frontend
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🔑 Pre-Seeded Demo Accounts

You can log in with a single click using the **“Demo Accounts”** button in the navigation bar, or enter these credentials:

| Role | Name & Organization | Email | Password |
|---|---|---|---|
| **Donor** | Chef Vikram Anand (Grand Royal Hotel & Banquets) | `donor@foodbridge.org` | `Password123!` |
| **Donor** | Anita Sharma (The Green Leaf Caterers) | `anita@greenleaf.com` | `Password123!` |
| **NGO** | Rajeshwari Patel (Hope Child Care & Orphanage) | `ngo@foodbridge.org` | `Password123!` |
| **NGO** | Sunil Kulkarni (Annapurna Seva Trust) | `sunil@annapurnaseva.org` | `Password123!` |
| **Admin** | System Administrator (FoodBridge HQ) | `admin@foodbridge.org` | `Password123!` |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create donor or NGO account
- `POST /api/auth/login` - Login & receive JWT token
- `GET /api/auth/me` - Get authenticated profile
- `PUT /api/auth/profile` - Update contact & address info

### Food Donations (`/api/donations`)
- `GET /api/donations` - Public/NGO browse with filters (`category`, `dietaryType`, `city`, `status`, `search`, `sortBy`)
- `GET /api/donations/:id` - Single donation with tracking logs & requests
- `GET /api/donations/my-donations` - Donor's active & completed listings
- `POST /api/donations` - Post new surplus food batch (Protected: Donor)
- `PUT /api/donations/:id` - Edit active listing (Protected: Donor)
- `PUT /api/donations/:id/cancel` - Cancel listing with reason
- `POST /api/donations/:id/report` - Report food safety concern

### Claims & Requests (`/api/requests`)
- `POST /api/requests` - Submit NGO food claim (Protected: NGO)
- `GET /api/requests/my-requests` - NGO's claimed requests
- `PUT /api/requests/:id/respond` - Donor accepts or declines request
- `PUT /api/requests/:id/status` - Mark `Picked Up` or `Delivered`

### Governance & Impact (`/api/admin` & `/api/stats`)
- `GET /api/stats` - Platform verified vs. estimated statistics
- `GET /api/admin/users` - Manage users with search and role filters
- `PUT /api/admin/users/:id` - Toggle active/suspended or verify NGO
- `GET /api/admin/reports` - Flagged listings review
- `PUT /api/admin/reports/:id/resolve` - Resolve and clear safety report
- `DELETE /api/admin/donations/:id` - Admin removal of unsafe listing

---

## ☁️ Production Deployment Guide

### 1. Database: MongoDB Atlas
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist IP `0.0.0.0/0` (allow access from anywhere).
3. Copy your connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/foodbridge?retryWrites=true&w=majority`

### 2. Backend: Render
1. Push code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A strong random 32-character string>`
   - `JWT_EXPIRES_IN`: `30d`

### 3. Frontend: Vercel
1. Create a new project on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-render-backend.onrender.com/api`
5. Deploy! Vercel will build the frontend using `vercel.json` SPA rewrite rules.

---

## 📜 License & Compliance

Built for social good under the MIT License. FoodBridge complies with Good Samaritan principles for charitable food rescue.

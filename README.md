# Job Portal Platform

> Modern job portal platform built with MERN stack for connecting employers and job seekers

## Tech Stack

**Frontend:**
- React + Vite
- TailwindCSS
- React Router
- React Hook Form
- Firebase Authentication
- i18next (Internationalization)

**Backend:**
- Node.js + Express
- PostgreSQL
- NestJS architecture patterns

---

## Features

- Multi-language support (English/Russian)
- Job posting and management
- Advanced job filtering and search
- User authentication with Firebase
- Responsive design with custom gold theme
- Role-based access control

## Setup

### 1. Client Configuration

Create `.env` file in `job-portal-client/`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# API Configuration
VITE_API_URL=
```

### 2. Server Configuration

Create `.env` file in `job-portal-server/`:

```env
# PostgreSQL Configuration
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

# Server Configuration
PORT=
NODE_ENV=

# CORS Origins
CORS_ORIGIN=
```

### 3. Install Dependencies

```bash
# Install client dependencies
cd job-portal-client
npm install

# Install server dependencies
cd ../job-portal-server
npm install
```

---

## Running the Project

**Development Mode:**

```bash
# Start client (http://localhost:5173)
cd job-portal-client
npm run dev

# Start server (http://localhost:5000)
cd job-portal-server
npm run start:dev
```

**Production Build:**

```bash
# Build client
cd job-portal-client
npm run build

# Build server
cd job-portal-server
npm run build
```

---

## Color Theme

The platform uses a custom gold color scheme inspired by traditional Kalmyk symbols:

- Primary Gold: `#F4A511`
- Dark Text: `#1A1A1A`
- Light Background: `#FAFAFA`

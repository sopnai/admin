# Flawless Admin Panel

A React-based admin dashboard for managing clients, artists, bookings, services, notifications, and reports. Built on the Veltrix template with Redux and Redux-Saga.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Routes & Features](#routes--features)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Docker](#docker)
- [Scripts](#scripts)
- [Further Documentation](#further-documentation)

---

## Overview

**Flawless Admin Panel** is a single-page application (SPA) that provides:

- **Dashboard** – Counts and charts for clients, artists, bookings, services, and booking status
- **Client management** – List, add, edit clients
- **Artist management** – List, add, edit, approve artists; manage images and levels
- **Booking management** – List, view, update booking status
- **Services** – Categories (services) and sub-services CRUD
- **Notifications** – Create and manage notifications
- **Chat** – Chat list and messages
- **Revenue report** – Booking items and payment status
- **Settings** – Artist levels, app version, Terms & Conditions, Privacy Policy

The app uses a **vertical layout** with sidebar navigation and requires login for all protected routes.

---

## Tech Stack

| Category      | Technology |
|---------------|------------|
| UI            | React 18, Reactstrap, Bootstrap 5 |
| State         | Redux 5, Redux-Saga |
| Routing       | React Router v6 |
| HTTP          | Axios |
| Forms         | Formik, Yup |
| Charts        | ApexCharts, Chart.js, ECharts |
| i18n          | react-i18next |
| Build         | Create React App (react-scripts 5) |

---

## Project Structure

```
admin-main/
├── public/                 # Static assets, index.html
├── src/
│   ├── assets/            # Images, SCSS, fonts
│   ├── common/            # Shared data/constants
│   ├── components/        # Reusable UI (VerticalLayout, Sidebar, Header, Alert)
│   ├── constants/         # Layout and app constants
│   ├── helpers/           # API client, URLs, auth helpers, fake backend
│   ├── locales/           # i18n translation JSON (eng, gr, it, rs, sp)
│   ├── pages/             # Route-level pages (Dashboard, Client, Artist, etc.)
│   ├── routes/            # Route definitions, Auth middleware
│   ├── store/             # Redux reducers, sagas, actions (per domain)
│   ├── utility/           # Common constants
│   ├── App.js             # Root app, routes, fake backend init
│   └── index.js           # React root, Redux Provider, Router
├── dockerizer/            # Dockerfile, nginx.conf for production build
├── package.json
└── yarn.lock
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (or 20 for Docker build)
- **Yarn** or npm

### Install and run

```bash
# Install dependencies
yarn install
# or: npm install

# Start development server (http://localhost:3000)
yarn start
# or: npm start
```

### Build for production

```bash
yarn build
# or: npm run build
```

Output is in the `build/` folder (static files for any web server or Docker).

---

## Environment Variables

Create a `.env` in the project root (or `.env.local`). The app uses:

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL (required for real API) | `https://api.example.com/admin` |
| `REACT_APP_DEFAULTAUTH` | Auth mode: `fake`, `jwt`, or `firebase` | `fake` or `jwt` |

- **`fake`** – Mock login (see [Authentication](#authentication)); other data still comes from `REACT_APP_API_URL` if set.
- **`jwt`** – Same mock user list as fake; token stored in `localStorage` as `authUser`.
- **`firebase`** – Firebase auth (config and init are commented out in `App.js`).

All API calls in `src/helpers/api_helper.js` use `REACT_APP_API_URL` as `baseURL`. If not set, requests will go to the current origin.

---

## Authentication

- **Protected routes** require `authUser` in `localStorage`. If missing, the user is redirected to `/login` (see `src/routes/middleware/Authmiddleware.js`).
- **Login** is handled in Redux: `LOGIN_USER` → saga → `postFakeLogin` or `postJwtLogin` (from `fakebackend_helper`) or Firebase, depending on `REACT_APP_DEFAULTAUTH`.
- **Fake/JWT demo user** (when using mock auth):
  - **Email:** `admin@gmail.com`
  - **Password:** `123456`
- **Real backend:** Use the same login endpoint `POST /login`; credentials are validated by your API. Token is read from `authUser.data.accessToken` and sent as `Authorization: Bearer <token>` (see `api_helper.js`).
- **Logout:** Clears `authUser` and redirects to `/login`.
- **Forgot password:** `/forgot-password`; uses `updateForgotPassword` and `getMobileProfile` from `helpers/Module.jsx`.

---

## Routes & Features

### Public (no auth)

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | Login | Email/password login |
| `/forgot-password` | ForgetPassword | Forgot password flow |

### Protected (auth required)

| Path | Component | Description |
|-----|-----------|-------------|
| `/` | Redirect | Redirects to `/dashboard` |
| `/dashboard` | Dashboard | Stats and charts |
| `/client` | Client | Client list |
| `/client-add` | ClientAdd | Add client |
| `/client-edit/:id` | ClientEdit | Edit client |
| `/artist` | Artist | Artist list |
| `/artist-add` | ArtistAdd | Add artist |
| `/artist-edit/:id` | ArtistEdit | Edit artist |
| `/booking/` | Booking | Booking list |
| `/booking-view/:id` | BookingView | Booking detail |
| `/training-booking` | TrainigBooking | Training bookings |
| `/services/` | Services | Service categories list |
| `/service-view/:categoryId` | ServiceView | Category detail & sub-services |
| `/sub-services/:servId` | SubServices | Sub-services list |
| `/sub-service-view/` | SubServiceView | Sub-service view |
| `/report` | Report | Revenue report |
| `/notification` | Notification | Notifications |
| `/chat` | Chat | Chat list & messages |
| `/artist-lvl` | Settings (ArtistLVL) | Artist levels |
| `/app-version` | AppVersion | App version config |
| `/page/terms-and-condition` | PageTermsCondition | Terms & conditions content |
| `/page/privacy-policy` | PagePrivacyPolicy | Privacy policy content |
| `/profile` | UserProfile | Admin profile & change password |
| `/logout` | Logout | Logout and redirect to login |

Sidebar menu is defined in `src/components/VerticalLayout/SidebarContent.js` (Dashboard, Clients, Artist, Booking, Services, Notification, Chat, Revenue Report, Settings submenu).

---

## State Management

- **Store:** Single Redux store created in `src/store/index.js` (root reducer + saga middleware).
- **Reducers:** Combined in `src/store/reducers.js`: Layout, Login, Account, ForgetPassword, Profile, DashboardRD, ArtistRD, ClientRD, BookingRD, NotificationRD, ArtistLvlRD, AppVRD, CatRD, SubServRD, ChatRD, ReportRD, calendar.
- **Sagas:** Root saga in `src/store/sagas.js` forks Auth, Profile, Dashboard, Artist, Client, Booking, Notification, ArtistLvl, AppV, Categories, SubServices, Chat, Report, Layout, ForgetPassword, calendar.
- **Pattern:** Each domain has `actions.js`, `actionTypes.js`, `reducer.js`, `saga.js`. Sagas call helpers from `helpers/Module.jsx` (which use `api_helper.js` and `url_helper.js`).

---

## API Integration

- **Base URL:** `process.env.REACT_APP_API_URL` in `src/helpers/api_helper.js`.
- **Auth:** Token from `localStorage.authUser.data.accessToken`; sent as `Bearer` in `Authorization`. On 401, user is prompted and redirected to `/login`.
- **Endpoints:** All API paths are in `src/helpers/url_helper.js`. CRUD helpers are in `src/helpers/Module.jsx` (e.g. `getDashboardData`, `getArtistList`, `postLogin`, `getBookingList`).
- **Fake backend:** `src/helpers/AuthType/fakeBackend.js` is imported and run in `App.js`; it uses axios-mock-adapter on the **default** axios instance. The app’s API client uses a **separate** axios instance with `baseURL`, so in practice login and other calls go to your real API when `REACT_APP_API_URL` is set.

---

## Docker

- **Dockerfile** (in `dockerizer/`): Expects the app to be **already built** (`yarn build`). The image copies the `build/` folder and nginx config; it does not run `yarn` inside the image.
- **nginx.conf:** Serves static files from `/usr/share/nginx/html`; `try_files $uri /index.html` for SPA routing.

Build and run (run `yarn build` first, from project root):

```bash
docker build -f dockerizer/Dockerfile -t flawless-admin .
docker run -p 80:80 flawless-admin
```

For building the app inside Docker and deployment options, see **`docs/DEPLOYMENT.md`**.

---

## Scripts

| Command | Description |
|--------|-------------|
| `yarn start` | Dev server (port 3000) |
| `yarn build` | Production build to `build/` |
| `yarn test` | Run tests |
| `yarn lint` | ESLint |
| `yarn format` | Prettier format |

**Windows:** `remove-node_modules.ps1` uses robocopy to remove `node_modules` (handles long paths).

---

## Further Documentation

- **`docs/ARCHITECTURE.md`** – Redux flow, auth flow, layout, helpers
- **`docs/API.md`** – Backend endpoint list and helper mapping
- **`docs/DEPLOYMENT.md`** – Environment, Docker, nginx, deployment checklist

---

## License

Private. Branding: “Flawless Admin Panel” / “Veltrix” template base.

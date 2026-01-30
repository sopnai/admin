# Codebase Documentation — Full Context

This document describes the **entire codebase** so every file and flow is understandable in context. Use it for onboarding, AI context, or refactors.

---

## 1. Project Overview

- **Name:** veltrix-react (Flawless Admin Panel)
- **Type:** React 18 SPA (Create React App 5)
- **State:** Redux 5 + Redux-Saga
- **Routing:** React Router v6
- **UI:** Reactstrap (Bootstrap 5), SCSS
- **Auth:** JWT (or fake/Firebase via env); auth user in `localStorage.authUser`
- **API base URL:** `process.env.REACT_APP_API_URL`; all API calls go through `helpers/api_helper.js` (axios with Bearer token and 401 → logout)

**Important env vars:**
- `REACT_APP_API_URL` — backend base URL
- `REACT_APP_DEFAULTAUTH` — `"jwt"` | `"fake"` | `"firebase"` (login saga branch)

---

## 2. Entry Point and Bootstrap

### `src/index.js`
- Renders the app into `#root`.
- Wraps with: **Provider (Redux store)** → **BrowserRouter** → **App**.
- Imports `./i18n` (sets up i18next).
- Imports `./store` (single Redux store).
- Calls `serviceWorker.unregister()`.

**Flow:** index.js → store + i18n → App inside Router inside Provider.

### `public/index.html`
- Root HTML; has `<div id="root">` and script that loads the CRA bundle.

---

## 3. App and Routing

### `src/App.js`
- **No direct URL handling.** Only renders two route groups:
  1. **authRoutes** — paths like `/login`, `/forgot-password`. Wrapped in **NonAuthLayout** (no sidebar/header).
  2. **userRoutes** — all other paths. Wrapped in **Authmiddleware** then **VerticalLayout** (sidebar + header + main content).
- Imports and calls `fakeBackend()` from `helpers/AuthType/fakeBackend.js` (mocks for fake auth).
- Connects to Redux for `layout: state.Layout` (not used in render; kept for compatibility).
- Uses **React Router v6**: `<Routes>`, `<Route path= element=>`.

**Flow:** URL → matching route in authRoutes or userRoutes → layout (NonAuth or Authmiddleware+Vertical) → page component.

---

## 4. Routes Definition

### `src/routes/allRoutes.js`
- **userRoutes:** Array of `{ path, component }`. Includes:
  - Dashboard, Client (list/add/edit), Artist (list/add/edit), Booking (list/view), TrainingBooking
  - Services, ServiceView, SubServices, SubServiceView
  - Notification, Report, Chat
  - Settings: ArtistLVL, AppVersion, PageTermsCondition, PagePrivacyPolicy
  - Profile, Logout, and `/` → redirect to `/dashboard`.
- **authRoutes:** Login, ForgotPassword.
- All page components are imported here; this file is the single place that defines which component runs for each path.

### `src/routes/middleware/Authmiddleware.js`
- **Purpose:** Protect routes that require login.
- Reads `layoutType` from Redux `state.Layout.layoutType` and picks layout (only **VerticalLayout** is used).
- If `!localStorage.getItem("authUser")` → redirect to `/login` (with `<Navigate>`).
- Otherwise renders `<Layout>{props.children}</Layout>` (VerticalLayout wrapping the page).

**Flow:** User route hit → Authmiddleware checks auth → redirect or render VerticalLayout with children.

---

## 5. Redux Store (Global State)

### `src/store/index.js`
- Creates store with `createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)))`.
- Runs `sagaMiddleware.run(rootSaga)`.
- Exports single store.

### `src/store/reducers.js`
- **combineReducers** of:
  - **Layout** — sidebar/theme/layout type (vertical, width, theme, etc.).
  - **Login, Account, ForgetPassword, Profile** — auth-related state.
  - **DashboardRD, ArtistRD, ClientRD, BookingRD, NotificationRD, ArtistLvlRD, AppVRD, CatRD, SubServRD, ChatRD, ReportRD** — feature state.
  - **calendar** — calendar state.
- Naming: `*RD` = “reducer” to avoid name clashes with page components.

### `src/store/actions.js`
- Re-exports all action creators from:
  - layout, auth (register, login, forgetpwd, profile), dashboard, artist, client, booking, notification, artist-lvl, app-v, categories, subServices, chat, report, pages.
- Any component that needs to dispatch uses these (or imports from a specific slice, e.g. `store/auth/login/actions`).

### `src/store/sagas.js`
- **rootSaga** runs all feature sagas in parallel (`all([...fork(...)])`).
- Sagas: Account, Auth (login), Profile, Dashboard, Forget, Layout, Artist, Client, Booking, Notification, ArtistLvl, AppV, Calendar, Categories, SubServices, Chat, Report.
- **Auth saga** (login/logout) is in `store/auth/login/saga.js` (see below).

**Data flow (example – login):**
1. Component dispatches `loginUser(user, navigate)`.
2. Saga in `auth/login/saga.js` runs: calls API (or fake), then `loginSuccess` or `apiError`.
3. Reducer in `auth/login/reducer.js` updates `Login` slice (loading, error).
4. Token/user stored in `localStorage.authUser` by saga; navigation to `/dashboard` in saga.

---

## 6. Auth Flow (Login) — File by File

- **Actions:** `src/store/auth/login/actions.js` — `loginUser(user, history)`, `loginSuccess`, `logoutUser`, `apiError`, etc.
- **Action types:** `src/store/auth/login/actionTypes.js` — `LOGIN_USER`, `LOGIN_SUCCESS`, `LOGOUT_USER`, etc.
- **Reducer:** `src/store/auth/login/reducer.js` — initial state `{ error, loading }`; handles LOGIN_USER, LOGIN_SUCCESS, API_ERROR, etc.
- **Saga:** `src/store/auth/login/saga.js` — `loginUser` saga:
  - If `REACT_APP_DEFAULTAUTH === "jwt"` → calls `postJwtLogin` (from `helpers/fakebackend_helper.js`), then `localStorage.setItem("authUser", ...)`, `loginSuccess`, `history("/dashboard")`.
  - Same idea for `fake` and `firebase`; on error dispatches `apiError` and shows `ErrorAlert`.
- **Page:** `src/pages/Authentication/Login.js` — Formik form, dispatches `loginUser(values, props.router.navigate)` on submit; shows error from Redux or API.

**Context:** API base URL and auth method come from env; actual HTTP for JWT is in `helpers/fakebackend_helper.js` (or api_helper if you switch to real API).

---

## 7. API and URL Helpers

### `src/helpers/api_helper.js`
- Reads `REACT_APP_API_URL` and creates an **axios** instance with that baseURL.
- **Request interceptor:** adds `Authorization: Bearer <token>`; token from `localStorage.authUser` → `authUser.data.accessToken`.
- **Response interceptor:** on 401, shows “Session Expired” (Swal) and redirects to `/login`.
- Exports `get`, `post`, `put`, `del` and default `axiosApi`.

**Context:** All real API calls should use this module so token and 401 handling are consistent.

### `src/helpers/url_helper.js`
- **Only constants:** exports API path strings (e.g. `ADMIN_LOGIN`, `ARTIST_GET`, `BOOKING_GET`, `DASHBOARD_DATA`, etc.).
- Used by sagas and API helpers to build URLs (e.g. `get(url_helper.ARTIST_GET)`).

### `src/helpers/AuthType/fakeBackend.js`
- Uses **axios-mock-adapter** to mock endpoints (e.g. `/post-fake-login`, `/post-jwt-login`).
- Used when running without backend; called once from `App.js` (`fakeBackend()`).

### `src/helpers/jwt-token-access/accessToken.js`
- Placeholder for JWT token (e.g. for development). api_helper instead reads from `localStorage.authUser`.

### `src/helpers/Module.jsx`
- Exports helper functions used by auth (e.g. `getMobileProfile`, `updateForgotPassword`) that call API/url_helper.

---

## 8. Layout and UI Components

### `src/constants/layout.js`
- Exports enums: `layoutTypes`, `layoutWidth`, `leftSideBarTheme`, `bodyTheme`, `leftSideBarType`, `topbarTheme`, etc.
- Used by Layout reducer and VerticalLayout to keep theme/layout type in sync.

### `src/store/layout/reducer.js`
- State: `layoutType`, `layoutWidth`, `leftSideBarTheme`, `bodyTheme`, `bodyMode`, `leftSideBarType`, `topbarTheme`, `showRightSidebar`, `showSidebar`, `leftMenu`, etc.
- Actions: `CHANGE_LAYOUT`, `CHANGE_SIDEBAR_THEME`, `CHANGE_BODY_THEME`, etc.

### `src/components/VerticalLayout/index.js`
- **VerticalLayout** = Header + Sidebar + main content + Footer; optionally Rightbar.
- Connects to Redux (Layout state and layout actions); uses `withRouter`.
- Renders: `<Header />`, `<Sidebar />`, `<div className="main-content">{children}</div>`, `<Footer />`, and conditionally `<Rightbar />`.
- Handles toggle sidebar, rightbar visibility, and theme from Redux.

### `src/components/VerticalLayout/Header.js`
- Top bar: logo, menu toggle, topbar dropdowns (language, notifications, profile).

### `src/components/VerticalLayout/Sidebar.js`
- Left navigation menu (links to dashboard, client, artist, booking, etc.); uses layout theme/type from Redux.

### `src/components/VerticalLayout/Footer.js`
- Footer content (e.g. copyright).

### `src/components/CommonForBoth/Rightbar.js`
- Right sidebar panel (e.g. settings); shown when `showRightSidebar` is true.

### `src/components/NonAuthLayout.js`
- Wrapper for login/forgot-password: only renders `props.children` (no sidebar/header).

### `src/components/Common/withRouter.js`
- React Router v6 compatibility: provides `router` (e.g. `navigate`, `location`) to class components that expect `props.history`/`props.location`.

### `src/components/Alert/Alert.jsx`
- Exports `ErrorAlert` (and similar) used for showing error toasts/alerts (e.g. login error).

### `src/components/Loading/Loading.js`
- Loading spinner/UI used across pages.

### `src/components/Datatable/DataTable.jsx`
- Reusable data table (used in list pages like Client, Artist, Booking).

---

## 9. Pages (Screens)

Pages live under `src/pages/`. Each route in `allRoutes.js` points to one of these.

- **Authentication:** Login, Logout, Register, ForgetPassword, user-profile (under `Authentication/`).
- **Dashboard:** `Dashboard/index.js` — dispatches `getDashboard()`, shows counts (clients, artists, bookings, services) and charts (e.g. Salesdonut from AllCharts).
- **Client:** Client (list), ClientAdd, ClientEdit — CRUD for clients; use Redux client actions/saga and api_helper.
- **Artist:** Artist (list), ArtistAdd, ArtistEdit — CRUD for artists; use Redux artist actions/saga.
- **Booking:** Booking (list), BookingView — booking list and detail; training booking under TrainingBooking.
- **Services:** Services (list), ServiceView, SubServices, SubServiceView — categories and sub-services.
- **Notification, Report, Chat:** List/detail pages using their respective Redux slices and API.
- **Settings:** ArtistLVL, AppVersion, PageTermsCondition, PagePrivacyPolicy — settings and static pages.
- **AllCharts:** Apex, Chartist, Chart.js, ECharts, knob, sparkline — demo chart components; Dashboard uses one of them (e.g. Salesdonut).
- **Utility:** 404, 500, maintenance, pricing, profile, timeline, gallery, invoice, etc. — utility/demo pages (some may not be in routes).

**Context:** Every page that needs data dispatches the right action (e.g. `getDashboard`, `getArtist`); the corresponding saga calls api_helper + url_helper and then dispatches success/failure; the page reads from Redux and renders.

---

## 10. Feature Slices (Redux) — Pattern

Each feature (e.g. artist, client, booking) follows the same pattern:

- **actions.js** — action creators (e.g. getList, add, update, delete).
- **actionTypes.js** — constants (e.g. ARTIST_GET, ARTIST_GET_SUCCESS, ARTIST_API_ERROR).
- **reducer.js** — initial state (list, item, loading, error); handles *_SUCCESS, *_ERROR, etc.
- **saga.js** — takeEvery/takeLatest on action types; call api_helper (get/post/put/del) with url_helper constants; dispatch success or error actions.

**Example (Artist):**
- `store/artist/actions.js` — `getArtistList`, `addArtist`, etc.
- `store/artist/saga.js` — on GET_ARTIST calls `get(url_helper.ARTIST_GET)`, then put(ARTIST_GET_SUCCESS, data).
- `store/artist/reducer.js` — stores list and loading/error.
- Page `Artist/Artist.js` — useEffect dispatch getArtistList, useSelector(artist list), render table; add/edit pages dispatch add/update and navigate.

---

## 11. Internationalization (i18n)

### `src/i18n.js`
- Uses **i18next**, **i18next-browser-languagedetector**, **react-i18next**.
- Loads translation JSON from `src/locales/{eng,gr,it,rs,sp}/translation.json`.
- Language persisted in `localStorage.I18N_LANGUAGE`; fallback `en`.
- Initialized before App so all components can use `useTranslation()` or `withTranslation()`.

### `src/locales/`
- One folder per language (eng, gr, it, rs, sp); each has `translation.json` for that locale.

---

## 12. Common Data and Utilities

### `src/common/data/`
- Mock or static data: calender.js, contacts.js, crypto.js, ecommerce.js, invoices.js, projects.js, tasks.js, index.js — used by demo pages or fake data.

### `src/common/languages.js`
- Language list/labels for the UI (e.g. dropdown in Header).

### `src/utility/CommonConstant.js`
- App-wide constants (e.g. app name, config flags).

---

## 13. Assets and Styles

### `src/assets/`
- **scss/** — global styles and theme (e.g. theme.scss, variables, custom components). Main entry for app styles is imported in App.js: `./assets/scss/theme.scss`.
- **images/** — images used in pages and components (logos, placeholders, flags, etc.).
- **fonts/** — custom fonts (e.g. dripicons).

### `public/`
- index.html, favicon, logos, manifest.json, robots.txt — static assets and CRA entry HTML.

---

## 14. Config and Root Files

- **package.json** — name (veltrix-react), scripts (start, build, lint, test), dependencies (React, Redux, React Router, Reactstrap, charts, etc.), overrides for eslint/ajv/schema-utils/babel-loader.
- **.env** — can contain `REACT_APP_API_URL`, `REACT_APP_DEFAULTAUTH`, etc.; CRA loads these into `process.env`.
- **.npmrc** — legacy-peer-deps for install.
- **jsconfig.json** — path aliases / JS project config for IDE.

---

## 15. File-by-File Quick Reference

| Path | Purpose |
|------|--------|
| `src/index.js` | Entry: Provider, Router, App |
| `src/App.js` | Route groups (auth vs user), fakeBackend, layout wrappers |
| `src/routes/allRoutes.js` | All path → component mappings |
| `src/routes/middleware/Authmiddleware.js` | Auth check; redirect or VerticalLayout |
| `src/store/index.js` | Create store, run rootSaga |
| `src/store/reducers.js` | combineReducers of all slices |
| `src/store/actions.js` | Re-export all action creators |
| `src/store/sagas.js` | rootSaga: fork all feature sagas |
| `src/store/auth/login/*` | Login/logout state and API |
| `src/store/layout/*` | Sidebar/theme state |
| `src/store/{artist,client,booking,...}/*` | Feature state (actions, types, reducer, saga) |
| `src/helpers/api_helper.js` | Axios instance, Bearer token, 401 logout |
| `src/helpers/url_helper.js` | API path constants |
| `src/helpers/AuthType/fakeBackend.js` | Mock auth endpoints |
| `src/helpers/Module.jsx` | Auth helpers (profile, forgot password) |
| `src/constants/layout.js` | Layout/theme enums |
| `src/components/VerticalLayout/*` | Main app shell (Header, Sidebar, Footer) |
| `src/components/NonAuthLayout.js` | Wrapper for login/forgot |
| `src/components/Common/withRouter.js` | Router v6 for class components |
| `src/pages/*` | Screen components; dispatch actions, useSelector, render |
| `src/i18n.js` | i18next init and locales |
| `src/assets/scss/theme.scss` | Global styles |

---

## 16. Data Flow Summary

1. **User hits URL** → Router matches route in `allRoutes.js` → Authmiddleware (for user routes) checks `localStorage.authUser` → redirect or render VerticalLayout + page component.
2. **Page loads** → useEffect dispatches action (e.g. getDashboard, getArtist) → saga runs → api_helper (axios + token) + url_helper → API response → saga dispatches success/error → reducer updates state → component re-renders from useSelector.
3. **User submits form** → action dispatched (e.g. loginUser, addArtist) → saga runs → API call → success: update Redux + optional redirect; error: dispatch error + show alert.
4. **Auth:** Login form → loginUser → saga → JWT/fake → localStorage.authUser + loginSuccess → navigate to /dashboard. Subsequent requests: api_helper reads token from localStorage and sends Bearer. 401 → logout and redirect to /login.

---

## 17. Complete File Index (src/)

Every file under `src/` with a one-line purpose. Use this to locate where a behavior lives.

### Root
- `index.js` — App entry: ReactDOM, Provider, BrowserRouter, App, i18n, store.
- `App.js` — Route groups (auth/user), layouts, fakeBackend.
- `App.test.js` — Basic App test.
- `i18n.js` — i18next init, locales (eng/gr/it/rs/sp).
- `serviceWorker.js` — CRA service worker (unregistered in index).
- `setupTests.js` — Jest setup.

### routes/
- `allRoutes.js` — Defines userRoutes and authRoutes (path + component).
- `middleware/Authmiddleware.js` — Auth guard: redirect to /login or render VerticalLayout.

### store/
- `index.js` — Create Redux store, run rootSaga.
- `reducers.js` — combineReducers of all slices.
- `actions.js` — Re-export all action creators.
- `sagas.js` — rootSaga: fork all feature sagas.
- `layout/*` — actions, actionTypes, reducer, saga (sidebar/theme).
- `auth/login/*` — Login/logout actions, types, reducer, saga.
- `auth/register/*` — Register actions, types, reducer, saga.
- `auth/forgetpwd/*` — Forgot password actions, types, reducer, saga.
- `auth/profile/*` — Profile actions, types, reducer, saga.
- `dashboard/*` — Dashboard counts actions, types, reducer, saga.
- `artist/*` — Artist CRUD actions, types, reducer, saga.
- `artist-lvl/*` — Artist level settings actions, types, reducer, saga.
- `client/*` — Client CRUD actions, types, reducer, saga.
- `booking/*` — Booking list/detail actions, types, reducer, saga.
- `calendar/*` — Calendar events actions, types, reducer, saga.
- `categories/*` — Services/categories actions, types, reducer, saga.
- `subServices/*` — Sub-services actions, types, reducer, saga.
- `notification/*` — Notifications actions, types, reducer, saga.
- `app-v/*` — App version actions, types, reducer, saga.
- `chat/*` — Chat list/messages actions, types, reducer, saga.
- `report/*` — Report actions, types, reducer, saga.
- `pages/*` — Static pages (terms, privacy) actions, types, reducer, saga.

### helpers/
- `api_helper.js` — Axios instance, REACT_APP_API_URL, Bearer token, 401 logout, get/post/put/del.
- `url_helper.js` — API path constants (login, artist, client, booking, etc.).
- `fakebackend_helper.js` — Wrappers for fake/mock auth (postJwtLogin, etc.).
- `AuthType/fakeBackend.js` — Mock adapter for fake auth endpoints.
- `firebase_helper.js` — Firebase auth backend (optional).
- `jwt-token-access/accessToken.js` — Dev token placeholder.
- `jwt-token-access/auth-token-header.js` — Auth header helper.
- `Module.jsx` — getMobileProfile, updateForgotPassword (API calls).

### constants/
- `layout.js` — layoutTypes, layoutWidth, sidebar/body/topbar theme enums.

### components/
- `NonAuthLayout.js` — Wrapper for login/forgot (no sidebar).
- `VerticalLayout/index.js` — Main layout: Header, Sidebar, main content, Footer, Rightbar.
- `VerticalLayout/Header.js` — Top bar, menu toggle, dropdowns.
- `VerticalLayout/Sidebar.js` — Left nav menu.
- `VerticalLayout/SidebarContent.js` — Sidebar menu items.
- `VerticalLayout/Footer.js` — Footer.
- `CommonForBoth/Rightbar.js` — Right sidebar panel.
- `CommonForBoth/TopbarDropdown/LanguageDropdown.js` — Language switcher.
- `CommonForBoth/TopbarDropdown/NotificationDropdown.js` — Notifications.
- `CommonForBoth/TopbarDropdown/ProfileMenu.js` — User menu.
- `Common/withRouter.js` — Router v6 props for class components.
- `Alert/Alert.jsx` — ErrorAlert and similar.
- `Loading/Loading.js` — Loading spinner.
- `Datatable/DataTable.jsx` — Reusable data table.

### pages/
- `Authentication/Login.js` — Login form, Formik, loginUser dispatch.
- `Authentication/Logout.js` — Logout and redirect.
- `Authentication/Register.js` — Register form.
- `Authentication/ForgetPassword.js` — Forgot password form.
- `Authentication/user-profile.js` — User profile page.
- `Dashboard/index.js` — Dashboard counts and charts, getDashboard.
- `Client/Client.js` — Client list; ClientAdd, ClientEdit — add/edit forms.
- `Artist/Artist.js` — Artist list; ArtistAdd, ArtistEdit — add/edit forms.
- `Booking/Booking.js` — Booking list; BookingView — detail.
- `TrainingBooking/TrainingBooking.jsx` — Training bookings.
- `Services/Services.js` — Services list; ServiceView, SubServices, SubServiceView.
- `Notification/Notification.js` — Notifications list.
- `Report/Report.js` — Report view.
- `Chat/Chat.js` — Chat UI.
- `Settings/ArtistLVL.js` — Artist level settings.
- `Settings/AppVersion.jsx` — App version settings.
- `Settings/PageTermsCondition.jsx` — Terms page.
- `Settings/PagePrivacyPolicy.jsx` — Privacy page.
- `AllCharts/apex/*` — ApexCharts demos (e.g. salesdonut used in Dashboard).
- `AllCharts/chartist/*`, `chartjs/*`, `echart/*`, `echart1/*`, `knob/*`, `sparkline/*` — Other chart demos.
- `Utility/*` — 404, 500, maintenance, pricing, profile, timeline, gallery, invoice, etc.

### common/
- `data/index.js` — Re-export mock data.
- `data/calender.js`, `contacts.js`, `crypto.js`, `ecommerce.js`, `invoices.js`, `projects.js`, `tasks.js` — Mock/static data.
- `languages.js` — Language list for UI.

### locales/
- `eng/translation.json`, `gr/translation.json`, `it/translation.json`, `rs/translation.json`, `sp/translation.json` — i18n strings.

### utility/
- `CommonConstant.js` — App-wide constants.

### assets/
- `scss/theme.scss` — Main global styles (imported in App.js).
- `scss/_variables.scss`, `_variables-dark.scss` — SCSS variables.
- `scss/custom/*`, `rtl/*` — Component and RTL styles.
- `images/*` — Logos, placeholders, flags, etc.
- `fonts/*` — Custom fonts (e.g. dripicons).

---

This document is the single place to understand **what each part of the codebase does and how it fits together**. For line-by-line behavior, use this plus the actual file (and follow imports and dispatch/useSelector).

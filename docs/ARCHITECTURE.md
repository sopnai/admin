# Architecture

This document describes the application architecture: entry point, routing, auth, Redux, and layout.

---

## Entry and bootstrap

1. **`index.js`** – Renders the app into `#root` with:
   - `Provider` (Redux store)
   - `BrowserRouter`
   - `App`

2. **`App.js`** – Renders two route groups:
   - **Auth routes** (e.g. `/login`, `/forgot-password`) inside `NonAuthLayout`
   - **User routes** (e.g. `/dashboard`, `/client`) inside `Authmiddleware` → `VerticalLayout`

3. **Fake backend** – `fakeBackend()` from `helpers/AuthType/fakeBackend.js` is called in `App.js`. It attaches a MockAdapter to the **default** axios instance. The app’s API client uses a **different** axios instance (in `api_helper.js`) with `baseURL: REACT_APP_API_URL`, so real HTTP calls go to your backend when that env is set.

---

## Routing

- **Definitions:** `src/routes/allRoutes.js` exports `userRoutes` and `authRoutes` (path + component).
- **Auth middleware:** `src/routes/middleware/Authmiddleware.js` checks `localStorage.getItem("authUser")`. If missing, it redirects to `/login`; otherwise it renders `VerticalLayout` with `props.children` (the matched route component).
- **Layout:** All protected routes use the same layout: `VerticalLayout` (sidebar + header + content area). Sidebar links are defined in `SidebarContent.js`.

---

## Authentication flow

1. User submits login form → `Login.js` dispatches `loginUser(values, navigate)`.
2. **Redux:** `auth/login/actions.js` → `LOGIN_USER` with `{ user, history }`.
3. **Saga:** `auth/login/saga.js`:
   - Reads `REACT_APP_DEFAULTAUTH` (`firebase` | `jwt` | `fake`).
   - Calls the corresponding login helper (e.g. `postFakeLogin` / `postJwtLogin` from `fakebackend_helper.js`). Those use `api_helper.post(url, data)`, so the request goes to `REACT_APP_API_URL + url` (e.g. `.../login`).
   - On success: stores result in `localStorage.authUser`, dispatches `loginSuccess`, then `history("/dashboard")`.
   - On error: dispatches `apiError` and shows an error alert.
4. **Subsequent requests:** `api_helper.js` reads `authUser.data.accessToken` and sends `Authorization: Bearer <token>` on every request. On 401, it clears storage and redirects to `/login`.

---

## Redux flow (per feature)

Each feature (dashboard, artist, client, booking, etc.) follows the same pattern:

1. **Actions** (`store/<feature>/actions.js`) – Action creators that return `{ type, payload }`.
2. **Action types** (`store/<feature>/actionTypes.js`) – Constants like `GET_DASHBOARD`, `LIST_DASHBOARD`.
3. **Reducer** (`store/<feature>/reducer.js`) – Updates state for that slice (e.g. `DashboardRD.dashboard`, `DashboardRD.isLoading`).
4. **Saga** (`store/<feature>/saga.js`) – Listens for actions (e.g. `takeEvery(GET_DASHBOARD, ...)`), calls API via `helpers/Module.jsx`, then dispatches success/error actions to update state.

Example (Dashboard):

- Page dispatches `getDashboard()` → `GET_DASHBOARD`.
- Saga calls `getDashboardData()` from Module → HTTP GET to `DASHBOARD_DATA` URL.
- Saga dispatches `listDashboard(response)` and `setLoadingDashboard(false)`.
- Reducer updates `state.DashboardRD.dashboard` and `isLoading`.
- Page reads from `useSelector(state => state.DashboardRD)` and renders.

---

## Layout and UI

- **Layout constants:** `src/constants/layout.js` (layoutTypes, topbarTheme, leftSideBarType, etc.). The app uses `VerticalLayout` only.
- **VerticalLayout** – Composed of:
  - **Header** – Logo, search, notifications, profile dropdown.
  - **Sidebar** – `SidebarContent.js` with MetisMenu; active item derived from current path.
  - **Main content** – `props.children` (the route component).
- **Theme:** Bootstrap 5 + custom SCSS in `src/assets/scss/theme.scss` and related files.

---

## Helpers and API

- **`url_helper.js`** – Central list of API path constants (e.g. `ADMIN_LOGIN`, `DASHBOARD_DATA`, `ARTIST_GET`). No base URL.
- **`api_helper.js`** – Creates axios instance with `baseURL: process.env.REACT_APP_API_URL`, adds request interceptor for Bearer token and response interceptor for 401 logout. Exports `get`, `post`, `put`, `del`.
- **`Module.jsx`** – Exports functions that call `api_helper` with `url_helper` constants (e.g. `getDashboardData`, `postLogin`, `getArtistList`). Used by sagas and occasionally by components.
- **`fakebackend_helper.js`** – Exports `postFakeLogin`, `postJwtLogin`, etc., which call `post(url.POST_FAKE_LOGIN, data)` or similar. So they still go through `api_helper` and thus to `REACT_APP_API_URL` when set.

---

## i18n

- **Setup:** `src/i18n.js` uses `i18next` and `react-i18next`; language stored in `localStorage.I18N_LANGUAGE`.
- **Translations:** `src/locales/{eng,gr,it,rs,sp}/translation.json`.
- **Usage:** Components use `withTranslation()` or `useTranslation()`; sidebar uses `props.t("Dashboard")`, etc.

---

## File naming and conventions

- Pages under `src/pages/<Feature>/` (e.g. `Dashboard/index.js`, `Client/Client.js`, `Booking/BookingView/BookingView.js`).
- Store: one folder per slice (`auth/login`, `dashboard`, `artist`, …) with `actions`, `actionTypes`, `reducer`, `saga`.
- Shared UI: `src/components/` (Alert, VerticalLayout, CommonForBoth dropdowns).
- No central dependency-injection or feature flags beyond `REACT_APP_*` env and `REACT_APP_DEFAULTAUTH`.

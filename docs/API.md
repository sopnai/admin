# API Reference

The app expects a backend API whose base URL is set in `REACT_APP_API_URL`. All paths below are relative to that base (e.g. `https://api.example.com/admin`).

Authentication: the client sends `Authorization: Bearer <accessToken>`. Token is taken from the login response stored in `localStorage.authUser.data.accessToken`. 401 responses trigger logout and redirect to `/login`.

---

## Auth

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| POST | `/login` | `postLogin` | Admin login. Body: `{ email, password }`. Response should include token (e.g. under `data.accessToken`). |
| GET  | `/profile` | `getProfile` | Get current admin profile (query params as needed). |

Profile / password (used by profile and forgot-password flows):

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| PUT  | `/updateprofile/:id` | `updateUserProfile` | Update admin profile. |
| POST | `/updatePassword` | `updateUserPassword` | Change password. Body typically includes current/new password. |
| POST | `/get/profile-by-mobile` | `getMobileProfile` | Profile by mobile (e.g. forgot password). |
| POST | `/update/forgot-password` | `updateForgotPassword` | Forgot password update. |

---

## Dashboard

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET | `/dashboardCount` | `getDashboardData` | Dashboard counts (e.g. totalUserCount, totalArtistCount, totalBookingCount, totalServiceCount, bookingCountsByStatus). |

---

## Artist

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET    | `/artist` | `getArtistList` | List artists (query params). |
| GET    | `/artistsbyid/:id` | `getSingleArtist` | Single artist. |
| POST   | `/addartist` | `addArtist` | Create artist (multipart/form-data). |
| PUT    | `/updateartist/:id` | `updateArtist` | Update artist (multipart/form-data). |
| DELETE | `/deleteartist/:id` | `deleteArtist` | Delete artist. |
| POST   | `/artistapproved` | `approveArtist` | Approve artist (body/params as needed). |
| POST   | `/addartistimage` | `addArtistImg` | Add artist image (multipart/form-data). |
| DELETE | `/deleteartistimage/:id` | `deleteArtistImg` | Delete artist image. |

---

## Client (User)

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET    | `/user` | `getClientList` | List users/clients. |
| GET    | `/userbyid/:id` | `getSingleClient` | Single client. |
| POST   | `/adduser` | `addClient` | Create client (multipart/form-data). |
| PUT    | `/updateuser/:id` | `updateClient` | Update client (multipart/form-data). |
| DELETE | `/deleteuser/:id` | `deleteClient` | Delete client. |

---

## Booking

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET  | `/booking` | `getBookingList` | List bookings. |
| GET  | `/bookingbyid/:id` | `getSingleBooking` | Single booking. |
| POST | `/updatebookginstatus` | `statusBooking` | Update booking status. |

Training booking:

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET  | `/get/trainigbooking` | `getTainingBookingList` | List training bookings. |
| POST | `/update/trainigbooking` | `updateTainingBookingList` | Update training booking. |

---

## Report

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET  | `/bookingitem/get` | `getReportList` | Report/booking items. |
| GET  | `/bookingbyid/:id` | `getSingleReport` | Single report/booking. |
| POST | `/artists/payment` | `statusReport` | Update report/payment status. |
| GET  | `/get/total-booking-fee` | `controllGetTotalBookingFeee` | Total booking fee. |

---

## Notification

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET  | `/getnotification` | `getNotificationList` | List notifications. |
| POST | `/createNotification` | `addNotification` | Create notification. |

---

## Categories (Services)

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET    | `/service` | `getCatList` | List service categories. |
| POST   | `/addOrUpdateservice` | `addUpdCat` | Create or update category (multipart/form-data). |
| DELETE | `/deleteservice/:id` | `deleteCat` | Delete category. |

---

## Sub-services

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET    | `/subservice/:servId` | `getSubsList` | List sub-services for a service (servId in path or params). |
| POST   | `/addOrUpdateSubService` | `addUpdSubs` | Create or update sub-service (multipart/form-data). |
| DELETE | `/deletesubservice/:id` | `deleteSubs` | Delete sub-service. |

---

## Settings

Artist level:

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET  | `/artistlevel` | `getArtistLvlList` | List artist levels. |
| POST | `/updateartistlevel` | `updateArtistLvl` | Update artist level. |

App version:

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET  | `/appversion` | `getAppVList` | List app versions. |
| POST | `/updateappversion/1` | `updateAppV` | Update app version (id fixed in path). |

---

## Chat

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET | `/chatlist` | `getChatList` | Chat list. |
| GET | `/chatMessage` | `getChatH` | Chat messages (params as needed). |

---

## Pages (CMS-style)

| Method | Path | Helper | Description |
|--------|------|--------|-------------|
| GET  | `/pages/get` | `getPages` | Get page content. |
| POST | `/pages/update` | `updatePages` | Update page content (e.g. Terms, Privacy). |

---

## URL constants

All paths are defined in `src/helpers/url_helper.js`. The table above matches those constants to the helpers in `src/helpers/Module.jsx`. Request/response body shapes depend on your backend; the app sends FormData for most create/update endpoints that use `multipart/form-data`.

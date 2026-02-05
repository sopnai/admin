# Deployment

## Environment

1. Set **`REACT_APP_API_URL`** to your backend base URL (e.g. `https://api.example.com/admin`). No trailing slash.
2. Optionally set **`REACT_APP_DEFAULTAUTH`** to `fake`, `jwt`, or `firebase` (see README).

Create `.env.production` for production builds:

```env
REACT_APP_API_URL=https://your-api.example.com/admin
REACT_APP_DEFAULTAUTH=jwt
```

Build:

```bash
DISABLE_ESLINT_PLUGIN=true yarn build
```

> **Note:** The `DISABLE_ESLINT_PLUGIN=true` flag is required because the codebase has ESLint warnings that are treated as errors during production builds. Without this flag, the build will fail.

The `build/` folder contains static assets. Serve `index.html` for all non-file routes (SPA).

To preview the build locally:

```bash
npx serve -s build -l 3000
```

Then open http://localhost:3000 in your browser.

---

## Admin Account Setup

Admin accounts are **not** created through the frontend. There is no public registration page. Accounts must be created via backend scripts.

### Creating an Admin Account

Run one of the following scripts from the backend directory (`Totally_flawless_backend/`):

```bash
# Option 1: Using UUID for admin ID
node scripts/createAdminAccount.js

# Option 2: Using auto-increment ID
node scripts/insertAdminAccount.js
```

### Default Credentials

The scripts create an admin with these default credentials (can be overridden via environment variables):

| Field    | Default Value         | Env Variable     |
|----------|-----------------------|------------------|
| Email    | `admin@flawless.com`  | `ADMIN_EMAIL`    |
| Password | `admin123`            | `ADMIN_PASSWORD` |
| Name     | `Admin User`          | `ADMIN_NAME`     |
| Mobile   | `1234567890`          | `ADMIN_MOBILE`   |

### Custom Admin Account

To create an admin with custom credentials:

```bash
ADMIN_EMAIL=myemail@example.com ADMIN_PASSWORD=mysecurepassword node scripts/createAdminAccount.js
```

### Login Endpoint

The admin panel authenticates against: `POST {REACT_APP_API_URL}/auth/login`

Request body:
```json
{
  "email": "admin@flawless.com",
  "password": "admin123"
}
```

---

## Docker (current Dockerfile)

The provided Dockerfile assumes the app is **already built** on the host. It does not run `yarn build` inside the image.

1. Build the app locally:

   ```bash
   yarn install
   yarn build
   ```

2. Build the image from the **project root** (parent of `dockerizer/` and `build/`):

   ```bash
   docker build -f dockerizer/Dockerfile -t flawless-admin .
   ```

   Context must include the `build/` directory so `COPY ./build` works.

3. Run:

   ```bash
   docker run -p 80:80 flawless-admin
   ```

The container serves the app on port 80 via nginx. Nginx is configured to use `try_files $uri /index.html` so client-side routing works.

---

## Docker with build inside image (optional)

To build the app inside Docker (e.g. for CI or when you don’t want to run Node on the host), use a multi-stage Dockerfile that:

1. Uses a Node image, copies `package.json` and `yarn.lock`, runs `yarn install --frozen-lockfile`, copies `src/`, `public/`, etc., then runs `yarn build`.
2. Uses an nginx image and copies `build/` from the first stage and `dockerizer/nginx.conf`.

Example (adjust paths if your Dockerfile lives in `dockerizer/`):

```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ARG REACT_APP_API_URL
ARG REACT_APP_DEFAULTAUTH
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_DEFAULTAUTH=$REACT_APP_DEFAULTAUTH
RUN yarn build

FROM nginx:stable
COPY --from=build /app/build /usr/share/nginx/html
COPY dockerizer/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build with env for the React app:

```bash
docker build -f dockerizer/Dockerfile -t flawless-admin \
  --build-arg REACT_APP_API_URL=https://api.example.com/admin \
  --build-arg REACT_APP_DEFAULTAUTH=jwt .
```

---

## Nginx (non-Docker)

Example server block:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/flawless-admin/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: proxy API to avoid CORS
    # location /admin/ {
    #     proxy_pass https://your-api.example.com/admin/;
    # }
}
```

---

## Checklist

- [ ] `REACT_APP_API_URL` points to the correct backend.
- [ ] Backend allows CORS from the admin origin (or use a reverse proxy).
- [ ] Built with `yarn build` (or equivalent) and the resulting `build/` is what you deploy.
- [ ] Server returns `index.html` for SPA routes (e.g. `/dashboard`, `/client`).
- [ ] HTTPS and security headers are configured in production (nginx or load balancer).

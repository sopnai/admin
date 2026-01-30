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
yarn build
```

The `build/` folder contains static assets. Serve `index.html` for all non-file routes (SPA).

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

FROM node:20 as build
WORKDIR /app

# production stage
FROM nginx:stable as production
COPY ./build /usr/share/nginx/html
COPY ./dockerizer/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
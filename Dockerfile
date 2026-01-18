# Build Expo web app and serve with Nginx
FROM node:24 AS builder
WORKDIR /app
COPY . .
RUN npm install  && npx expo export

# Stage 2: Nginx static server
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

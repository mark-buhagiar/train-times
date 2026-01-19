# Build Expo web app and serve with Nginx
FROM node:24 AS builder
WORKDIR /app

# Define build arguments
ARG EXPO_PUBLIC_TRANSPORT_API_APP_ID
ARG EXPO_PUBLIC_TRANSPORT_API_APP_KEY
ARG EXPO_PUBLIC_USE_MOCK_API

# Set as environment variables for the build
ENV EXPO_PUBLIC_TRANSPORT_API_APP_ID=$EXPO_PUBLIC_TRANSPORT_API_APP_ID
ENV EXPO_PUBLIC_TRANSPORT_API_APP_KEY=$EXPO_PUBLIC_TRANSPORT_API_APP_KEY
ENV EXPO_PUBLIC_USE_MOCK_API=$EXPO_PUBLIC_USE_MOCK_API

COPY . .
RUN npm install && npx expo export

# Stage 2: Nginx static server
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config to conf.d
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
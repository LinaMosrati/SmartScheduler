ARG NODE_VERSION=20.15.0
FROM node:${NODE_VERSION}-alpine AS build
# Create app directory
WORKDIR /app

# Install necessary dependencies for native builds
RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base \
    gcc \
    g++ \
    make

COPY package.json ./
RUN npm install
RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points
COPY . .
RUN npm run build

FROM nginx:stable
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
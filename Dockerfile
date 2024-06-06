# Stage 1: Build the static files
FROM node:20-slim AS build-stage

# Set up pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack
RUN corepack enable

# Copy the application files
COPY . /app

# Set working directory
WORKDIR /app

# Install dependencies and build the app
RUN pnpm install --frozen-lockfile
RUN pnpm run build:web

# Stage 2: Serve the static files using Nginx
FROM nginx:alpine AS production-stage

# Copy the build output to the Nginx HTML directory
COPY --from=build-stage /app/apps/web/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

# Healthcheck to ensure the service is running
HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
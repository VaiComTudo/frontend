# Stage 1: Build the React application
# Use a Node image to compile the assets
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code and run the build command
COPY . .
# This command generates the static files into the 'dist' directory (Vite default)
RUN npm run build 

# Stage 2: Serve the application with Nginx
# Use a tiny Nginx image for serving static files
FROM nginx:alpine
# Copy the built files from the build stage to Nginx's default HTML directory
# This directory contains your production React application
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# Nginx is the entrypoint and will start serving the files

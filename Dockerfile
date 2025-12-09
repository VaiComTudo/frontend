# Stage 1: Build the React application
# Use a Node image to compile the assets
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code and run the build command
COPY . .
# This command generates the static files into the 'dist' directory (Vite default)
RUN npm run build 

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

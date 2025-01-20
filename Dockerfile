# Stage 1: Build Angular App
FROM node:18 as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the application source code
COPY . .

# Build the Angular application in production mode
RUN ng build --configuration=production

# Stage 2: Serve Angular App with NGINX
FROM nginx:latest

# Remove default NGINX configuration
RUN rm -v /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Angular app files from the builder stage
COPY --from=builder /usr/src/app/dist/airlines-app/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

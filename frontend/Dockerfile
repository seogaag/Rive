# Base image
FROM node:14 AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json /app/package.json
RUN npm install

# Copy the rest of the application
COPY . /app

# Build the React application
RUN npm run build

# Stage 2 - the production environment
FROM nginx:latest

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration if needed
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# KST로 시간 변경
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

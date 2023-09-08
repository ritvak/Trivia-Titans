# Stage 1: Build the React app
FROM node:14 as build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve the React app using nginx
FROM nginx:1.21
COPY --from=build-stage /app/build /usr/share/nginx/html
<<<<<<< HEAD
EXPOSE 80
=======
EXPOSE 8080
>>>>>>> origin/InGameExperience
CMD ["nginx", "-g", "daemon off;"]
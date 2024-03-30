# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the server directory
COPY server/package*.json ./

# Install project dependencies
RUN npm install

# Copy the server directory contents to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "server/server.js" ]

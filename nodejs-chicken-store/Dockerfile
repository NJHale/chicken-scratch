# From the official node base image
FROM docker.io/node:latest

# Switch to privileged user
USER root

# Create working directory
WORKDIR /app

# Copy nodejs source code
COPY routes routes
COPY schemas schemas
COPY config.js config.js
COPY server.js server.js

# Copy package.json and install app dependencies
COPY package.json package.json
RUN npm install

# Expose the app port
EXPOSE 8080

# Switch to unprivileged user
USER 1001

# Define the nodejs app as the container's entrypoint (process 1)
ENTRYPOINT ["npm", "start"]

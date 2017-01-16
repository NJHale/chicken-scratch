FROM docker.io/golang:latest

# Create a working directory
WORKDIR  /app
# Copy source code into the app directory
COPY
# Get dependencies and build source code
RUN go get && go build

# Elevate and change permissions on the compiled go binary
USER root
# Give read and execute to all
RUN chmod 555 go-scratch-store
# Switch to un-privileged user
USER 1001

# Expose listening port
EXPOSE 8080

# Run the go app as process 1
ENTRYPOINT ["sh", "go-chicken-scratch"]

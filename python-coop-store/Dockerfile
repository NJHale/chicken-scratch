# From the official python base image
FROM docker.io/python:latest

# Switch to privileged user
USER root

# Create working directory
WORKDIR /app

# TODO: Only copy required stuff
# Copy everything
COPY . .

# Install python dependencies
RUN chmod 777 /app && pip install -r requirements.txt 

# Expose the app port
EXPOSE 8080

# Switch to unprivileged user
USER 1001

# Define the python app as the container's entrypoint (process 1)
ENTRYPOINT ["python", "coop_routes.py"]

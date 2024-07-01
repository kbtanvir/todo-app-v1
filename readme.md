README.md
markdown
Copy code
# Todo App

This is a simple Todo application built with React (client) and Flask (server) using Docker Compose.

## Installation

### Prerequisites

Make sure you have the following installed:
- Docker
- Docker Compose

### Clone the Repository

```bash
git clone <repository_url>
cd <repository_directory>
Directory Structure
Ensure your directory structure looks like this:

scss
Copy code
todo-app/
├── client/
│   ├── Dockerfile
│   └── (other client app files)
├── server/
│   ├── Dockerfile
│   └── (other server app files)
└── docker-compose.yml
Docker Compose Configuration
Create a docker-compose.yml file in the root directory (todo-app/) with the following content:

yaml
Copy code
version: "3.8"

services:
  client:
    container_name: todo-app-client
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - server

  server:
    container_name: todo-app-server
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
Building and Running the Application
Build and Run Docker Compose:

From the root directory (todo-app/), run the following command to build and start the services defined in docker-compose.yml:

bash
Copy code
docker-compose up --build
This command will build the Docker images for the client and server apps defined in their respective Dockerfiles and start containers for both services.

Accessing the Applications:

Client App: Access the React client app in your browser at http://localhost:3000.

Server App: The Flask server app with SQLAlchemy will be accessible at http://localhost:5000.

Swagger Documentation:

Swagger UI: After starting the server, you can access the Swagger UI to view the API documentation at http://localhost:5000/apidocs.

Stopping the Application
To stop the Docker containers running the applications, press Ctrl + C in the terminal where docker-compose up is running. This will stop the containers gracefully.
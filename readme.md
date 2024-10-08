## Preview 

![image](https://github.com/kbtanvir/todo-app-v1/assets/52887114/841c0118-0532-439f-9118-bb47dddc4769)


## Installation

### Prerequisites

Make sure you have the following installed:

- Docker
- Docker Compose

### Clone the Repository

```bash
git clone https://github.com/kbtanvir/todo-app-v1.git
cd todo-app-v1
```

### Directory Structure

Ensure your directory structure looks like this:

```
todo-app/
├── client/
│   ├── Dockerfile
│   ├── src
         └── App.tsx
│   ├── features/todo
         └── model.ts
         └── provider.ts
         └── repo.ts
├── server/
│   ├── Dockerfile
│   ├── api
         └── index.py
└── compose.yml
```

### Building and Running the Application

1. **Build and Run Docker Compose:**

   From the root directory (`todo-app/`), run the following command to build and start the services defined in `docker-compose.yml`:

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images for the client and server apps defined in their respective `Dockerfile`s and start containers for both services.

2. **Accessing the Applications in local machine:**

   - **Client App:** Access the React client app in your browser at [http://localhost:3000](http://localhost:3000).

   - **Server App:** The Flask server app with SQLAlchemy will be accessible at [http://localhost:5000](http://localhost:5000).

3. **Swagger Documentation:**

   - **Swagger UI:** After starting the server, you can access the Swagger UI to view the API documentation at [http://localhost:5000/apidocs](http://localhost:5000/apidocs).

4. **Live urls:**

   - **Client App:**
    [live url](https://todo-app-client-coral.vercel.app/)

   - **API Docs:**
    [here](https://todo-app-server-kappa.vercel.app/apidocs)

### Stopping the Application

To stop the Docker containers running the applications, press `Ctrl + C` in the terminal where `docker-compose up` is running. This will stop the containers gracefully.

### Tech Stack

Backend:
 - Python
 - Flask
 - SQLAlchemy
 - Postgress - Live
 - Sqlite - Local
 - NGINX

Frontend:
 - TypeScript
 - React with Vite
 - Tailwind CSS
 - [Polystate](https://poly-state.github.io/) - State manager
 - [Zod](https://zod.dev/) - Validation
 - Docker
 - Docker Compose




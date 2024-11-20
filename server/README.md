# Project Setup and Instructions

This README file provides instructions on how to set up and start a project using Prisma with Docker, along with detailed information on scripts and common commands.

## Prerequisites

Ensure you have the following tools installed on your machine:

- Docker
- Node.js
- npm
- PostgreSQL

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <repository-url>
cd <repository-directory>
```

### 2. Install all Dependencies

Install the required npm packages:

```sh
npm install
```

### 3. Set Up Prisma

Generate Prisma client:

```sh
npx prisma generate
```

### 4. Apply Migrations

Apply the initial database migration:

```sh
npx prisma migrate dev --name init
```

### 5. Pull Database Schema

(Optional) Pull the existing database schema:

```sh
npx prisma db pull
```

<br/>
<p style="color: green; font: bold;"><strong>If prefere using Docker container to generate a Postgres Database follow the setp 6.
Otherwise if you prefere to use your own databse from your machine just skip the step 6.</strong></p>

### 6. Docker Commands

To interact with Docker containers:

- Access the container's shell:

  ```sh
  docker exec -it <container-name-or-id> <shell-executable>
  # Example
  docker exec -it e686a1fe8b86 /bin/bash
  ```

- Access PostgreSQL inside the container:

  ```sh
  psql -h localhost -p 5432 -U postgres -d booking_db
  ```

- docker: Start Docker containers.
  ```sh
  npm run docker:start
  ```
- docker: Stop Docker containers.
  ```sh
  npm run docker:stop
  ```
- docker: Reset Docker environment (remove containers, images, volumes, and orphans).
  ```sh
  npm run docker:reset
  ```
    <p style="color: red;"> Be careful because this command will delete all your data</p>

### 7. NPM Scripts

The project includes several npm scripts to facilitate development:

- dev: Start the development server with hot-reloading.

  ```sh
  npm run dev
  ```

- build: Compile TypeScript to JavaScript.

  ```sh
  npm run build
  ```

- start: Start the compiled application.

  ```sh
  npm run start
  ```

- test: Run tests using Jest.

  ```sh
  npm run test
  ```

By following these instructions, you should be able to set up and run your project smoothly.

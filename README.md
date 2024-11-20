<!-- ## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. - -->

# Airvilla Charter

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Ticket Status and Workflow](#ticket-status-and-workflow)
- [Contributing](#contributing)
- [DigitalOcean Deployment Doc](#digitalocean-deployment-doc)
  - [Frontend Deployment](#frontend-deployment)
  - [Backend Deployment](#backend-deployment)
  - [Database Management](#database-management)

## Introduction

The Travel Ticketing Management System is a comprehensive application designed to streamline the process of creating, managing, and selling flight tickets. It caters to three main user roles: Master, Agency, and Affiliate, each with specific functionalities and permissions.

## Features

- **User Roles**:

  - **Master**: Manages user accounts and approves tickets
  - **Agency**: Creates and manages flight tickets
  - **Affiliate**: Purchases tickets for resale to customers

- **Ticket Management**: Create, edit, and delete flight tickets
- **User Management**: User registration, authentication, and authorization
- **Approval System**: Master can approve new users and tickets

## System Architecture

The application follows a client-server architecture:

- **Frontend**: Next.js application with TypeScript and Redux for state management
- **Backend**: Express.js server with Prisma ORM for database operations
- **Database**: PostgreSQL for data storage

## Technologies Used

### Frontend

- Next.js: React framework for server-side rendering and static site generation
- TypeScript: Typed superset of JavaScript for improved developer experience
- Redux: State management library for predictable state updates
- Tailwind CSS: Utility-first CSS framework for rapid UI development

### Backend

- Express.js: Web application framework for Node.js
- Prisma: Next-generation ORM for Node.js and TypeScript
- PostgreSQL: Open-source relational database

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/travel-ticketing-system.git
   cd travel-ticketing-system
   ```

2. Install dependencies for both frontend and backend:

   ```
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the `backend` directory
   - Add the following variables:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/travel_ticketing_db"
     JWT_SECRET="your-secret-key"
     ```

4. Set up the database:

   ```
   cd backend
   npx prisma migrate dev
   ```

5. Start the development servers:

   ```
   # In the backend directory
   npm run dev

   # In the frontend directory
   npm run dev
   ```

## Usage

1. Access the application at `http://localhost:3000`
2. Register as a new user (agency or affiliate)
3. Wait for master approval
4. Log in and start using the system based on your role

<!--- ## API Documentation

### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Log in --->

</br>

# Ticket Status and Workflow

## Main Ticket Statuses

- **Pending**
- **Available**
- **Unavailable**
- **Rejected**
- **Blocked**
- **Expired**

## Ticket Workflow

1. **Ticket Creation**

   - When a ticket is created, its status is set to `Pending` by default.
   - The ticket remains in the `Pending` state until the master user takes action (`Accept`, `Reject`, or `Block` the ticket).

2. **Accepted Tickets**

   - Once a ticket is `Accepted`, its status can be changed between `Available` and `Unavailable` without master user approval.
   - The user can update only the `seats` and `price`. These changes require master user approval to take effect.
   - Note: The ticket remains publicly available in its current state until the new changes are approved.
   - When the flight date has passed, the ticket status changes to `Expired`.
   - The user cannot hard delete the ticket once it has been a valid ticket.

3. **Rejected Tickets**

   - When a ticket is `Rejected`, the user can update the ticket.
   - Upon updating, the ticket status changes to `Pending` and waits for master user approval again.
   - When the flight date has passed, the ticket status changes to `Blocked`.
   - The user can hard delete the ticket.

4. **Blocked Tickets**
   - When a ticket is `Blocked`, its status is permanently `Blocked`.
   - If the ticket is `Blocked` and the flight date has passed, it will be hard deleted after one year from the ticket creation date.
   - The user can hard delete the ticket.

## Additional Rules

- **Expired Tickets:**

  - When the flight date of an `Accepted` ticket has passed, the ticket status automatically changes to `Expired`.

- **Hard Deletion:**
  - A `Rejected` or `Blocked` ticket can be hard deleted by the user.
  - `Accepted` tickets cannot be hard deleted after they become valid tickets.
  - `Blocked` tickets are automatically hard deleted after one year if the flight date has passed.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<br/><br/><br/>

# DigitalOcean Deployment Doc

- App Platform for backend development
- Droplet for next.js app
- database management for deploy postgresql database

## Table of Contents

- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Database Management](#database-management)

## Frontend Deployment

Our Next.js application is deployed on a DigitalOcean Droplet.

NOTE: The droplet has to be accessed from your or another machine using terminal.

### Steps to create a new droplet:

1. Create a new Droplet:

   - Choose an appropriate plan and region.
   - Select the latest LTS version of Ubuntu.
   - Add your SSH key for secure access.

2. SSH into your Droplet:

   ```
   ssh root@your_droplet_ip
   ```

3. Update the system and install necessary packages:

   ```
   sudo apt update && sudo apt upgrade -y
   sudo apt install nodejs npm -y
   ```

4. Install PM2 for process management:

   ```
   sudo npm install -g pm2
   ```

5. Clone your Next.js repository:
   ```
   git clone your_repo_url
   cd your_repo_directory
   ```
6. Start the Next.js app with PM2:
   ```
   pm2 start npm --name "next-app" -- start
   ```

### Steps manage existing droplet `ubuntu-airvilla-server-1`:

1. Access the droplet:

   ```
   ssh root@your_droplet_ip
   ```

2. Navigate to the repo that was cloned:
   ```
   cd /var/www/airvilla-charter-app/client
   ```
   the server side was deleted here to save the rooms for the client side.
3. In case need to pull the latest update:
   - inside the client run `git pull`
   - `yarn && yarn build` to install all packages and build the app
   - `pm2 restart next-app` to restart the app.

<br/>

### environment variables

```
SERVER_URL=http://localhost:3000
```

### Nginx configuration

The Nginx already was configured.

#### Steps to access and restart the Nginx server:

Install nginx

```
sudo apt install nginx
```

Nginx location:

```
/etc/nginx/
```

there is only 2 folders that can be accessed and restarted

`sites-available`: to create a new server

`sites-enabled`: enables that new server

- inside sites-available directory now contains `airvilla-charter-client` & `default` files but now the one is running on the domain is `airvilla-charter-client`.

  ```
  server_name airvilla-charters.travel www.airvilla-charters.travel;
  location / {
     proxy_pass http://localhost:3000;
     proxy_http_version 1.1;
     proxy_set_header Upgrade $http_upgrade;
     proxy_set_header Connection 'upgrade';
     proxy_set_header Host $host;
     proxy_cache_bypass $http_upgrade;
  }
  ```

  as you can see it will work when run the app on port 3000 and accessible for the domains. means when running `http://localhost:3000` inside the server, it will redirect to the main domain.

- To enable the nginx configuration, run the following command:

  Note: only run this when creating a new nginx instance.

  ```
  sudo ln -s /etc/nginx/sites-available/airvilla-charter-client /etc/nginx/sites-enabled/
  ```

Managing Nginx:

- To test Nginx: `sudo nginx -t`
- To start Nginx: `sudo systemctl start nginx`
- To stop Nginx: `sudo systemctl stop nginx`
- To restart Nginx: `sudo systemctl restart nginx`
- To reload Nginx configuration: `sudo systemctl reload nginx`

### SSL certificate

The domain had got a SSL certificate using `certbot`. In case was expired only run this command:

```
sudo certbot renew --dry-run
```

<span style="color:red"><strong>In case the SSL certificate was deleted:</strong></span>

1. Install Certbot:
   ```
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```
2. Obtain SSL Certificate:

   ```
   sudo certbot --nginx -d example.com -d www.example.com
   ```

   follow the steps that this command gonna provide you....

3. Verify SSL Configuration:
   check the `/etc/nginx/sites-available/airvilla-charter-client` that already exist in the server configuration.
   ```
   sudo nano /etc/nginx/sites-available/airvilla-charter-client
   ```
4. reload nginx:

   ```
   sudo systemctl reload nginx
   ```

## Backend Deployment

DigitalOcean's App Platform is used for deploying our backend application (Web Service). Here is automatically deployed you just need to provide a github repo to deploy your application.

### Steps

- Log in to your DigitalOcean account.
- Navigate to the App Platform section.
- Click "Create App" and select your GitHub repository.
- Choose the branch you want to deploy.
- Select the appropriate buildpack or specify a Dockerfile.
- Configure environment variables if necessary.
- Set up health checks and automatic deployments.
- Review and launch the app.

### Commands

If you already deployed the app and need to change the start and build commands **navigate to the server you want to edit -> settings -> Components: choose one the components -> Commands:**

### Build Command

run the command `yarn build:digitalocean` which contains:

```
yarn build:digitalocean

Or

yarn install --production=false && yarn build

Or

npm run install --production=false && npm run build

```

you can find the scripts in `server/package.json`

### Run Command

After building the app the program runs this command `yarn start` which contains:

```
yarn start

Or

npm run start

Or

node dist/app.js
```

### Environment variables

```
# The environment has to be specified as in this case production

NODE_ENV=production

## Database URL has to contains DB_SSL_CERT in order for the app to access the database

DATABASE_URL=
DB_SSL_CERT=

# The secret key for the token
SECRET_KEY=

# email

EMAIL_USER=
EMAIL_MAIN=
EMAIL_PASS=


SERVER_DOMAIN=URL
CLIENT_DOMAINS=URL1,URL2,...

GOOGLE_SHEET_URL
```

**DB_SSL_CERT will be explained in the [Database Management](#database-management) Section**

## Database Management

### Access database from your terminal

You simply access the database using this command:

```
psql -U <username> -h <host> -p <port> -d <database-name> --set=sslmode=require
```

In order to access the database `--set=sslmode=require` has to be added or it won't work. But this is not the only step.

Steps:

- Before you do this step navigate to `Databases` section in digital ocean and enter the database your want to access.
- Navigate to `Settings`
- You will find a section called `Trusted sources`, add you `Public IPv4` in order to access the database using your machine.

### Connect Database to the app server

- Add the database url to `DATABASE_URL` in the environment variable of server app.

  ```
  postgresql://<username>:<password>@<host>:<port>/<database-name>?sslmode=require
  ```

  `sslmode=require` has to be add + `sslrootcert=`

- `sslrootcert` is an SSL certificate for the database, the value is a long sequence of bytes and it can only be the file name of the certificate
- `DB_SSL_CERT` in environment variable is the SSL certificate content. It handle form backend by creating a file calls `temp_root.crt` and include the certificate that comes from `DB_SSL_CERT`. The result will be `sslrootcert=temp_root.crt` included at the end of the `DATABASE_URL` only this work when the `NODE_ENV` is in production mode.

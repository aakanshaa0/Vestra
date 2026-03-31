# Vestra

A full-stack e-commerce app with a customer storefront, admin dashboard, and REST API.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Admin: React, Vite
- Backend: Node.js, Express, MongoDB, Cloudinary, Stripe
- Docker, Docker Compose

## Project Structure

```
Vestra/
├── frontend/      # Customer storefront (port 5173)
├── admin/         # Admin dashboard (port 5174)
├── backend/       # REST API (port 3000)
└── docker-compose.yml
```

## Run with Docker

Requires [Docker](https://www.docker.com/) to be installed.

```bash
git clone https://github.com/aakanshaa0/Vestra.git
cd Vestra

cp backend/.env.example backend/.env
# fill in your values in backend/.env

docker-compose up --build
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:5173 |
| Admin    | http://localhost:5174 |
| Backend  | http://localhost:3000 |

## Run Locally

```bash
cd backend && npm install && npm start
cd frontend && npm install && npm run dev
cd admin && npm install && npm run dev
```

## Environment Variables

See `backend/.env.example` for the required variables.

## Live Demo

- Frontend: https://vestraa.vercel.app
- Admin: https://vestraa-adminpanel.vercel.app

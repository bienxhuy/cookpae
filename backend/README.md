# Backend - Cookpac

Node.js backend with Express, TypeScript, and TypeORM.

## Tech Stack

- Node.js + Express 5
- TypeScript 5
- TypeORM + PostgreSQL 16
- Docker

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=cookpac_db
CLOUDINARY_URL=your_url
```

3. Start database:
```bash
npm run db:up
```

4. Run migrations:
```bash
npm run migration:run
```

5. Start development server:
```bash
npm run dev
```

Server runs at `http://localhost:3000`

## Project Structure

```
src/
├── controllers/     # Request handlers
├── entities/        # Database models
├── middlewares/     # Express middlewares
├── migrations/      # Database migrations
├── repositories/    # Data access layer
├── routes/          # API routes
├── services/        # Business logic
├── app.ts          # Express setup
├── data-source.ts  # TypeORM config
└── server.ts       # Entry point
```

## Available Scripts

```bash
npm run dev              # Start dev server with hot-reload
npm run build            # Build for production
npm start                # Run production server
npm run db:up            # Start PostgreSQL container
npm run db:down          # Stop database
npm run db:reset         # Reset database (removes data)
npm run migration:run    # Run migrations
npm run migration:revert # Revert last migration
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/users/:id` - Get user
- `DELETE /api/users/:id` - Delete user

## Architecture

Layered architecture pattern:
- **Routes** → **Controllers** → **Services** → **Repositories** → **Database**

## Database

PostgreSQL runs in Docker container. Default credentials:
- Host: localhost:5432
- Database: cookpac_db
- User/Pass: postgres/postgres

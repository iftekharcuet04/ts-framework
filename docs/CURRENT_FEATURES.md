# Current Features

This is a work-in-progress backend framework. The following features are currently implemented and functioning:

## Core

- Basic file structure (`/controllers`, `/services`, `/repositories`, `/core`)
- Custom lightweight Dependency Injection system via decorators

## Routing

- Express-style route handlers with service injection
- Example service/controller wired end-to-end

## Database

- Integrated with Prisma ORM
- MySQL setup
- Automatic Prisma Client generation and migration support
- Basic CRUD support via custom repository pattern

## Dev Setup

- Fully Dockerized (local development)
- Automatic build steps including Prisma generation/migration

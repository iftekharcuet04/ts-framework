# Instructions: Running Locally

This project uses Docker to provide a consistent development environment.

## Prerequisites

- Docker installed and running

## Running the Application

```bash
sudo docker compose up --build 


```


## Prisma Migration (Important)

The Docker image handles prisma generate automatically.

Enter the running container:

``` bash
docker exec -it ts-framework sh

npx prisma migrate dev

```


This ensures the database schema is correctly applied in your development container.

## Development URL

http://localhost:3000/

You can test routes using tools like Postman or curl.


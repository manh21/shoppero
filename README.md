# Shopper Mini ECommerce

This repository contains the codebase for our e-commerce application. The application is built using NextJS, TypeScript, NodeJS, PostgreSQL. In addition, the repository also includes documentation for the project, including installation instructions and a user manual.

Please note that this is a dummy e-commerce platform and is not intended for commercial use. The purpose of this project is solely for educational and learning purposes.

#### API Documentation
TODO
### DEMO
TODO

### Docker
TODO
* `docker-compose build --no-cache`
* `docker-compose up -d`
* `docker-compose down`

#### Server Requirements
* NodeJS ^16.x
* PostgreSQL 14.1
* PM2

#### Additional Requiremnet

#### Tech Use
* NextJS
* Prisma
* TailwindCSS
* PostgreSQL
* Docker
* PM2
* TypeScript
* NodeJS
* NextAuth

#### Guide
1. Install packages
    * `npm install` development
    * `npm ci` production
2. Configure `.env` file
    * `cp .env.examples .env`
    * Fill out the config
3. Setup Database
    * `npx prisma migrate dev` make new migration files
    * `npx prisma migrate deploy` production
    * `npx prisma generate`
4. Build Source
    * `npm run build`
5. Run Script
    * `npm run dev` development
    * `npm run start` production

# 🚄 *Prisma-Express*

A lightweight `Node`-`Typescript`-`Express`-`Prisma` quick-starter with semi-advanced user authentication (see dependencies).\
Forked from [**AWallace's version**](https://github.com/vawallace/base-node-express).

---

- [🚄 *Prisma-Express*](#-prisma-express)
  - [Getting Started](#getting-started)
    - [Setup Environment Variables](#setup-environment-variables)
    - [Setup Database](#setup-database)
    - [Add NPM dependencies](#add-npm-dependencies)
  - [Running](#running)
  - [Build](#build)
  - [Maintenance](#maintenance)
      - [Table Changes and Database Migrations](#table-changes-and-database-migrations)
  - [Dependencies](#dependencies)
    - [Code Helpers](#code-helpers)
  - [Contributing](#contributing)

---

## Getting Started

### Setup Environment Variables
1. Create a new file `{ProjectRoot}/.env` 
2. Copy Contents from `{ProjectRoot}/env.sample` 
3. (OPTIONAL) Run `npm run generate-keys` to generate random values for the `JWT_SEC` and `ENCRYPT` constants.

### Setup Database
Don't worry: this part is easy.

First, create a database using one of Prisma's supported providers.\
The repository author prefers `postgresql`, though Prisma also supports `mysql`, `sqlite`, `sqlserver` and `mongodb`.\
Then you can follow the next steps:
1. Set the `DATABASE_URL` in your `.env` file to point to your new database.\
   The end result should look something like this (configured for postgres):
   ```
   DB_URL="postgresql://username:password@localhost:5432/database_name"
   ```
2. (OPTIONAL) **If you did not use `postgresql` as your provider**, set the `provider` of the `datasource` block in schema.prisma to match your database provider. Remember Prisma also supports `mysql`, `sqlite`, `sqlserver` and `mongodb`.
3. **Check the `schema.prisma` file**. It only contains model definitions for a single `Users` table.\
   You can alter the table to your liking, and/or add more tables. Take care of this part before syncing the database.
   > The `schema.prisma` file can be changed often. However, breaking changes may wipe your seed data if you use `prisma db push`, so this is a good
   > time to be reckless.
4. Run `npm run prisma-sync` to create tables in your database from the **Prisma** schema.\
   
And you're done. 

### Add NPM dependencies
Install NPM dependencies.
```bash
$. npm install 
```

## Running
Run the project on `localhost:4001`:
```bash
$. npm run start
```
You can change the port by providing a different `PORT` environment variable.



## Build
Run the project on `localhost:4001`:
```bash
$. npm run build
```
Outputs to `/lib`


## Maintenance

#### Table Changes and Database Migrations 
To add (or change) your database: 
1. Modify the `schema.prisma` file (add tables/columns/etc) and save your changes
2. In the project root, run `npm run db-migrate` to have Prisma generate migration files


---

## Dependencies
This repository comes with the following (in no particular order):

1. [Prisma](https://pris.ly/d/getting-started) 
2. [PassportJS](http://www.passportjs.org/docs/) (authentication via google and username/password only)
3. [Apollo server](https://www.apollographql.com/docs/apollo-server) 
4. [GraphQL Nexus](https://nexusjs.org/) (Code-first schema generation for graphql)
5. [Express Server](https://expressjs.com/)
6. [Typescript 5.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html)
7. [Luxon](https://moment.github.io/luxon/#/?id=luxon) (for datetime management)
8. [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3) (new AWS sdk for image uploading -- also optional)
9. [**Express Rate Limit**](https://www.npmjs.com/package/express-rate-limit) (for rate-limiting | see `server.ts`)
10. [**Argon2**](https://www.npmjs.com/package/argon2) (password encryption)

### Code Helpers
Functional helpers exist for 
- Image uploading 
  - Routes in (`/server.ts`)
  - Upload handlers in (`services/aws.service.ts`)
- User authentication and registration
  - Routes in (`/server.ts` via `configurePassport`)
  - Handlers in (`services/passport.ts`, `middleware/verify.ts`)

This should be enough to get you started quickly. 


## Contributing
Any and all suggestions and pull requests are welcome. 

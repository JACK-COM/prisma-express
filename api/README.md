# ⚒ **MythosForge**

A story world builder. Inspired by [**AWallace's version**](https://github.com/vawallace/novel-manager).

---

- [⚒ **MythosForge**](#-mythosforge)
  - [Getting Started](#getting-started)
    - [Installing dependencies](#installing-dependencies)
    - [Install NPM dependencies.](#install-npm-dependencies)
    - [.env File Configuration](#env-file-configuration)
    - [Database | Tables and Prisma Client setup](#database--tables-and-prisma-client-setup)
    - [Adding Tables and Database migrations](#adding-tables-and-database-migrations)
  - [Running](#running)
  - [Contributing](#contributing)

---

## Getting Started
### Installing dependencies
**Note:** You will need to
* Create a database (using one of Prisma's supported providers -- see [**Database**](#database--prisma))
* Sync `Prisma` to the project following their documentation

If you don't have it installed, you will want to `npx prisma` to get [**Prisma**](https://pris.ly/d/getting-started) on your machine. Then you can follow the next steps.

### Install NPM dependencies.
```bash
$. npm install 
```


### .env File Configuration

1. Create a new file `api/.env` 
2. Copy Contents from `api/env.sample` 
3. Run `npm run generate-keys` to generate values for the `JWT_SEC` and `ENCRYPT` constants.
4. Set the `DATABASE_URL` in the `.env` file to point to your postgres database.\
   The end result should look something like this:
   ```
   DB_URL="postgresql://username:password@localhost:5432/database_name"
   ```
   Replace `username` and `password` with your database user's credentials. 
   > Prisma also supports `mysql`, `sqlite`, `sqlserver` and `mongodb`.

### Database | Tables and Prisma Client setup
Run the following to create tables in your database from the **Prisma** schema.
```bash
$. npm run prisma-sync
```
This is an alias for `npx prisma db push` and `npx prisma generate`, so a Prisma Client will be generated when you do this (if one has not been already). You can now access your database.

> `npx prisma db push` will **wipe** your database if it needs to make breaking changes. It can and should only be used in a development/greenfield context. 


### Adding Tables and Database migrations
Using Prisma involves three steps:
1. Modify the `schema.prisma` file to include your new **models** and/or **enums**
2. Run `
   


---

## Running
Run the project on `localhost:4001`:
```bash
$. npm run start
```

---

## Contributing
Any and all suggestions and pull requests are welcome. 

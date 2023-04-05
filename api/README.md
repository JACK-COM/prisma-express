# ⚒ **MythosForge**

A story world builder. Inspired by [**AWallace's version**](https://github.com/vawallace/novel-manager).

---

- [⚒ **MythosForge**](#-mythosforge)
  - [Getting Started](#getting-started)
    - [Installing dependencies](#installing-dependencies)
    - [Install NPM dependencies.](#install-npm-dependencies)
    - [Configuration](#configuration)
    - [Database | Prisma](#database--prisma)
      - [Create Tables and Prisma Client](#create-tables-and-prisma-client)
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


### Configuration

1. Create a new file `{ProjectRoot}/.env` 
2. Copy Contents from `{ProjectRoot}/env.sample` 
3. (OPTIONAL) Run `npm run generate-keys` to generate random values for the `JWT_SEC` and `ENCRYPT` constants.

### Database | Prisma
1. Set the `DATABASE_URL` in the `.env` file to point to your newly-created database.\
   The end result should look something like this:
   ```
   DB_URL="postgresql://username:password@localhost:5432/database_name"
   ```
   Replace `username` and `password` with your database user's credentials.
2. Set the `provider` of the `datasource` block in schema.prisma to `postgres`.\
   Prisma also supports `mysql`, `sqlite`, `sqlserver` and `mongodb`.
3. **Review the `schema.prisma` file**. It contains ALL model definitions for the application.
   > The `schema.prisma` file can be changed often. However, breaking changes may wipe your seed data if you use `prisma db push`

#### Create Tables and Prisma Client
Run the following to create tables in your database from the **Prisma** schema.
```bash
$. npm run prisma-sync
```
This is an alias for `npx prisma db push` and `npx prisma generate`, so a Prisma Client will be generated when you do this. You can now access your database.

> `npx prisma db push` will **wipe** your database if it needs to make breaking changes. It can and should only be used in a development/greenfield context. 


---

## Running
Run the project on `localhost:3002`:
```bash
$. npm run start
```

---

## Contributing
Any and all suggestions and pull requests are welcome. 

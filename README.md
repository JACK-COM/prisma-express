# 🚄 *Prisma-Express*

A lightweight `Node`-`Typescript`-`Express`-`Prisma` quick-starter with some basic user authentication.\
Forked from [**AWallace's version**](https://github.com/vawallace/base-node-express).

---

- [🚄 *Prisma-Express*](#-prisma-express)
  - [Getting Started](#getting-started)
    - [Installing dependencies](#installing-dependencies)
    - [Configuration](#configuration)
    - [Database | Prisma](#database--prisma)
  - [Running](#running)
  - [Contributing](#contributing)

---

## Getting Started
### Installing dependencies
Unlink from this repository, create a new repo, and install NPM dependencies.
```bash
$. rm -rf .git/ && git init && npm install 
```

This gets out of the way so you can configure what matters. You will need to
* Create a database (using one of Prisma's supported providers -- see [**Database**](#database--prisma))
* Sync `Prisma` to the project following their documentation

### Configuration

1. Create a new file `{ProjectRoot}/.env` 
2. Copy Contents from `{ProjectRoot}/env.sample` 
3. Generate random values for the `JWT_SEC` and `ENCRYPT` constants.

### Database | Prisma
If you don't have it installed, you will want to `npx prisma && npx prisma init` to get [Prisma]() on your machine.\
Then you can follow the next steps:
1. Set the `DATABASE_URL` in the `.env` file to point to your existing database.\
   If your database has no tables yet, read https://pris.ly/d/getting-started.\
   The end result should look something like this:
   ```
   DB_URL="postgresql://username:password@localhost:5432/database_name"
   ```
2. Set the `provider` of the `datasource` block in schema.prisma to match your database.\
   The example in (1) would use `postgresql`: Prisma also supports `mysql`, `sqlite`, `sqlserver` and `mongodb`: 
3. **Check the `schema.prisma` file**. It only contains model definitions for a single `Users` table.\
   You can alter the table to your liking, or add more tables if you wish. Take care of this part before syncing the database.
   > The `schema.prisma` file can be changed often. However, breaking changes may wipe your seed data if you use `prisma db push`
4. Run `npx prisma db push` (mapped to `npm run prisma-sync`) to create tables in your database from the **Prisma** schema.
5. Run `npx prisma generate` to generate the Prisma Client. You can now access your database.


---

## Running
Run the project on `localhost:3002`:
```bash
$. npm run start
```

---

## Contributing
Any and all suggestions and pull requests are welcome. 

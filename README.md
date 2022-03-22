# 🚄 *Prisma-Express*

A lightweight `Node`-`Typescript`-`Express`-`Prisma` quick-starter with some basic user authentication.\
Forked from [**AWallace's version**](https://github.com/vawallace/base-node-express).

---

## Table of contents
- [🚄 *Prisma-Express*](#-prisma-express)
  - [Table of contents](#table-of-contents)
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
   If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the `provider` of the `datasource` block in schema.prisma to match your database:\
   `postgresql`, `mysql`, `sqlite`, `sqlserver` or `mongodb` (Preview).
3. Run `prisma db pull` (mapped to `npm run update-db`) to turn your database schema into a **Prisma** schema.\
   **Note:** You may need to define `models` in the `./prisma/prisma.schema` file after this completes.
4. Run `prisma generate` to generate the Prisma Client. You can then start querying your database.


---

## Running
Run the project on `localhost:3002`:
```bash
$. npm run start
```

---

## Contributing
Any and all suggestions and pull requests are welcome. 

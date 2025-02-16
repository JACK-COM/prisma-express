# 🚄 *Prisma-Express*

A lightweight `Node`-`Typescript`-`Express`-`Prisma` quick-starter with semi-advanced user authentication (see dependencies).\
Forked from [**AWallace's version**](https://github.com/vawallace/base-node-express).

If you prefer Python, there is now a [Prisma-Python](https://github.com/JACK-COM/prisma-python) starter template that is functionally similar.

---

- [🚄 *Prisma-Express*](#-prisma-express)
  - [Getting Started](#getting-started)
    - [Setup Environment Variables](#setup-environment-variables)
    - [Setup Database](#setup-database)
    - [Add NPM dependencies](#add-npm-dependencies)
  - [Running](#running)
  - [Build](#build)
  - [Table Changes and Database Migrations](#table-changes-and-database-migrations)
  - [PLEASE NOTE](#please-note)
  - [Code Helpers](#code-helpers)
  - [Dependencies](#dependencies)
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

1. Set the `DB_URL` variable in your `.env` file to your new database.\
   The end result should look something like this (configured for postgres):

   ```dotenv
   DB_URL="postgresql://username:password@localhost:5432/database_name"
   ```

2. **Check the `schema.prisma` file**. It only contains model definitions for a single `Users` table.\
   You can alter the table to your liking, and/or add more tables. Take care of this part before syncing the database.
   > The `schema.prisma` file can be changed often. However, breaking changes may wipe your seed data if you use `prisma db push`, so this is a good
   > time to be reckless.
   >
   > (OPTIONAL) **If you aren't using `postgresql`**, update the `provider` of the `datasource` block in schema.prisma to match your database provider. Remember Prisma also supports `mysql`, `sqlite`, `sqlserver` and `mongodb`.

And you're done!

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

When you run `start`,

   1. A prisma migration script will compare the connected database to the `schema.prisma` file
   2. If differences are found, relevant migrations will be created and applied.
   3. This will COMPRESS your migration history (i.e. there will only ever be your "creation" SQL, and the latest migration-from-diff file). If you are not using a database or don't want this behavior, change/remove the "prestart" script from `package.json`.

## Build

Generate a build artifact:

```bash
$. npm run build
```

Outputs to `/lib`. You can test it locally by running `node lib/server.js`.

## Table Changes and Database Migrations

To add (or change) your database:

1. Modify the `schema.prisma` file (add tables/columns/etc) and save your changes
2. Restart the app. Migrations will be automatically applied.

> ### ⚠️ Careful when adding Enums
>
> Database enums should not be created and applied as a default value in the same migration.
>
> To avoid this:
>
> 1. Add your new enum (or enum property) and trigger migrations.
> 2. Apply the new enum (or enum value) as a default column value, and trigger migrations again.
>
> This helps to prevent one source of silent migration failures.

## PLEASE NOTE

- You can update individual dependencies without breaking anything.
  - If something *does* break after an update, it might be an interdependency issue (e.g. ***Apollo Server X.0.0** needs **Express Y.0.0***). Check the documentation of your dependencies if this happens.
- ⚠️ This is designed for scaffolding and hacking pretty quickly. It assumes a relational database (and NOT a single table) architecture.
  - Although it doesn't inherently cut any corners, please keep future scaling concerns in mind as you proceed.

## Code Helpers

Functional helpers: you can (and may likely need to) tweak these for your own use.

- AWS Image and file uploading defined in (`./src/services/aws.service.ts`)
  - Available Handlers:
    - `listUserFilesHandler()`
    - `fileDeleteHandler()`
    - `fileUploadHandler()`
    - `handleUploadToAWS()`
    - `uploadFile()`
    - `removeFile()`
  - Routes: (`/server.ts`)
- User authentication and registration
  - ExpressJS Routes defined in `./src/routes/passport.router.ts`
  - Available Handlers:
    - `configurePassport()` (creates passport-related routes)

This should be enough to get you started quickly.

---

## Dependencies

This repository comes with the following (in no particular order):

1. [**@aws-sdk/client-s3**](https://www.npmjs.com/package/@aws-sdk/client-s3) (new AWS sdk for image uploading -- also optional)
2. [**Prisma**](https://pris.ly/d/getting-started) (Code-first database ORM)
3. [**PassportJS**](http://www.passportjs.org/docs/) (authentication via google and username/password only; you can implement more)
4. [**Apollo server**](https://www.apollographql.com/docs/apollo-server)
5. [**NexusJS (for GraphQL)**](https://nexusjs.org/) (Code-first schema generation for graphql)
6. [**Express Server**](https://expressjs.com/)
7. [**Luxon**](https://moment.github.io/luxon/#/?id=luxon) (Datetime management)
8. [**Express Rate Limit**](https://www.npmjs.com/package/express-rate-limit) (rate-limiting | see `src/middleware/auth.guards.ts`)
9. [**Argon2**](https://www.npmjs.com/package/argon2) (password encryption)

The app is written in [Typescript 5.x](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html).

## Contributing

💡 Any and all suggestions and pull requests are welcome!

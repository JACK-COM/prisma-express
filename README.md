# ⚒ **MythosForge**

A story world builder. Inspired by [**AWallace's version**](https://github.com/vawallace/novel-manager).

---

- [⚒ **MythosForge**](#-mythos-forge)
  - [Getting started](#getting-started)
    - [Server](#server)
    - [Frontend](#frontend)

---

This is a monorepo. Clientside code can be found in the `web/` directory; server stuff is in the `api/` directory. Each should have its own README with setup instructions.

## Getting started

### Server
Run the following from the repository root. You will need a `postgres` database called `mythos_forge`. 
```bash
$. cd api/ 
$. npm install # (first run only)
$. npm run start # (runs on :4001 unless you override PORT in .env)
```
The **MythosForge** server uses GraphQL, Prisma, and NodeJS with Typescript. 

### Frontend
Run the following from the repository root. You will need a `postgres` database called `mythos_forge`. 
```bash
$. cd web/ 
$. npm install # (first run only)
$. npm run start # (runs on :5173 unless you override PORT in .env)
```
The **MythosForge** frontend uses ReactJS with ViteJS for bundling. 


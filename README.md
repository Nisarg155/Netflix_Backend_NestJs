<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.


---

---

## 🧰 Tech Stack & Versions

### Runtime
- Node.js: v22.14.0
- npm: 11.7.0

### Framework
- NestJS (Core): 11.1.9
- Nest CLI: 11.0.14
- platform-express: 11.1.9
- @nestjs/common: 11.1.9
- @nestjs/swagger: 11.2.3
- @nestjs/jwt: 11.0.2
- @nestjs/passport: 11.0.5
- @nestjs/config: 4.0.2
- @nestjs/testing: 11.1.9
- @nestjs/throttler: 6.5.0

### ORM & Database
- Prisma: 7.2.0
- Database: PostgreSQL (NeonDB – serverless)

---

## 🚀 Project Setup

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Nisarg155/Netflix_Backend_NestJs.git
cd Netflix_Backend_NestJs
npm install
```

---

### 2️⃣ Environment Variables

Create a `.env` file in root:

```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

> ⚠️ Required to run the backend locally

---

### 3️⃣ Run Locally



```bash
npm run start:dev
```

Backend will run on:

```
http://localhost:3000
```

---

## 📘 API Documentation

### 🔹 Swagger UI (Local Only)

Swagger UI is enabled **only in local development**:

```
http://localhost:3000/api/docs
```

> Note: Swagger UI is disabled in production (Vercel limitation).

---

### 🔹 Postman API Documentation (Recommended)

All APIs are documented and testable via Postman:

👉 **Postman Docs**

```
https://documenter.getpostman.com/view/33078864/2sBXVZouMj
```

You can:

* View all routes
* See request/response formats
* Test APIs directly

---

## 🌐 Production Backend URL

Deployed backend (Vercel):

```
https://netflix-backend-nest-7d0edbo1f-nisarg155s-projects.vercel.app/
```

Use this base URL while testing APIs in Postman.

---


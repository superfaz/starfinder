# StarFinder

[![Deployment](https://github.com/superfaz/starfinder/actions/workflows/deploy.yml/badge.svg)](https://github.com/superfaz/starfinder/actions/workflows/deploy.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=superfaz_starfinder&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=superfaz_starfinder)
[![Code Coverage](https://codecov.io/gh/superfaz/starfinder/graph/badge.svg?token=QAIhyKpuAu)](https://codecov.io/gh/superfaz/starfinder)

Provides an easy-to-use online creation tool for StarFinder.

## Current Status

This project is in **alpha mode** and supports only French language at the moment.

You can have an overview of the current implementation here: https://starfinder.monperso.fr

## Licenses

This application has been created as open-source and its code is available here under the [MIT License](./LICENSE.md).

The data provided by this application are available under Black Book Editions and Paizo Community Licenses.

> Ce site utilise des marques déposées et/ou des droits d’auteurs qui sont la propriété de Black Book Editions et de Paizo Publishing comme l’y autorisent les conditions d’utilisation de Black Book Editions. Ce site n’est pas publié par Black Book Editions ou Paizo Publishing et n’a pas reçu son aval ni une quelconque approbation de sa part. Pour de plus amples informations sur Black Book Editions, consultez [www.black-book-editions.fr](https://www.black-book-editions.fr).
>
> Pour plus d’informations sur les conditions d’utilisation de la Paizo Community Use Policy, veuillez vous rendre sur [paizo.com/communityuse](https://paizo.com/communityuse).

## Development

[![next.js](https://img.shields.io/badge/next.js-white?logo=next.js&logoColor=%23000000)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/typescript-white?logo=typescript&logoColor=%233178C6)](https://typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-white?logo=pnpm&logoColor=%23F69220)
](https://pnpm.io/)
[![bootstrap](https://img.shields.io/badge/bootstrap-white?logo=bootstrap&logoColor=%237952B3)
](https://getbootstrap.com)
[![vitest](https://img.shields.io/badge/vitest-white?logo=vitest&logoColor=%236E9F18)
](https://vitest.dev)
[![lpaywright](https://img.shields.io/badge/playwright-white?logo=playwright&logoColor=%232EAD33)
](https://playwright.dev)

This project is build with next.js and the standard commands apply:

- `pnpm install` to download all the required libraries
- `pnpm run dev` to start a local environment
- `pnpm run lint` for automated code review based on eslint
- `pnpm run build` to validate and prepare a static release
- `pnpm run test` to run all vitest tests in watch mode
- `pnpm run test --ui` to run all vitest tests in watch mode with vitest-ui enabled

Other scripts available :

- `pnpm run test:e2e` to run all e2e tests based on playwright. Used before as part of the release process to validate a deployment before its promotion to production. Before running those tests locally, playwright browsers needs to be installed via `pnpm exec playwright install`.
- `pnpm run start` to start a local environment based on the build execution. Useful to connect to the production database after having created a `.env.production` file.

### Initial configuration

Create a `.env.local` file to store the following info:

1. Connectivity to kinde for authentication
    - `KINDE_CLIENT_ID`
    - `KINDE_CLIENT_SECRET`
    - `KINDE_ISSUER_URL`
1. Connectivity to MongoDB (optional - localhost by default)
    - `STARFINDER_MONGO_URI`

### Monitoring via Sentry

The monitoring of the application in production is linked to [sentry](https://sentry.io).

The local application could be linked as well if needed, if you have an authorized sentry account.

The command to connect to sentry is:

```bash
sentry-cli login
```

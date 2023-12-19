# StarFinder

[![Deployment](https://github.com/superfaz/starfinder/actions/workflows/azure-static-web-apps.yml/badge.svg)](https://github.com/superfaz/starfinder/actions/workflows/azure-static-web-apps.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=superfaz_starfinder&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=superfaz_starfinder)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=superfaz_starfinder&metric=coverage)](https://sonarcloud.io/summary/new_code?id=superfaz_starfinder)

Provides an easy-to-use online creation tool for StarFinder.

## Current Status

This project is in **alpha mode** and supports only French language at the moment.

You can have an overview of the current implementation here: TO BE PROVIDED

## Licenses

This application has been created as open-source and its code is available here under the [MIT License](./LICENSE.md).

The data provided by this application are available under Black Book Editions and Paizo Community Licenses.

> Ce site utilise des marques déposées et/ou des droits d’auteurs qui sont la propriété de Black Book Editions et de Paizo Publishing comme l’y autorisent les conditions d’utilisation de Black Book Editions. Ce site n’est pas publié par Black Book Editions ou Paizo Publishing et n’a pas reçu son aval ni une quelconque approbation de sa part. Pour de plus amples informations sur Black Book Editions, consultez [www.black-book-editions.fr](https://www.black-book-editions.fr).
>
> Pour plus d’informations sur les conditions d’utilisation de la Paizo Community Use Policy, veuillez vous rendre sur [paizo.com/communityuse](https://paizo.com/communityuse).

## Development

[![next.js](https://img.shields.io/badge/next.js-white?logo=next.js&logoColor=%23000000)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/typescript-white?logo=typescript&logoColor=%233178C6)](https://typescriptlang.org/)
[![yarn](https://img.shields.io/badge/yarn-white?logo=yarn&logoColor=%232C8EBB)
](https://yarnpkg.com)
[![bootstrap](https://img.shields.io/badge/bootstrap-white?logo=bootstrap&logoColor=%237952B3)
](https://getbootstrap.com)
[![vitest](https://img.shields.io/badge/vitest-white?logo=vitest&logoColor=%236E9F18)
](https://vitest.dev)

This project is build with next.js and the standard commands apply:

- `yarn` to download all the required libraries
- `yarn dev` to start a local environment
- `yarn lint` for automated code review based on eslint
- `yarn test` to run all tests in watch mode

To prepare a release, the following commands can be used:

- `yarn build` to prepare a static release

> **To be noted:** the _build_ action has been prepared to manage Azure deployment with a special configuration (see [`next.config.mjs`](./next.config.mjs)).

Finally a special command has been created for code coverage needs:

- `yarn test:coverage` to run all the tests once and provide coverage reports (on-screen and lcov formats)

### Yarn and IDE

The integration of yarn with your IDE could require some extra steps. Please take a look at the official documentation: https://yarnpkg.com/getting-started/editor-sdks

For `vscode`, you will need to enable the typescript version used by the workspace (`ctrl + shift + P` > **Select TypeScript Version** > **Use Workspace Version**).

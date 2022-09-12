---
title: Using private npm packages
---

import ImageSpotlight from '~/components/plugins/ImageSpotlight'

EAS Build comes with full support for using private npm packages in your project. These can either be published to npm (if you have [the Pro/Teams plan](https://www.npmjs.com/products)) or to a private registry (e.g. using self-hosted [verdaccio](https://verdaccio.org/)).

You will need to configure your project and/or provide EAS Build with your npm token before you start the build.

## Default npm configuration

By default, EAS Build uses a self-hosted npm cache that speeds up installing dependencies for all builds. Every EAS Build worker is configured with an `~/.npmrc` that looks something like this:

#### Android

```
registry=http://npm-cache-service.worker-infra-production.svc.cluster.local:4873
```

#### iOS

```
registry=http://10.254.24.8:4873
```

## Using private packages published to npm

If your project is using private packages published to npm, you need to provide EAS Build with [a read-only npm token](https://docs.npmjs.com/about-access-tokens) so we can install your dependencies successfully.

The recommended way is to add the `NPM_TOKEN` secret to your account or project's secrets. See the [secret environment variables](/build-reference/variables/#using-secrets-in-environment-variables) docs to learn how to do this.

<ImageSpotlight alt="Secret creation UI filled" src="/static/images/eas-build/environment-secrets/secrets-create-filled.png" />

When EAS detects that the `NPM_TOKEN` environment variable is available during a build, it automatically creates the following `.npmrc`:

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
registry=https://registry.npmjs.org/
```

However, this only happens when you don't already have an `.npmrc` in your project's root directory. If you do already have this file, you need to update it manually.

You can verify it worked by viewing build logs and looking for the `Prepare project` build phase:

<ImageSpotlight alt=".npmrc created" src="/static/images/eas-build/npmrc.png" />

## Using packages published to a private registry

If you're using a private npm registry like self-hosted [verdaccio](https://verdaccio.org/), you will need to configure the `.npmrc` file manually.

Create an `.npmrc` file in your project's root directory with the following contents:

```
registry=__REPLACE_WITH_REGISTRY_URL__
```

If your registry requires authentication, you will also need to provide the token. Assuming your registry URL is `https://registry.johndoe.com/`:

```
//registry.johndoe.com/:_authToken=${NPM_TOKEN}
registry=https://registry.johndoe.com/
```

## Using both private npm packages and private registry

This is an advanced example, and you will probably never use it. Private npm packages are always scoped ([see npm docs](https://docs.npmjs.com/about-scopes#scopes-and-package-visibility)). Let's assume that your npm username is `johndoe` and your private self-hosted registry URL is `https://registry.johndoe.com/`. If you want to install dependencies from both sources, create the following `.npmrc` in your project's root directory:

```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
@johndoe:registry=https://registry.npmjs.org/
registry=https://registry.johndoe.com/
```

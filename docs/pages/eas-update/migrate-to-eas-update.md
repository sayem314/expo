---
title: Migrating from Classic Updates to EAS Update
---

import ImageSpotlight from '~/components/plugins/ImageSpotlight'

EAS Update is the next generation of Expo's updates service. If you're using Classic Updates, this guide will help you upgrade to EAS Update.

## Prerequisites

EAS Update requires the following versions or greater:

- Expo CLI 5.0.0
- EAS CLI 0.41.1
- Expo SDK 44.0.1
- expo-updates 0.11.2

## Install Expo CLI and EAS CLI

1. Install EAS and Expo CLIs with:

   ```bash
   npm install --global eas-cli expo-cli
   ```

2. Then, log in with your expo account:

   ```bash
   eas login
   ```

## Configure your project

You'll need to make the following changes to your project:

1. Install the latest `expo-updates` library with:

   ```bash
   yarn add expo-updates@0.11.2
   ```

2. Initialize your project with EAS Update:

   ```bash
   eas update:configure
   ```

   After this command, you should have two a new fields in your app config (**app.json**/**app.config.js**) at `expo.updates.url` and `expo.runtimeVersion`.

3. To ensure that updates are compatible with the underlying native code inside a build, EAS Update uses a new field named `runtimeVersion` that replaces the `sdkVersion` field in your project's app config (**app.json**/**app.config.js**). Remove the `expo.sdkVersion` property from your app config.

4. Next, set your project up with EAS Build by running:

   ```bash
   eas build:configure
   ```

5. To allow updates to apply to builds built with EAS, update your EAS build profiles in **eas.json** to include channel properties. These channels should replace any `releaseChannel` properties. We find it convenient to name the `channel` after the profile's name. For instance, the `preview` profile has a `channel` named `"preview"` and the `production` profile has a `channel` named `"production"`.

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

6. Optional: If your project is a bare React Native project, [read the doc](/eas-update/bare-react-native) on extra configuration you may need.

## Create new builds

The changes above affect the native code layer inside builds, which means we'll need to make new builds. Once your builds are complete, we'll be ready to develop an update and publish it.

## Developing locally

EAS Update uses a [modern manifest format](/technical-specs/expo-updates-0). When you have a EAS Update url in your app config at `updates.url`, Expo CLI will automatically serve the correct manifest format for your project. This will ensure that the code you develop locally will work as an update when published later. You can start a localy development session just like before, with:

```bash
yarn start

# or

expo start
```

## Publishing an update

To publish an update, run:

```bash
eas update --branch [branch-name] --message [message]

# example
eas update --branch production --message "Fixes typo"
```

EAS Update adds a new type of object called a "branch". A branch is a list of updates, and it is linked to a channel. In the diagram below, builds with a channel of "production" are linked to a branch named "production". By default, channels and branches of the same name are linked until changed.

<ImageSpotlight alt={`Channel "production" linked to branch "production"`} src="/static/images/eas-update/channel-branch.png" />

## Additional possible migration steps

- If you have any scripts that run `expo publish`, you can replace those with `eas update`. You can view all the options for publishing with `eas update --help`
- If you have any code that references `Updates.releaseChannel` from the `expo-updates` library, you'll have to remove those. Currently, EAS Update does not expose the `channel` of a build. Instead, you can use [environment variables](/build-reference/variables).
- Remove any code that references `Constants.manifest`. That will now always return `null`.

## Known issues

EAS Update is currently in "preview", meaning that we may make major changes to developer-facing workflows. There are also a variety of [known issues](/eas-update/known-issues), which you should consider before using EAS Update with your project.

## Next steps

EAS Update is built to be faster and more powerful than ever before. We can't wait to hear what you think. Try setting up EAS Update to publish on pushing to GitHub with a [GitHub Action](/eas-update/github-actions). Also check out the new sets of [deployment patterns](/eas-update/deployment-patterns) enabled by EAS Update.

If you run into issues or have feedback, join us on [Discord](https://chat.expo.dev/) in the #eas channel.

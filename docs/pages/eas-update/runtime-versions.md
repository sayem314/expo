---
title: Runtime versions and updates
---

import ImageSpotlight from '~/components/plugins/ImageSpotlight'

Runtime versions are a property that guarantees compatibility between a build's native code and an update. When a project is made into a build, the build will contain some native code that cannot be changed with an update. Therefore, an update must be compatible with a build's native code to run on the build.

To illustrate how builds and updates interact, take a look at the following diagram:

<ImageSpotlight alt="Native and update layers diagram" src="/static/images/eas-update/layers.png" />

Builds can be thought of as two layers: a native layer that's built into the app's binary, and an update layer, that is swappable with other compatible updates. This separation allows us to ship bug fixes to builds as long as the update with the bug fix can run on the native layer inside the build. The `"runtimeVersion"` property allows us to guarantee that an update is compatible with a specific build's native code.

Since updates must be compatible with a build's native code, any time native code is updated, we're required to make a new build before publishing an update. Some developers only update native code when upgrading to a new Expo SDK, while others may upgrade native code between builds or at other intervals. Below is an explanation of different situations and configurations that may suite your project.

## Setting `"runtimeVersion"`

To make managing the `"runtimeVerison"` property easier between builds and updates, we've created runtime version policies that will update automatically based on other fields inside the app config (**app.json**/**app.config.js**). If these policies do not match the development flow of a project, there's also an option to set the `"runtimeVersion"` manually.

### `"sdkVersion"` runtime version policy

By default, we provide the `"sdkVersion"` runtime version policy after running `eas update:configure`:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

The `"sdkVersion"` policy will set the runtime version to the current SDK version of a project. For instance, if the project is on Expo SDK 1.0.0, the runtime version with this policy will be `"exposdk:1.0.0"`. This runtime version will update any time we update the project's Expo SDK. So, if we ran `expo upgrade` and installed Expo SDK 2.0.0, then the runtime version would become `"exposdk:2.0.0"`.

This runtime version policy is perfect if you are not including custom native code in your project and the only native changes you make are when upgrading Expo SDKs.

### `"nativeVersion"` runtime version policy

We provide the `"nativeVersion"` runtime version policy for projects that have custom native code that may change between builds:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "nativeVersion"
    }
  }
}
```

The `"nativeVersion"` policy will set the runtime version to the projects current `"version"` and `"buildNumber"` (iOS) or `"versionCode"` (Android) properties. For a project that has the following in its app config:

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "nativeVersion"
    },
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": "1"
    }
  }
}
```

The runtime version for the iOS and Android builds and any updates would be the combination of `"[version]-[buildNumber|versionCode]"`, which in this case would be `"1.0.0-1"`.

This policy is great for projects that contain custom native code and that update the native version numbers (`"buildNumber"`for iOS and `"versionCode"` for Android) for each build. To submit an app, the app stores require an updated native version number for each submitted build, which makes this policy convenient for projects who use the Play Store's Internal Test Track and the App Store's TestFlight distribution tools.

It's important to know that this policy does require the developer to manage the native version numbers manually between each build.

Also, if you select a different native version between iOS and Android, you'll end up with builds and updates with separate runtime versions. When you publish an update, EAS CLI will detect that two updates are needed, and it will create two updates with the required runtime versions and publish them separately.

### Custom `"runtimeVersion"`

You can also set a custom runtime version that meets the [runtime version formatting requirements](/versions/latest/config/app/#runtimeversion):

```json
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}
```

This option is good for developers who want to manage the runtime version manually, separately from any other version numbers present in a project's app config. It gives the developer complete control over which updates are compatible with which builds.

## Avoiding crashes with incompatible updates

The main issue that can arise when publishing updates is that the update could rely on native code that the build it's running on does not support. For instance, imagine we made a build with a runtime version of `"1.0.0"`. Then, we submitted that build to the app stores and released it to the public.

Later on, imagine that we developed an update that relied on a newly installed native library, like the `expo-in-app-purchases` library, and we did not update the `"runtimeVersion"` property, so that it is still `"1.0.0"`. If we published an update, the builds with the `"runtimeVersion"` of `"1.0.0"` would think the incoming update with the same runtime version was compatible and it would attempt to load the update. Since the update would make calls to code that does not exist inside the build, the app would crash.

There are a few ways to avoid crashes like this:

- Whenever we install or update native code, iterate the `"runtimeVersion"` property in the project's app config (**app.json**/**app.config.js**).
- Create a preview build of your app and load it on a test device. Then, publish the update to the "preview" branch to make sure it works as expected before publishing it to the project's production branch.

If this error does occur, then you can republish a previous known-good update, then ask users to delete the app and reinstall it.

In the future, the `expo-updates` library will prevent many instances of this from crashing the app. If we can detect this particular issue, we'll automatically roll back to a previous update instead of loading the bad update.

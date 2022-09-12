---
title: StoreReview
sourceCodeUrl: 'https://github.com/expo/expo/tree/sdk-40/packages/expo-store-review'
---

import ImageSpotlight from '~/components/plugins/ImageSpotlight'
import InstallSection from '~/components/plugins/InstallSection';
import PlatformsSection from '~/components/plugins/PlatformsSection';

**`expo-store-review`** provides access to the `SKStoreReviewController` API in iOS 10.3+ devices, and `ReviewManager` API in Android 5.0+ allowing you to ask the user to rate your app without ever having to leave the app itself.

<ImageSpotlight src="/static/images/store-review.png" alt="Screenshots of the store review API in action on iOS" />

<PlatformsSection android emulator ios simulator />

## Installation

<InstallSection packageName="expo-store-review" />

## API

```js
import * as StoreReview from 'expo-store-review';
```

### `StoreReview.requestReview()`

In the ideal circumstance this will open a native modal and allow the user to select a star rating that will then be applied to the App Store without leaving the app.
If the users device is running a version of iOS lower than 10.3, or the user is on an Android version lower than 5.0, this will attempt to get the store URL and link the user to it.

#### Error Codes

- [`ERR_STORE_REVIEW_UNSUPPORTED`](#err_store_review_unsupported)

#### Example

```js
StoreReview.requestReview();
```

### `StoreReview.isAvailableAsync()`

Determines if the platform has the capabilities to use `StoreReview.requestReview()`. On iOS, this will return `true` if the device is running iOS 10.3+. On Android, this will return `true` if the device is running Android 5.0+. On Web, this will return `false`.

#### Example

```js
StoreReview.isAvailableAsync();
```

### `StoreReview.storeUrl()`

This uses the `Constants` API to get the `Constants.manifest.ios.appStoreUrl` on iOS, or the `Constants.manifest.android.playStoreUrl` on Android.

In the bare workflow, this will return `null`.

#### Example

```js
const url = StoreReview.storeUrl();
```

### `StoreReview.hasAction()`

This returns a promise that fulfills to is `true` if `StoreReview.requestReview()` is capable directing the user to some kind of store review flow. If the app config (**app.json**) does not contain store URLs and native store review capabilities are not available then the promise will fulfill to `false`.

#### Example

```js
if (await StoreReview.hasAction()) {
  // you can call StoreReview.requestReview()
}
```

## Error Codes

### `E_STORE_REVIEW_UNSUPPORTED`

Requesting an App Store review is not supported on this device. The device must be iOS 10.3 or greater. Android and web are not supported. Be sure to check for support with `isAvailableAsync()` to avoid this error.

---

## Usage

It is important that you follow the [Human Interface Guidelines](https://developer.apple.com/ios/human-interface-guidelines/system-capabilities/ratings-and-reviews/) for iOS and [Guidelines](https://developer.android.com/guide/playcore/in-app-review#when-to-request) for Android when using this API.

**Specifically:**

- Don't call `StoreReview.requestReview()` from a button - instead try calling it after the user has finished some signature interaction in the app.
- Don't spam the user
- Don't request a review when the user is doing something time sensitive like navigating.
- Don't ask the user any questions before or while presenting the rating button or card.

### Write Reviews

#### iOS

You can redirect someone to the "Write a Review" screen for an app in the iOS App Store by using the query parameter `action=write-review`. For example:

```ts
const itunesItemId = 982107779;
// Open the iOS App Store in the browser -> redirects to App Store on iOS
Linking.openURL(`https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`);
// Open the iOS App Store directly
Linking.openURL(
  `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
);
```

#### Android

There is no equivalent redirect on Android, you can still open the Play Store to the reviews sections using the query parameter `showAllReviews=true` like this:

```ts
const androidPackageName = 'host.exp.exponent';
// Open the Android Play Store in the browser -> redirects to Play Store on Android
Linking.openURL(
  `https://play.google.com/store/apps/details?id=${androidPackageName}&showAllReviews=true`
);
// Open the Android Play Store directly
Linking.openURL(`market://details?id=${androidPackageName}&showAllReviews=true`);
```

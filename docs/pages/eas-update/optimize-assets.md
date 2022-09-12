---
title: How to optimize assets for EAS Update
---

import ImageSpotlight from '~/components/plugins/ImageSpotlight'

When an app finds a new update, it downloads a manifest and then downloads any new or updated assets so that it can run the update. The process is as follows:

<ImageSpotlight alt="Update download timeline" src="/static/images/eas-update/process.png" />

Many users running Android and iOS apps are using mobile connections that are not as consistent or fast as when they are using Wi-Fi, so it's important that the assets shipped as a part of an update are as small as possible.

## **Code assets**

When publishing an update, EAS CLI runs Expo CLI to bundle the project into an update. The update will appear in our project's **./dist** folder.

In **./dist/bundles**, we can see the size of the **index.ios.js** and **index.android.js** files that will be part of the iOS and Android updates, respectively. Note that these are uncompressed file sizes; EAS Update uses Brotli and gzip compression, which can significantly reduce download sizes. Nevertheless, these files will be downloaded to a user's device when getting the new update if the device has not downloaded them before. Making these file sizes as small as possible helps end-users download updates quickly.

## **Image assets**

Users will have to download any new images or other assets when they detect a new update, if those assets are not already a part of their build. You can view all the assets uploaded to EAS' servers in **./dist/assets**. The assets there are hashed with their extensions removed, so it is difficult to know what assets are there. To see a pretty-printed list of assets, we can run:

```
expo export --experimental-bundle
```

To optimize all the images in an app at once, we can use the [expo-optimize library](https://www.npmjs.com/package/expo-optimize). `expo-optimize` uses `sharp-cli` to optmize all image assets.

```bash
npx expo-optimize
```

## **Other assets**

For assets like GIFs or movies, or non-code and non-image assets, it's up to the developer to optimize and minify those assets. (Note: GIFs are a very inefficient format. Modern video codecs can produce smaller file sizes by over an order of magnitude.)

## **Further considerations**

It's important to point out that a user's app will only download new or updated assets. It will not re-download unchanged assets that already exist inside the app.

One way to make sure that updates stay as slim as possible is to build and submit the app frequently to the app stores so that users can download a new app binary that includes more up-to-date assets. Generally, it's a good practice to build and submit an app when adding large or many assets, and good to use updates to fix small bugs and make minor changes between app store releases.

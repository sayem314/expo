---
title: DocumentPicker
sourceCodeUrl: 'https://github.com/expo/expo/tree/master/packages/expo-document-picker'
packageName: 'expo-document-picker'
---

import APISection from '~/components/plugins/APISection';
import {APIInstallSection} from '~/components/plugins/InstallSection';
import PlatformsSection from '~/components/plugins/PlatformsSection';
import Video from '~/components/plugins/Video'

Provides access to the system's UI for selecting documents from the available providers on the user's device.

<Video file={"sdk/documentpicker.mp4"} loop={false} />

<PlatformsSection android emulator ios simulator web />

## Installation

<APIInstallSection />

## Configuration

### Managed workflow

For iOS, outside of the Expo Go app, the DocumentPicker module requires the iCloud entitlement to work properly. You need to set the `usesIcloudStorage` key to `true` in your **app.json** file as specified [here](../../../workflow/configuration.md#ios).

In addition, you'll also need to enable the iCloud Application Service in your App identifier. This can be done in the detail of your [App ID in the Apple developer interface](https://developer.apple.com/account/ios/identifier/bundle).

Enable iCloud service with CloudKit support, create one iCloud Container, and name it `iCloud.<your_bundle_identifier>`.

And finally, to apply those changes, you'll need to revoke your existing provisioning profile and run `expo build:ios -c`

### Bare workflow

For iOS bare projects, the `DocumentPicker` module requires the iCloud entitlement to work properly. If your app doesn't have it already, you can add it by opening the project in Xcode and following these steps:

- In the project, go to the `Capabilities` tab
- Set the iCloud switch to `on`
- Check the `iCloud Documents` checkbox

## API

```js
import * as DocumentPicker from 'expo-document-picker';
```

<APISection packageName="expo-document-picker" apiName="DocumentPicker" />

---
title: LocalAuthentication
sourceCodeUrl: 'https://github.com/expo/expo/tree/sdk-43/packages/expo-local-authentication'
---

import APISection from '~/components/plugins/APISection';
import InstallSection from '~/components/plugins/InstallSection';
import PlatformsSection from '~/components/plugins/PlatformsSection';

**`expo-local-authentication`** allows you to use FaceID and TouchID (iOS) or the Biometric Prompt (Android) to authenticate the user with a face or fingerprint scan.

<PlatformsSection android emulator ios simulator web={{ pending: 'https://github.com/expo/expo/issues/4045' }} />

## Installation

<InstallSection packageName="expo-local-authentication" />

## Configuration

On Android, this module requires permissions to access the biometric data for authentication purposes. The `USE_BIOMETRIC` and `USE_FINGERPRINT` permissions are automatically added.

## API

```js
import * as LocalAuthentication from 'expo-local-authentication';
```

<APISection packageName="expo-local-authentication" apiName="LocalAuthentication" />
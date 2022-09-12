---
title: Location
sourceCodeUrl: 'https://github.com/expo/expo/tree/sdk-44/packages/expo-location'
---

import APISection from '~/components/plugins/APISection';
import InstallSection from '~/components/plugins/InstallSection';
import PlatformsSection from '~/components/plugins/PlatformsSection';
import SnackInline from '~/components/plugins/SnackInline';

**`expo-location`** allows reading geolocation information from the device. Your app can poll for the current location or subscribe to location update events.

<PlatformsSection android emulator ios simulator web />

## Installation

<InstallSection packageName="expo-location" />

## Configuration

In Managed and bare apps, `Location` requires `Permissions.LOCATION`.

### Background Location Methods

In order to use Background Location methods, the following requirements apply:

- `Permissions.LOCATION` permission must be granted. On iOS it must be granted with `Always` option — see [Permissions.LOCATION](permissions.md#permissionslocation) for more details.
- **(_iOS only_)** `"location"` background mode must be specified in **Info.plist** file. See [background tasks configuration guide](task-manager.md#configuration). 
- Background location task must be defined in the top-level scope, using [TaskManager.defineTask](task-manager.md#taskmanagerdefinetasktaskname-task).

### Geofencing Methods

In order to use Geofencing methods, the following requirements apply:

- `Permissions.LOCATION` permission must be granted. On iOS it must be granted with `Always` option — see [Permissions.LOCATION](permissions.md#permissionslocation) for more details.
- Geofencing task must be defined in the top-level scope, using [TaskManager.defineTask](task-manager.md#taskmanagerdefinetasktaskname-task).
- On iOS, there is a [limit of 20](https://developer.apple.com/documentation/corelocation/monitoring_the_user_s_proximity_to_geographic_regions) `regions` that can be simultaneously monitored.

> **Note:** On Android, This module requires the permissions for approximate and exact device location. It also needs the foreground service permission to subscribe to location updates, while the app is in use. The `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`, and `FOREGROUND_SERVICE` permissions are automatically added.

> **Note:** On Android, you have to [submit your app for review and request access to use the background location permission](https://support.google.com/googleplay/android-developer/answer/9799150?hl=en).

## Usage

If you're using the iOS or Android Emulators, ensure that [Location is enabled](#enabling-emulator-location).

<SnackInline label='Location' dependencies={['expo-location', 'expo-constants']}>

```jsx
import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
/* @hide */
import Constants from 'expo-constants';
/* @end */
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      /* @hide */
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      /* @end */
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

/* @hide const styles = StyleSheet.create({ ... }); */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
/* @end */
```

</SnackInline>

## Enabling Emulator Location

### iOS Simulator

With Simulator open, go to Debug > Location and choose any option besides "None" (obviously).

![iOS Simulator location](/static/images/ios-simulator-location.png)

### Android Emulator

Open Android Studio, and launch your AVD in the emulator. Then, on the options bar for your device, click the icon for "More" and navigate to the "Location" tab.

![Android Simulator location](/static/images/android-emulator-location.png)

If you don't receive the locations in the emulator, you may have to turn off "Improve Location Accuracy" in Settings - Location in the emulator. This will turn off Wi-Fi location and only use GPS. Then you can manipulate the location with GPS data through the emulator.

## API

```js
import * as Location from 'expo-location';
```

<APISection packageName="expo-location" apiName="Location" />

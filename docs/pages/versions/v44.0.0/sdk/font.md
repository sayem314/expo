---
title: Font
sourceCodeUrl: 'https://github.com/expo/expo/tree/sdk-44/packages/expo-font'
---

import APISection from '~/components/plugins/APISection';
import InstallSection from '~/components/plugins/InstallSection';
import PlatformsSection from '~/components/plugins/PlatformsSection';
import SnackInline from '~/components/plugins/SnackInline';

**`expo-font`** allows loading fonts from the web and using them in React Native components. See more detailed usage information in the [Fonts](../../../guides/using-custom-fonts.md) guide.

<PlatformsSection android emulator ios simulator web />

## Installation

<InstallSection packageName="expo-font" />

## Usage

### Example: hook

<SnackInline
label='useFonts'
dependencies={['expo-font']}
files={{
'assets/fonts/Montserrat.ttf': 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/ee6539921d713482b8ccd4d0d23961bb'
}}>

```tsx
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {
  /* @info */ const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat.ttf'),
  });
  /* @end */

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Montserrat', fontSize: 30 }}>Montserrat</Text>
    </View>
  );
}

/* @hide const styles = StyleSheet.create({ ... }); */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
/* @end */
```

</SnackInline>

### Example: functions

<SnackInline
label='Font.loadAsync'
dependencies={['expo-font']}
files={{
'assets/fonts/Montserrat.ttf': 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/ee6539921d713482b8ccd4d0d23961bb',
'assets/fonts/Montserrat-SemiBold.ttf': 'https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/c641dbee1d75892e4d88bdc31560c91b'
}}>

```tsx
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';

export default class App extends React.Component {
  state = {
    fontsLoaded: false,
  };

  async loadFonts() {
    /* @info */ await Font.loadAsync({
      // Load a font `Montserrat` from a static resource
      Montserrat: require('./assets/fonts/Montserrat.ttf'),

      // Any string can be used as the fontFamily name. Here we use an object to provide more control
      'Montserrat-SemiBold': {
        uri: require('./assets/fonts/Montserrat-SemiBold.ttf'),
        display: Font.FontDisplay.FALLBACK,
      },
    });
    /* @end */
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
  }

  render() {
    // Use the font with the fontFamily property after loading
    if (this.state.fontsLoaded) {
      return (
        <View style={styles.container}>
          <Text style={{ fontSize: 20 }}>Default Font</Text>
          <Text style={{ fontFamily: 'Montserrat', fontSize: 20 }}>Montserrat</Text>
          <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>
            Montserrat-SemiBold
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
}

/* @hide const styles = StyleSheet.create({ ... }); */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
/* @end */
```

</SnackInline>

## API

```js
import * as Font from 'expo-font';
```

<APISection packageName="expo-font" />

## Error Codes

| Code                | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| ERR_FONT_API        | If the arguments passed to `loadAsync` are invalid.               |
| ERR_FONT_SOURCE     | The provided resource was of an incorrect type.                   |
| ERR_WEB_ENVIRONMENT | The browser's `document` element doesn't support injecting fonts. |
| ERR_DOWNLOAD        | Failed to download the provided resource.                         |
| ERR_FONT_FAMILY     | Invalid font family name was provided.                            |
| ERR_UNLOAD          | Attempting to unload fonts that haven't finished loading yet.     |

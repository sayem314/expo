---
title: Push Notifications Overview
sidebar_title: Overview
---

Push Notifications are an important feature, no matter what kind of app you're building. Not only is it nice to let users know about something that may interest them, be it a new album being released, a sale or other limited-time-only deal, or that one of their friends sent them a message, but push notifications are proven to help boost user interaction and create a better overall user experience.

Whether you just want to be able to let users know when a relevant event happens, or you're trying to optimize customer engagement and retention, Expo makes implementing push notifications almost too easy. All the hassle with native device information and communicating with APNs (Apple Push Notification service) or FCM (Firebase Cloud Messaging) is taken care of behind the scenes, so that you can treat iOS and Android notifications the same, saving you time on the front-end, and back-end!

There are three main steps to setting up push notifications, and we provide a guide for each part of the process:

- [Setup: getting a user's Expo Push Token](push-notifications-setup.md)
- [Sending: calling Expo's Push API with the token when you want to send a notification](sending-notifications.md)
- [Receiving: responding to the notification in your app](receiving-notifications.md) (maybe upon opening, you want to jump to a particular screen that the notification refers to)

## Usage

The code below shows a full example of how to register for, send, and receive push notifications in an Expo app. But make sure to read the rest of the guide, so that you understand how Expo's push notification service works, what the best practices are, and how to investigate any problems you run into!

```js
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
```

## Testing

We recommend testing push notifications on a physical device. iOS simulators **cannot** receive push notifications, and neither can Android emulators unless you are running an image with Google Play Services installed and configured. Additionally, when calling `Notifications.requestPermissionsAsync()` on the simulator, it will resolve immediately with `undetermined` as the status, regardless of whether you choose to allow or not.

The [Expo push notification tool](https://expo.dev/notifications) is also useful for testing push notifications during development. It lets you easily send test notifications to your device, without having to use your CLI or write out a test server.

## Next steps

Read through the [notification setup guide](./push-notifications-setup.md) to get your credentials setup, and start collecting push tokens!

## See also

- Having trouble? Visit [Expo's notification FAQ page](./faq.md)

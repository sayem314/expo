# Changelog

## Unpublished

### 🛠 Breaking changes

### 🎉 New features

### 🐛 Bug fixes

- Re-enable passing custom action string to `startActivityAsync`. ([#15671](https://github.com/expo/expo/pull/15671) by [@Simek](https://github.com/Simek))

### 💡 Others

## 10.1.0 — 2021-12-03

### 💡 Others

- Rewrite Android code to Kotlin. ([#14479](https://github.com/expo/expo/pull/14479) by [@kkafar](https://github.com/kkafar))

## 10.0.1 — 2021-10-01

_This version does not introduce any user-facing changes._

## 10.0.0 — 2021-09-28

### 🛠 Breaking changes

- Replace the stand-alone action constant strings with String Enum named `ActivityAction`. ([#14070](https://github.com/expo/expo/pull/14070) by [@Simek](https://github.com/Simek))

```diff
- IntentLauncher.ACTION_* // ACTION_ACCESSIBILITY_SETTINGS
+ IntentLauncher.ActivityAction.* // ActivityAction.ACCESSIBILITY_SETTINGS
```## 9.1.0 — 2021-06-16

### 🐛 Bug fixes

- Enable kotlin in all modules. ([#12716](https://github.com/expo/expo/pull/12716) by [@wschurman](https://github.com/wschurman))

### 💡 Others

- Build Android code using Java 8 to fix Android instrumented test build error. ([#12939](https://github.com/expo/expo/pull/12939) by [@kudo](https://github.com/kudo))

## 9.0.0 — 2021-03-10

### 🎉 New features

- Updated Android build configuration to target Android 11 (added support for Android SDK 30). ([#11647](https://github.com/expo/expo/pull/11647) by [@bbarthec](https://github.com/bbarthec))
- Upgrade native libraries. ([#12125](https://github.com/expo/expo/pull/12125) by [@bbarthec](https://github.com/bbarthec))

### 🐛 Bug fixes

- Handle `ActivityNotFoundException` error to prevent crashes. ([#12078](https://github.com/expo/expo/pull/12078) by [@robertying](https://github.com/robertying))

## 8.4.0 — 2020-11-17

_This version does not introduce any user-facing changes._

## 8.3.0 — 2020-08-18

_This version does not introduce any user-facing changes._

## 8.2.1 — 2020-05-29

*This version does not introduce any user-facing changes.*

## 8.2.0 — 2020-05-27

*This version does not introduce any user-facing changes.*
```

```

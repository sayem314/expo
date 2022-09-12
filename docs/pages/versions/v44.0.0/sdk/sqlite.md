---
title: SQLite
sourceCodeUrl: 'https://github.com/expo/expo/tree/sdk-44/packages/expo-sqlite'
---

import APISection from '~/components/plugins/APISection';
import InstallSection from '~/components/plugins/InstallSection';
import PlatformsSection from '~/components/plugins/PlatformsSection';

**`expo-sqlite`** gives your app access to a database that can be queried through a [WebSQL](https://www.w3.org/TR/webdatabase/)-like API. The database is persisted across restarts of your app.

An [example to do list app](https://github.com/expo/examples/tree/master/with-sqlite) is available that uses this module for storage.

<PlatformsSection android emulator ios simulator />

## Guides

### Importing an existing database

In order to open a new SQLite database using an existing `.db` file you already have, you need to do three things:

- `expo install expo-file-system expo-asset`
- create a **metro.config.js** file in the root of your project with the following contents ([curious why? read here](../../../guides/customizing-metro.md#adding-more-file-extensions-to--assetexts)):

```ts
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'db'],
  },
};
```

- Use the following function (or similar) to open your database:

```ts
async function openDatabase(pathToDatabaseFile: string): Promise<SQLite.WebSQLDatabase> {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require(pathToDatabaseFile)).uri,
    FileSystem.documentDirectory + 'SQLite/myDatabaseName.db'
  );
  return SQLite.openDatabase('myDatabaseName.db');
}
```

### Executing statements outside of a transaction

> Please note that you should use this kind of execution only when it is necessary. For instance, when code is a no-op within transactions (like eg. `PRAGMA foreign_keys = ON;`).

```js
const db = SQLite.openDatabase('dbName', version);

db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
  console.log('Foreign keys turned on')
);
```

## Installation

<InstallSection packageName="expo-sqlite" />

## API

```js
import * as SQLite from 'expo-sqlite';
```

<APISection packageName="expo-sqlite" apiName="SQLite" />
---
title: Using Styled Components
---

Styled Components is a CSS-in-JS solution that enables you to create React components with a given style very easily. Using `styled-components` with Expo, you can create universal styles that'll work the same across web, mobile, and desktop!

## Getting Started

Install the package:

```sh
yarn add styled-components
```

Use `styled-components/native` instead of `styled-components`:

```tsx
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;
const Title = styled.Text`
  color: #000;
  text-align: center;
  font-size: 16px;
`;
export default () => (
  <Container>
    <Title>Hello</Title>
  </Container>
);
```

## Usage with Next.js

Usage with Next.js is a little different because we need to apply the React Native aliases manually, this can be done via `@expo/webpack-config` (which is in `@expo/next-adapter`).

- Add `@expo/next-adapter` to your project:

```sh
npx @expo/next-adapter
```

- Install the styled-components Babel plugin:

```sh
yarn add -D babel-plugin-styled-components
```

- Use the Babel plugin in your **babel.config.js** file:

```diff
module.exports = {
    presets: ['@expo/next-adapter/babel'],
+    plugins: [['styled-components', { 'ssr': true }]]
};
```

- Now you can use `styled-components/native` just like you would in a regular Expo project!

## Considerations

### Tree-Shaking

Styled Components imports all of `react-native-web` which [breaks React Native web tree-shaking](https://github.com/styled-components/styled-components/pull/2797#issuecomment-574955289). This means your bundle size will be larger and include all of the components exported from `react-native-web`.

### Why styled-components/native

Technically you can use `styled-components` directly like this:

```diff
- import styled from 'styled-components/native';
+ import styled from 'styled-components';

- const Container = styled.View`
+ const Container = styled(View)`
    background-color: #fff;
`
```

But doing this in the browser will throw the error: `Warning: Using the "className" prop on <View> is deprecated.`.

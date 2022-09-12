/* eslint-env jest */
import JsonFile from '@expo/json-file';
import execa from 'execa';
import fs from 'fs/promises';
import klawSync from 'klaw-sync';
import path from 'path';

import { bin, execute, projectRoot, getRoot, setupTestProjectAsync } from './utils';

const originalForceColor = process.env.FORCE_COLOR;
const originalCI = process.env.CI;

beforeAll(async () => {
  await fs.mkdir(projectRoot, { recursive: true });
  process.env.FORCE_COLOR = '1';
  process.env.CI = '1';
});

afterAll(() => {
  process.env.FORCE_COLOR = originalForceColor;
  process.env.CI = originalCI;
});

it('runs `npx expo prebuild --help`', async () => {
  const results = await execute('prebuild', '--help');
  expect(results.stdout).toMatchInlineSnapshot(`
    "
          [1mDescription[22m
            Create native iOS and Android project files before building natively.

          [1mUsage[22m
            $ npx expo prebuild <dir>

          <dir> is the directory of the Expo project.
          Defaults to the current working directory.

          Options
          --no-install                             Skip installing npm packages and CocoaPods.
          --clean                                  Delete the native folders and regenerate them before applying changes
          --npm                                    Use npm to install dependencies. (default when Yarn is not installed)
          --template <template>                    Project template to clone from. File path pointing to a local tar file or a github repo
          -p, --platform <all|android|ios>         Platforms to sync: ios, android, all. Default: all
          --skip-dependency-update <dependencies>  Preserves versions of listed packages in package.json (comma separated list)
          -h, --help                               Output usage information

        "
  `);
});

it('runs `npx expo prebuild` asserts when expo is not installed', async () => {
  const projectName = 'basic-prebuild-assert-no-expo';
  const projectRoot = getRoot(projectName);
  // Create the project root aot
  await fs.mkdir(projectRoot, { recursive: true });
  // Create a fake package.json -- this is a terminal file that cannot be overwritten.
  await fs.writeFile(path.join(projectRoot, 'package.json'), '{ "version": "1.0.0" }');
  await fs.writeFile(path.join(projectRoot, 'app.json'), '{ "expo": { "name": "foobar" } }');

  await expect(execute('prebuild', projectName, '--no-install')).rejects.toThrowError(
    /Cannot determine which native SDK version your project uses because the module `expo` is not installed\. Please install it with `yarn add expo` and try again./
  );
});

it(
  'runs `npx expo prebuild`',
  async () => {
    const projectRoot = await setupTestProjectAsync('basic-prebuild', 'with-blank');
    // `npx expo prebuild --no-install`
    await execa('node', [bin, 'prebuild', '--no-install'], { cwd: projectRoot });

    // List output files with sizes for snapshotting.
    // This is to make sure that any changes to the output are intentional.
    // Posix path formatting is used to make paths the same across OSes.
    const files = klawSync(projectRoot)
      .map((entry) => {
        if (entry.path.includes('node_modules') || !entry.stats.isFile()) {
          return null;
        }
        return path.posix.relative(projectRoot, entry.path);
      })
      .filter(Boolean);

    const pkg = await JsonFile.readAsync(path.resolve(projectRoot, 'package.json'));

    // Deleted
    expect(pkg.main).not.toBeDefined();

    // Added new packages
    expect(Object.keys(pkg.dependencies).sort()).toStrictEqual([
      'expo',
      'expo-splash-screen',
      'expo-status-bar',
      'react',
      'react-dom',
      'react-native',
      'react-native-web',
    ]);

    // Updated scripts
    expect(pkg.scripts).toStrictEqual({
      android: 'expo run:android',
      ios: 'expo run:ios',
      start: 'expo start --dev-client',
    });

    // If this changes then everything else probably changed as well.
    expect(files).toMatchInlineSnapshot(`
      Array [
        "App.js",
        "android/app/BUCK",
        "android/app/build.gradle",
        "android/app/build_defs.bzl",
        "android/app/debug.keystore",
        "android/app/proguard-rules.pro",
        "android/app/src/debug/AndroidManifest.xml",
        "android/app/src/debug/java/com/example/minimal/ReactNativeFlipper.java",
        "android/app/src/main/AndroidManifest.xml",
        "android/app/src/main/java/com/example/minimal/MainActivity.java",
        "android/app/src/main/java/com/example/minimal/MainApplication.java",
        "android/app/src/main/res/drawable/splashscreen.xml",
        "android/app/src/main/res/mipmap-hdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png",
        "android/app/src/main/res/mipmap-mdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png",
        "android/app/src/main/res/mipmap-xhdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png",
        "android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png",
        "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png",
        "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png",
        "android/app/src/main/res/values/colors.xml",
        "android/app/src/main/res/values/strings.xml",
        "android/app/src/main/res/values/styles.xml",
        "android/app/src/main/res/values-night/colors.xml",
        "android/build.gradle",
        "android/gradle/wrapper/gradle-wrapper.jar",
        "android/gradle/wrapper/gradle-wrapper.properties",
        "android/gradle.properties",
        "android/gradlew",
        "android/gradlew.bat",
        "android/settings.gradle",
        "app.json",
        "index.js",
        "ios/Podfile",
        "ios/Podfile.properties.json",
        "ios/basicprebuild/AppDelegate.h",
        "ios/basicprebuild/AppDelegate.m",
        "ios/basicprebuild/Images.xcassets/AppIcon.appiconset/Contents.json",
        "ios/basicprebuild/Images.xcassets/Contents.json",
        "ios/basicprebuild/Images.xcassets/SplashScreenBackground.imageset/Contents.json",
        "ios/basicprebuild/Images.xcassets/SplashScreenBackground.imageset/image.png",
        "ios/basicprebuild/Info.plist",
        "ios/basicprebuild/SplashScreen.storyboard",
        "ios/basicprebuild/Supporting/Expo.plist",
        "ios/basicprebuild/basicprebuild-Bridging-Header.h",
        "ios/basicprebuild/basicprebuild.entitlements",
        "ios/basicprebuild/main.m",
        "ios/basicprebuild/noop-file.swift",
        "ios/basicprebuild.xcodeproj/project.pbxproj",
        "ios/basicprebuild.xcodeproj/project.xcworkspace/contents.xcworkspacedata",
        "ios/basicprebuild.xcodeproj/project.xcworkspace/xcshareddata/IDEWorkspaceChecks.plist",
        "ios/basicprebuild.xcodeproj/project.xcworkspace/xcuserdata/brentvatne.xcuserdatad/UserInterfaceState.xcuserstate",
        "ios/basicprebuild.xcodeproj/xcshareddata/xcschemes/basicprebuild.xcscheme",
        "metro.config.js",
        "package.json",
        "yarn.lock",
      ]
    `);
  },
  // Could take 45s depending on how fast npm installs
  60 * 1000
);

import { getPackageJson, PackageJSONConfig } from '@expo/config';
import JsonFile from '@expo/json-file';
import * as PackageManager from '@expo/package-manager';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import * as Log from '../log';
import { hashForDependencyMap } from '../prebuild/updatePackageJson';
import { ensureDirectoryAsync } from './dir';
import { EXPO_DEBUG } from './env';
import { logNewSection } from './ora';

const PROJECT_PREBUILD_SETTINGS = '.expo/prebuild';
const CACHED_PACKAGE_JSON = 'cached-packages.json';

function getTempPrebuildFolder(projectRoot: string) {
  return path.join(projectRoot, PROJECT_PREBUILD_SETTINGS);
}

type PackageChecksums = {
  dependencies: string;
  devDependencies: string;
};

function hasNewDependenciesSinceLastBuild(projectRoot: string, packageChecksums: PackageChecksums) {
  // TODO: Maybe comparing lock files would be better...
  const templateDirectory = getTempPrebuildFolder(projectRoot);
  const tempPkgJsonPath = path.join(templateDirectory, CACHED_PACKAGE_JSON);
  if (!fs.existsSync(tempPkgJsonPath)) {
    return true;
  }
  const { dependencies, devDependencies } = JsonFile.read(tempPkgJsonPath);
  // Only change the dependencies if the normalized hash changes, this helps to reduce meaningless changes.
  const hasNewDependencies = packageChecksums.dependencies !== dependencies;
  const hasNewDevDependencies = packageChecksums.devDependencies !== devDependencies;

  return hasNewDependencies || hasNewDevDependencies;
}

function createPackageChecksums(pkg: PackageJSONConfig): PackageChecksums {
  return {
    dependencies: hashForDependencyMap(pkg.dependencies || {}),
    devDependencies: hashForDependencyMap(pkg.devDependencies || {}),
  };
}

export async function hasPackageJsonDependencyListChangedAsync(projectRoot: string) {
  const pkg = getPackageJson(projectRoot);

  const packages = createPackageChecksums(pkg);
  const hasNewDependencies = hasNewDependenciesSinceLastBuild(projectRoot, packages);

  // Cache package.json
  await ensureDirectoryAsync(getTempPrebuildFolder(projectRoot));
  const templateDirectory = path.join(getTempPrebuildFolder(projectRoot), CACHED_PACKAGE_JSON);
  await JsonFile.writeAsync(templateDirectory, packages);

  return hasNewDependencies;
}

export async function installCocoaPodsAsync(projectRoot: string) {
  let step = logNewSection('Installing CocoaPods...');
  if (process.platform !== 'darwin') {
    step.succeed('Skipped installing CocoaPods because operating system is not on macOS.');
    return false;
  }

  const packageManager = new PackageManager.CocoaPodsPackageManager({
    cwd: path.join(projectRoot, 'ios'),
    silent: !EXPO_DEBUG,
  });

  if (!(await packageManager.isCLIInstalledAsync())) {
    try {
      // prompt user -- do you want to install cocoapods right now?
      step.text = 'CocoaPods CLI not found in your PATH, installing it now.';
      step.stopAndPersist();
      await PackageManager.CocoaPodsPackageManager.installCLIAsync({
        nonInteractive: true,
        spawnOptions: {
          ...packageManager.options,
          // Don't silence this part
          stdio: ['inherit', 'inherit', 'pipe'],
        },
      });
      step.succeed('Installed CocoaPods CLI.');
      step = logNewSection('Running `pod install` in the `ios` directory.');
    } catch (e) {
      step.stopAndPersist({
        symbol: '⚠️ ',
        text: chalk.red('Unable to install the CocoaPods CLI.'),
      });
      if (e instanceof PackageManager.CocoaPodsError) {
        Log.log(e.message);
      } else {
        Log.log(`Unknown error: ${e.message}`);
      }
      return false;
    }
  }

  try {
    await packageManager.installAsync({ spinner: step });
    // Create cached list for later
    await hasPackageJsonDependencyListChangedAsync(projectRoot).catch(() => null);
    step.succeed('Installed pods and initialized Xcode workspace.');
    return true;
  } catch (e) {
    step.stopAndPersist({
      symbol: '⚠️ ',
      text: chalk.red('Something went wrong running `pod install` in the `ios` directory.'),
    });
    if (e instanceof PackageManager.CocoaPodsError) {
      Log.log(e.message);
    } else {
      Log.log(`Unknown error: ${e.message}`);
    }
    return false;
  }
}

import { DeviceEventEmitter, NativeModules, EventSubscription } from 'react-native';

export type BuildInfo = {
  appIcon?: string;
  appVersion?: string;
  hostUrl?: string;
  appName?: string;
  sdkVersion?: string;
  runtimeVersion?: string;
};

export type DevSettings = {
  isDebuggingRemotely?: boolean;
  isElementInspectorShown?: boolean;
  isHotLoadingEnabled?: boolean;
  isPerfMonitorShown?: boolean;
};

const DevMenu = NativeModules.ExpoDevMenuInternal;

export async function dispatchCallableAsync(
  callableId: string,
  args: object | null = null
): Promise<void> {
  return await DevMenu.dispatchCallableAsync(callableId, args);
}

export function hideMenu(): void {
  DevMenu.hideMenu();
}

export function subscribeToCloseEvents(listener: () => void): EventSubscription {
  return DeviceEventEmitter.addListener('closeDevMenu', listener);
}

export function subscribeToOpenEvents(listener: () => void): EventSubscription {
  return DeviceEventEmitter.addListener('openDevMenu', listener);
}

export function openDevMenuFromReactNative() {
  DevMenu.openDevMenuFromReactNative();
}

export async function navigateToLauncherAsync(): Promise<void> {
  return await dispatchCallableAsync('backToLauncher');
}

export async function togglePerformanceMonitorAsync() {
  return await dispatchCallableAsync('performance-monitor');
}

export async function toggleElementInspectorAsync() {
  return await dispatchCallableAsync('inspector');
}

export async function reloadAsync() {
  return await dispatchCallableAsync('reload');
}

export async function toggleDebugRemoteJSAsync() {
  return await dispatchCallableAsync('remote-debug');
}

export async function toggleFastRefreshAsync() {
  return await dispatchCallableAsync('fast-refresh');
}

export async function getDevSettingsAsync(): Promise<DevSettings> {
  return await DevMenu.getDevSettingsAsync();
}

export async function getBuildInfoAsync(): Promise<BuildInfo> {
  return await DevMenu.getBuildInfoAsync();
}

export async function copyToClipboardAsync(content: string) {
  return await DevMenu.copyToClipboardAsync(content);
}

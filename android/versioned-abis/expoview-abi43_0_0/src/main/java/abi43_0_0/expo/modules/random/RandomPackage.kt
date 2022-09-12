package abi43_0_0.expo.modules.random

import abi43_0_0.com.facebook.react.ReactPackage
import abi43_0_0.com.facebook.react.bridge.ReactApplicationContext
import abi43_0_0.com.facebook.react.bridge.NativeModule
import abi43_0_0.com.facebook.react.uimanager.ViewManager

class RandomPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
    listOf(RandomModule(reactContext))

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    emptyList()
}

package abi43_0_0.expo.modules.screenorientation

import android.content.Context
import abi43_0_0.expo.modules.core.BasePackage

class ScreenOrientationPackage : BasePackage() {
  override fun createExportedModules(context: Context) = listOf(ScreenOrientationModule(context))
}

// Copyright 2015-present 650 Industries. All rights reserved.
package abi43_0_0.host.exp.exponent

import android.content.Context
import android.view.ContextThemeWrapper
import host.exp.expoview.R
import abi43_0_0.host.exp.exponent.modules.api.components.gesturehandler.react.RNGestureHandlerEnabledRootView

class ReactUnthemedRootView(context: Context?) : RNGestureHandlerEnabledRootView(
  ContextThemeWrapper(
    context,
    R.style.Theme_Exponent_None
  )
)

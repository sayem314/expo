package expo.modules.ads.facebook;

import android.content.Context;

import com.facebook.ads.MediaView;

import expo.modules.core.ViewManager;

public class AdIconViewManager extends ViewManager {
  @Override
  public String getName() {
    return "AdIconView";
  }

  @Override
  public MediaView createViewInstance(Context context) {
    return new MediaView(context);
  }

  @Override
  public ViewManagerType getViewManagerType() {
    return ViewManagerType.SIMPLE;
  }
}

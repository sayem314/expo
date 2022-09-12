package abi43_0_0.expo.modules.facedetector;

import android.content.Context;

import abi43_0_0.expo.modules.core.BasePackage;
import abi43_0_0.expo.modules.core.ExportedModule;
import abi43_0_0.expo.modules.core.interfaces.InternalModule;

import java.util.Collections;
import java.util.List;

public class FaceDetectorPackage extends BasePackage {
  @Override
  public List<InternalModule> createInternalModules(Context context) {
    return Collections.singletonList((InternalModule) new ExpoFaceDetectorProvider());
  }

  @Override
  public List<ExportedModule> createExportedModules(Context reactContext) {
    return Collections.singletonList((ExportedModule) new FaceDetectorModule(reactContext));
  }
}

package abi43_0_0.expo.modules.intentlauncher.exceptions;

import abi43_0_0.expo.modules.core.interfaces.CodedThrowable;
import abi43_0_0.expo.modules.core.errors.CodedException;

public class ActivityAlreadyStartedException extends CodedException implements CodedThrowable {
  public ActivityAlreadyStartedException() {
    super("IntentLauncher activity is already started. You need to wait for its result before starting another activity.");
  }

  @Override
  public String getCode() {
    return "E_ACTIVITY_ALREADY_STARTED";
  }
}

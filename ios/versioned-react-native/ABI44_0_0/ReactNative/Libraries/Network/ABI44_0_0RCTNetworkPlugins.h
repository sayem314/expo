/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated by an internal plugin build system
 */

#ifdef ABI44_0_0RN_DISABLE_OSS_PLUGIN_HEADER

// FB Internal: FBABI44_0_0RCTNetworkPlugins.h is autogenerated by the build system.
#import <ABI44_0_0React/ABI44_0_0FBABI44_0_0RCTNetworkPlugins.h>

#else

// OSS-compatibility layer

#import <Foundation/Foundation.h>

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wreturn-type-c-linkage"

#ifdef __cplusplus
extern "C" {
#endif

// ABI44_0_0RCTTurboModuleManagerDelegate should call this to resolve module classes.
Class ABI44_0_0RCTNetworkClassProvider(const char *name);

// Lookup functions
Class ABI44_0_0RCTNetworkingCls(void) __attribute__((used));
Class ABI44_0_0RCTDataRequestHandlerCls(void) __attribute__((used));
Class ABI44_0_0RCTFileRequestHandlerCls(void) __attribute__((used));
Class ABI44_0_0RCTHTTPRequestHandlerCls(void) __attribute__((used));

#ifdef __cplusplus
}
#endif

#pragma GCC diagnostic pop

#endif // ABI44_0_0RN_DISABLE_OSS_PLUGIN_HEADER

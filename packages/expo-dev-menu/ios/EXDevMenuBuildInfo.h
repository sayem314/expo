// Copyright 2015-present 650 Industries. All rights reserved.
#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>

NS_ASSUME_NONNULL_BEGIN

@interface EXDevMenuBuildInfo : NSObject

+ (NSDictionary *)getBuildInfoForBridge:(RCTBridge *)bridge andManifest:(NSDictionary *)manifest;

@end

NS_ASSUME_NONNULL_END

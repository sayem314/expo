//  Copyright © 2021 650 Industries. All rights reserved.

#import <ABI43_0_0EXManifests/ABI43_0_0EXManifestsManifest.h>
#import <ABI43_0_0EXManifests/ABI43_0_0EXManifestsBaseLegacyManifest.h>

NS_ASSUME_NONNULL_BEGIN

@interface ABI43_0_0EXManifestsBareManifest : ABI43_0_0EXManifestsBaseLegacyManifest<ABI43_0_0EXManifestsManifestBehavior>

/**
* A UUID for this manifest.
*/
- (NSString *)rawId;
- (NSNumber *)commitTimeNumber;
- (nullable NSDictionary *)metadata;
- (nullable NSArray *)assets;

@end

NS_ASSUME_NONNULL_END

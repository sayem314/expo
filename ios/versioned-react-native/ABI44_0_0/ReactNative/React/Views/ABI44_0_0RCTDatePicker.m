/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "ABI44_0_0RCTDatePicker.h"

#import <Availability.h>
#import <AvailabilityInternal.h>

#import "ABI44_0_0RCTUtils.h"
#import "ABI44_0_0UIView+React.h"

#ifndef __IPHONE_14_0
#define __IPHONE_14_0 140000
#endif // __IPHONE_14_0

#ifndef ABI44_0_0RCT_IOS_14_0_SDK_OR_LATER
#define ABI44_0_0RCT_IOS_14_0_SDK_OR_LATER (__IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_14_0)
#endif // ABI44_0_0RCT_IOS_14_0_SDK_OR_LATER

@interface ABI44_0_0RCTDatePicker ()

@property (nonatomic, copy) ABI44_0_0RCTBubblingEventBlock onChange;
@property (nonatomic, assign) NSInteger ABI44_0_0ReactMinuteInterval;

@end

@implementation ABI44_0_0RCTDatePicker

- (instancetype)initWithFrame:(CGRect)frame
{
  if ((self = [super initWithFrame:frame])) {
    [self addTarget:self action:@selector(didChange) forControlEvents:UIControlEventValueChanged];
    _ABI44_0_0ReactMinuteInterval = 1;

#if ABI44_0_0RCT_IOS_14_0_SDK_OR_LATER
    if (@available(iOS 14, *)) {
      self.preferredDatePickerStyle = UIDatePickerStyleWheels;
    }
#endif // ABI44_0_0RCT_IOS_14_0_SDK_OR_LATER
  }
  return self;
}

ABI44_0_0RCT_NOT_IMPLEMENTED(-(instancetype)initWithCoder : (NSCoder *)aDecoder)

- (void)didChange
{
  if (_onChange) {
    _onChange(@{@"timestamp" : @(self.date.timeIntervalSince1970 * 1000.0)});
  }
}

- (void)setDatePickerMode:(UIDatePickerMode)datePickerMode
{
  [super setDatePickerMode:datePickerMode];
  // We need to set minuteInterval after setting datePickerMode, otherwise minuteInterval is invalid in time mode.
  self.minuteInterval = _ABI44_0_0ReactMinuteInterval;
}

- (void)setMinuteInterval:(NSInteger)minuteInterval
{
  [super setMinuteInterval:minuteInterval];
  _ABI44_0_0ReactMinuteInterval = minuteInterval;
}

@end

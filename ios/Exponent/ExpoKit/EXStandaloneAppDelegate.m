// Copyright 2015-present 650 Industries. All rights reserved.

#import <ExpoModulesCore/EXModuleRegistryProvider.h>

#import "ExpoKit.h"
#import "EXStandaloneViewController.h"
#import "EXStandaloneAppDelegate.h"

@interface EXStandaloneAppDelegate ()

@property (nonatomic, strong) EXViewController *rootViewController;

@end

@implementation EXStandaloneAppDelegate

@synthesize window = _window;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([application applicationState] != UIApplicationStateBackground) {
    // App launched in foreground
    [self _setUpUserInterfaceForApplication:application withLaunchOptions:launchOptions];
  }

  [super application:application didFinishLaunchingWithOptions:launchOptions];

  return YES;
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
  [self _setUpUserInterfaceForApplication:application withLaunchOptions:nil];

  [super applicationWillEnterForeground:application];
}

- (void)_setUpUserInterfaceForApplication:(UIApplication *)application withLaunchOptions:(nullable NSDictionary *)launchOptions
{
  if (_window) {
    return;
  }
  [[ExpoKit sharedInstance] registerRootViewControllerClass:[EXStandaloneViewController class]];
  [[ExpoKit sharedInstance] prepareWithLaunchOptions:launchOptions];

  _window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  _window.backgroundColor = [UIColor whiteColor];
  _rootViewController = [ExpoKit sharedInstance].rootViewController;
  _window.rootViewController = _rootViewController;

  [_window makeKeyAndVisible];
}

@end

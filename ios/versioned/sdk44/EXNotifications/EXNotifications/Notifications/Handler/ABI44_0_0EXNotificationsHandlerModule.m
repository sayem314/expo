// Copyright 2018-present 650 Industries. All rights reserved.

#import <ABI44_0_0EXNotifications/ABI44_0_0EXNotificationsHandlerModule.h>
#import <ABI44_0_0EXNotifications/ABI44_0_0EXNotificationSerializer.h>
#import <ABI44_0_0EXNotifications/ABI44_0_0EXNotificationCenterDelegate.h>

#import <ABI44_0_0ExpoModulesCore/ABI44_0_0EXEventEmitterService.h>

@interface ABI44_0_0EXNotificationsHandlerModule ()

@property (nonatomic, weak) id<ABI44_0_0EXNotificationCenterDelegate> notificationCenterDelegate;

@property (nonatomic, assign) BOOL isListening;
@property (nonatomic, assign) BOOL isBeingObserved;

@property (nonatomic, weak) id<ABI44_0_0EXEventEmitterService> eventEmitter;

@property (nonatomic, strong) NSMutableDictionary<NSString *, ABI44_0_0EXSingleNotificationHandlerTask *> *tasksMap;

@end

@implementation ABI44_0_0EXNotificationsHandlerModule

ABI44_0_0EX_EXPORT_MODULE(ExpoNotificationsHandlerModule);

- (instancetype)init
{
  if (self = [super init]) {
    _tasksMap = [NSMutableDictionary dictionary];
  }
  return self;
}

# pragma mark - Exported methods

ABI44_0_0EX_EXPORT_METHOD_AS(handleNotificationAsync,
                    handleNotificationAsync:(NSString *)identifier withBehavior:(NSDictionary *)behavior resolver:(ABI44_0_0EXPromiseResolveBlock)resolve rejecter:(ABI44_0_0EXPromiseRejectBlock)reject)
{
  ABI44_0_0EXSingleNotificationHandlerTask *task = _tasksMap[identifier];
  if (!task) {
    NSString *message = [NSString stringWithFormat:@"Failed to handle notification %@, it has already been handled.", identifier];
    return reject(@"ERR_NOTIFICATION_HANDLED", message, nil);
  }
  NSError *error = [task handleResponse:behavior];
  if (error) {
    return reject(error.userInfo[@"code"], error.userInfo[@"message"], error);
  } else {
    resolve(nil);
  }
}

# pragma mark - ABI44_0_0EXModuleRegistryConsumer

- (void)setModuleRegistry:(ABI44_0_0EXModuleRegistry *)moduleRegistry
{
  _eventEmitter = [moduleRegistry getModuleImplementingProtocol:@protocol(ABI44_0_0EXEventEmitterService)];
  _notificationCenterDelegate = [moduleRegistry getSingletonModuleForName:@"NotificationCenterDelegate"];
}

# pragma mark - ABI44_0_0EXEventEmitter

- (NSArray<NSString *> *)supportedEvents
{
  return [ABI44_0_0EXSingleNotificationHandlerTask eventNames];
}

- (void)startObserving
{
  [self setIsBeingObserved:YES];
}

- (void)stopObserving
{
  [self setIsBeingObserved:NO];
}

- (void)setIsBeingObserved:(BOOL)isBeingObserved
{
  _isBeingObserved = isBeingObserved;
  BOOL shouldListen = _isBeingObserved;
  if (shouldListen && !_isListening) {
    [_notificationCenterDelegate addDelegate:self];
    _isListening = YES;
  } else if (!shouldListen && _isListening) {
    [_notificationCenterDelegate removeDelegate:self];
    _isListening = NO;
  }
}

# pragma mark - ABI44_0_0EXNotificationsDelegate

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
  ABI44_0_0EXSingleNotificationHandlerTask *task = [[ABI44_0_0EXSingleNotificationHandlerTask alloc] initWithEventEmitter:_eventEmitter
                                                                                           notification:notification
                                                                                      completionHandler:completionHandler
                                                                                               delegate:self];
  [_tasksMap setObject:task forKey:task.identifier];
  [task start];
}

# pragma mark - ABI44_0_0EXSingleNotificationHandlerTaskDelegate

- (void)taskDidFinish:(ABI44_0_0EXSingleNotificationHandlerTask *)task
{
  [_tasksMap removeObjectForKey:task.identifier];
}

@end

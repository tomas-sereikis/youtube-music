#import "RNAudioPlayerURL.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation RNAudioPlayerURL

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initWithURL:(NSString *) url) {
  if (!([url length] > 0)) return;
  
  NSURL *soundUrl;
  if ([url hasPrefix:@"http"]) {
    soundUrl = [[NSURL alloc] initWithString:url];
  } else {
    soundUrl = [[NSURL alloc] initFileURLWithPath:url];
  }
  
  self.audioItem = [AVPlayerItem playerItemWithURL:soundUrl];
  self.audioPlayer = [AVPlayer playerWithPlayerItem:self.audioItem];
  self.lastCurrentTime = -1;
  
  [self bindPlayerItemDidReachEndListener];
  [self bindPlayerItemStatusChanged];
  [self bindPeriodicTimeObserverForInterval];
  [self bindPlayerItemDuration];
}

- (void)bindPlayerItemDidReachEndListener {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(playerItemDidReachEnd:)
                                               name:AVPlayerItemDidPlayToEndTimeNotification
                                             object:self.audioItem];
}

- (void)playerItemDidReachEnd:(NSNotification *) notification {
  [self.audioItem seekToTime:kCMTimeZero];
  [self sendAppEvent:@"finished" atValue:@""];
}

- (void) bindPlayerItemStatusChanged {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(playerItemStatusChanged:)
                                               name:AVPlayerItemTimeJumpedNotification
                                             object:self.audioItem];
}

- (void)playerItemStatusChanged:(NSNotification *) notification {
  NSString *status = [NSString stringWithFormat:@"%ld", (long)self.audioItem.status];
  [self sendAppEvent:@"status" atValue:status];
}

- (void) bindPeriodicTimeObserverForInterval {
  __weak typeof(self) weakSelf = self;
  CMTime interval = CMTimeMakeWithSeconds(1.0, NSEC_PER_SEC);
  self.timeObserver = [self.audioPlayer addPeriodicTimeObserverForInterval:interval
                                                                     queue:nil
                                                                usingBlock:
                       ^(CMTime time) {
                         [weakSelf periodicTimeObserverForInterval];
                       }];
}

- (void)periodicTimeObserverForInterval {
  long currentTime = (long) self.audioPlayer.currentTime.value / 1000000000;
  if (currentTime != self.lastCurrentTime) {
    NSString *time = [NSString stringWithFormat:@"%ld", currentTime];
    [self sendAppEvent:@"time" atValue:time];
    self.lastCurrentTime = currentTime;
  }
}

- (void) bindPlayerItemDuration {
  while(self.audioItem.status != AVPlayerItemStatusReadyToPlay) {
  }
  float duration = CMTimeGetSeconds(self.audioItem.duration);
  [self sendAppEvent:@"duration" atValue:@(duration).stringValue];
}

- (void) sendAppEvent: (NSString *) name atValue: (NSString *) value {
  [self.bridge.eventDispatcher sendAppEventWithName:@"AudioPlayer" body:@{@"event": name,
                                                                          @"value": value}];
}

RCT_EXPORT_METHOD(destroy) {
  [self.audioPlayer removeTimeObserver:self.timeObserver];
}

RCT_EXPORT_METHOD(play){
  [self.audioPlayer play];
}

RCT_EXPORT_METHOD(pause){
  [self.audioPlayer pause];
}

RCT_EXPORT_METHOD(seekToTime:(nonnull NSNumber *)toTime){
  [self.audioPlayer seekToTime: CMTimeMakeWithSeconds([toTime floatValue], NSEC_PER_SEC)];
}

@end

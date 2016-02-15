//
//  RNIdleTime.swift
//  Youtube Music
//
//  Created by Tomas Sereikis on 02/02/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

import Foundation

@objc(RNIdleTimer)
class RNIdleTimer: NSObject {
  @objc
  func enable() {
    UIApplication.sharedApplication().idleTimerDisabled = false;
  }
  
  @objc
  func disable() {
    UIApplication.sharedApplication().idleTimerDisabled = true;
  }
}

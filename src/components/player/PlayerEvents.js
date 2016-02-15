'use strict';

import forEach from 'lodash/collection/forEach';
import React from 'react-native';
import NativeModules from 'NativeModules';

var {NativeAppEventEmitter} = React;

const EVENT_AUDIO_PLAYER = 'AudioPlayer';
const EVENT_FINISHED = 'finished';
const EVENT_STATUS = 'status';
const EVENT_TIME = 'time';
const EVENT_DURATION = 'duration';

function subscribe() {
  var onPlayerStatus = [];
  var onPlayTime = [];
  var onFinished = [];
  var onDuration = [];

  var subscriber = NativeAppEventEmitter.addListener(EVENT_AUDIO_PLAYER, e => {
    if (e.event === EVENT_STATUS) forEach(onPlayerStatus, cb => cb(e.value));
    if (e.event === EVENT_TIME) forEach(onPlayTime, cb => cb(Number.parseInt(e.value)));
    if (e.event === EVENT_FINISHED) forEach(onFinished, cb => cb(e.value));
    if (e.event === EVENT_DURATION) forEach(onDuration, cb => cb(Number.parseInt(e.value)));
  });

  return {
    addPlayerStatusListener: callback => onPlayerStatus.push(callback),
    addPlayTimeListener: callback => onPlayTime.push(callback),
    addOnFinishedListener: callback => onFinished.push(callback),
    addOnDurationListener: callback => onDuration.push(callback),
    destroy: () => subscriber.remove()
  };
}

export default {
  subscribe
};
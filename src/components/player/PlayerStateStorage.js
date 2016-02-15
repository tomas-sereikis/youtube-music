'use strict';

import JsonStorage from '../../services/JsonStorage';
import Config from '../../Config';

/**
 * Get current player state
 * @returns {Promise}
 */
function getState() {
  return JsonStorage.getItem(Config.PLAYER_STORAGE_KEY);
}

/**
 * Save current player state
 * @param videoId
 * @param time
 * @returns {Promise}
 */
function setState(videoId, time = 0) {
  return JsonStorage.setItem(Config.PLAYER_STORAGE_KEY, {videoId, time});
}

export default {
  getState,
  setState
};
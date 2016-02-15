'use strict';

import AsyncStorage from 'AsyncStorage';
import Config from '../../Config';

export default {
  /**
   * Get or get token
   * @param [token]
   * @returns {Promise.<string|null>}
   */
  token(token = null) {
    if (token) {
      return AsyncStorage.setItem(Config.AUTHORIZATION_STORAGE_KEY, token)
        .then(e => token);
    } else {
      return AsyncStorage.getItem(Config.AUTHORIZATION_STORAGE_KEY);
    }
  },

  /**
   * Destroy session token
   * @returns {Promise}
   */
  destroy() {
    return AsyncStorage.removeItem(Config.AUTHORIZATION_STORAGE_KEY);
  }
};
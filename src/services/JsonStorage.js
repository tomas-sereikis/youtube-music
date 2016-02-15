'use strict';

import AsyncStorage from 'AsyncStorage';

/**
 * @param key
 * @param value
 * @returns {Promise}
 */
function setItem(key, value) {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param key
 * @param [whenEmpty]
 * @returns {Promise}
 */
function getItem(key, whenEmpty = function () { return null; }) {
  return AsyncStorage.getItem(key).then(content => {
    if (content !== null) return JSON.parse(content);
    return whenEmpty();
  });
}

function removeItem(key) {
  return AsyncStorage.removeItem(key);
}

export default {
  setItem,
  getItem,
  removeItem
};
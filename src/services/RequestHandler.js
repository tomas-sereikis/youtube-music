'use strict';

/**
 * Convert response to json response with promise reject when status is not from 2xx
 * @param response
 * @returns {Promise}
 */
function errorResponseHandler(response) {
  var {status} = response;
  if (status >= 200 && status < 300) {
    return response.json();
  } else {
    return response.json().then(err => Promise.reject(err));
  }
}

/**
 * Make a get request
 * @param {string} url
 * @param {Object} [options]
 * @returns {*}
 */
function get(url, options = {}) {
  return fetch(url, options)
    .then(errorResponseHandler);
}

export default {
  get
};
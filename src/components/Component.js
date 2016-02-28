'use strict';

import assign from 'lodash/object/assign';
import forEach from 'lodash/collection/forEach';
import React from 'react-native';

export default class Component extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
    this.isComponentMounted = false;
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  /**
   * @returns {boolean}
   */
  isMounted() {
    return this.isComponentMounted;
  }

  /**
   * @param {string} ref
   */
  getRef(ref) {
    return this.refs[ref];
  }

  /**
   * @param {Object} state
   * @param {Function} [callback]
   * @returns {Promise}
   */
  setAsyncState(state, callback) {
    return new Promise(resolve => {
      super.setState(state, function () {
        resolve();
        callback && callback();
      });
    });
  }

  /**
   * @param {Object} obj
   */
  setInitialState(obj) {
    assign(this.state, obj);
  }
}
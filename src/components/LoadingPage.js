'use strict';

import React from 'react-native';
import Component from './Component';
import View from 'View';
import Positions from '../styles/Positions';
import Loading from './Loading';

export default class LoadingPage extends Component {
  constructor(...args) {
    super(...args);
    this.setInitialState({loading: true});
  }

  /**
   * Set loading callback promise
   * @param {Promise} loadingPromise
   */
  setLoadingPromise(loadingPromise) {
    var loadedSuccess = this.setState.bind(this, {loading: false, loadedStatus: true});
    var loadedError = this.setState.bind(this, {loading: false, loadedStatus: false});
    loadingPromise.then(loadedSuccess, loadedError);
  }

  /**
   * Set loading status
   * @param {boolean} loading
   */
  setLoading(loading) {
    this.setState({loading});
  }

  /**
   * @returns {XML}
   */
  render() {
    var {loading, loadedStatus} = this.state;
    if (!loading) {
      return loadedStatus ? this.renderSuccess() : this.renderError();
    } else {
      return (
        <View style={Positions.CONTAINER_CENTER}>
          <Loading />
        </View>
      );
    }
  }
}
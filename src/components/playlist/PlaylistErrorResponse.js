'use strict';

import AuthorizationStorage from '../authorization/AuthorizationStorage';
import Router from '../../services/Router';
import * as es_US from '../../translates/en_US';

/**
 * Handle on login button press
 */
function handleOnLoginPress() {
  AuthorizationStorage.destroy();
  Router.push('initial');
}

export default {
  handle(error) {
    if (error.code === 401) {
      AuthorizationStorage.destroy();
      return Router.push('initial');
    }
  }
};
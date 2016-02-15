'use strict';

import * as en_US from '../../translates/en_US';
import React from 'react-native';
import View from 'View';
import WebViewBridge from 'react-native-webview-bridge';
import querystring from 'querystring';
import Config from '../../Config';
import AuthorizationStorage from './AuthorizationStorage';
import Positions from '../../styles/Positions';
import Router from '../../services/Router';
import Component from '../Component';

export default class AuthorizationComponent extends Component {
  static toRoute() {
    return {
      title: en_US.AUTHORIZATION_COMPONENT_TITLE,
      component: AuthorizationComponent,
      leftButtonTitle: en_US.BACK,
      onLeftButtonPress() {
        Router.pop();
      }
    };
  };

  /**
   * @param {string} code
   * @returns {Promise}
   */
  getAccessTokenRequest(code) {
    var requestUri = `https://accounts.google.com/o/oauth2/token`;
    var grantType = 'authorization_code';
    var clientId = Config.GOOGLE_AUTH_CLIENT_ID;
    var redirectUri = Config.GOOGLE_AUTH_REDIRECT_URI;
    return fetch(requestUri, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: querystring.stringify({code, client_id: clientId, redirect_uri: redirectUri, grant_type: grantType})
    }).then(response => response.json());
  }

  /**
   * @returns {string}
   */
  getAuthorizationUrl() {
    return [
      `https://accounts.google.com/o/oauth2/v2/auth?`,
      `scope=${Config.GOOGLE_AUTH_SCOPE}&`,
      `redirect_uri=${Config.GOOGLE_AUTH_REDIRECT_URI}&`,
      `response_type=code&`,
      `access_type=offline&`,
      `client_id=${Config.GOOGLE_AUTH_CLIENT_ID}`
    ].join('');
  }

  /**
   * @param {string} message
   */
  handleOnBridgeMessage(message) {
    var match = message.match(/Success code=(.*)/);
    if (match) {
      this.getAccessTokenRequest(match[1])
        .then(response => AuthorizationStorage.token(response.access_token))
        .then(() => Router.push('playlist'));
    }
  }

  /**
   * @returns {string}
   */
  injectScript() {
    return `
      function webViewBridgeReady(cb) {
        if (window.WebViewBridge) {
          cb(window.WebViewBridge);
          return;
        }

        document.addEventListener('WebViewBridge', handler, false);
        function handler() {
          document.removeEventListener('WebViewBridge', handler, false);
          cb(window.WebViewBridge);
        }
      }

      webViewBridgeReady(function(bridge) {
        bridge.send(document.title);
      });
    `;
  }

  /**
   * @returns {XML}
   */
  render() {
    return (
      <View style={Positions.CONTAINER_STRETCH}>
        <WebViewBridge
          injectedJavaScript={this.injectScript()}
          onBridgeMessage={this.handleOnBridgeMessage.bind(this)}
          url={this.getAuthorizationUrl()}
          style={Positions.FLEX} />
      </View>
    );
  }
}
'use strict';

import React from 'react-native';
import NavigatorIOS from 'NavigatorIOS';
import StatusBarIOS from 'StatusBarIOS';
import IconSources from './services/IconSources';
import InitialComponent from './components/initial/InitialComponent';
import PlayerListComponent from './components/player/PlayerListComponent';
import PlaylistComponent from './components/playlist/PlaylistComponent';
import PlaylistItemComponent from './components/playlist/PlaylistItemComponent';
import AuthorizationComponent from './components/authorization/AuthorizationComponent';
import AuthorizationStorage from './components/authorization/AuthorizationStorage';
import LoadingPage from './components/LoadingPage';
import Router from './services/Router';

StatusBarIOS.setStyle('light-content');
Router.addComponent('initial', InitialComponent);
Router.addComponent('playlist', PlaylistComponent);
Router.addComponent('playlistItem', PlaylistItemComponent);
Router.addComponent('authorization', AuthorizationComponent);
Router.addComponent('player', PlayerListComponent);

export default class MainContainer extends LoadingPage {
  constructor(props, ...options) {
    super(props, ...options);
    this.setLoadingPromise(this.authorization());
  }

  /**
   * @returns {Promise}
   */
  authorization() {
    return AuthorizationStorage.token().then(token => {
      Router.setInitialComponent(token ? 'playlist' : 'initial');
      return IconSources.waitForConvert;
    });
  }

  /**
   * @returns {XML}
   */
  renderSuccess() {
    return <NavigatorIOS
      ref={e => Router.setNavigator(e)}
      {...Router.getNavigatorProps()} />;
  }
}
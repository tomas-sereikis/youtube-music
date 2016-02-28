'use strict';

import lastOf from '../../services/unit/lastOf';
import * as en_US from '../../translates/en_US';
import React from 'react-native';
import AuthorizationStorage from '../authorization/AuthorizationStorage';
import Positions from '../../styles/Positions';
import PlaylistRequest from './PlaylistRequest';
import ListView from 'ListView';
import ListViewRow from '../listView/ListViewRow';
import ContentCentred from '../ContentCentred';
import PlaylistErrorResponse from './PlaylistErrorResponse';
import Router from '../../services/Router';
import LoadingPage from '../LoadingPage';
import View from 'View';
import IconSources from '../../services/IconSources';

export default class PlaylistComponent extends LoadingPage {
  static toRoute() {
    return {
      title: en_US.PLAYLIST_COMPONENT_TITLE,
      component: PlaylistComponent,
      leftButtonIcon: IconSources.getIcon('SignOut'),
      rightButtonIcon: IconSources.getIcon('Player'),
      onLeftButtonPress() {
        AuthorizationStorage.destroy();
        Router.push('initial');
      },
      onRightButtonPress() {
        Router.push('player');
      }
    };
  };

  constructor(props, ...options) {
    super(props, ...options);
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setInitialState({content: [], sources: this.dataSource.cloneWithRows([])});
    this.setLoadingPromise(this.playlistContent());
  }

  /**
   * @returns {Promise}
   */
  playlistContent() {
    return PlaylistRequest.getPlaylist().then(content => {
      var sources = this.dataSource.cloneWithRows(content);
      if (content.length) {
        return this.setAsyncState({content, sources});
      } else {
        return Promise.reject();
      }
    }, err => {
      PlaylistErrorResponse.handle(err.error);
      this.setState({content: []});
      return Promise.reject();
    });
  }

  /**
   * @param {Object} content
   * @returns {XML}
   */
  renderRow(content) {
    var {id, title, publishedAt, thumbnail: image} = content;
    var last = lastOf(content, this.state.content);
    var subtitle = publishedAt.fromNow();
    var onPress = () => Router.push('playlistItem', {title, id});
    var props = {last, title, subtitle, image, onPress};
    return <ListViewRow {...props} />;
  }

  /**
   * @returns {XML}
   */
  renderSuccess() {
    return (
      <View style={Positions.CONTAINER_STRETCH}>
        <ListView
          pageSize={12}
          dataSource={this.state.sources}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }

  /**
   * @returns {XML}
   */
  renderError() {
    return <ContentCentred text={en_US.PLAYLIST_COMPONENT_NO_PLAYLIST_CONTENT} />;
  }
}
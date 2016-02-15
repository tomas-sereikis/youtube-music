'use strict';

import lastOf from '../../services/unit/lastOf';
import * as en_US from '../../translates/en_US';
import React from 'react-native';
import View from 'View';
import Positions from '../../styles/Positions';
import PlaylistRequest from './PlaylistRequest';
import PlayerListComponent from '../player/PlayerListComponent';
import PlaylistErrorResponse from './PlaylistErrorResponse';
import LoadingPage from '../LoadingPage';
import ListView from 'ListView';
import ListViewRow from '../listView/ListViewRow';
import ContentCentred from '../ContentCentred';
import Router from '../../services/Router';
import TitleParser from '../../services/TitleParser';

export default class PlaylistItemComponent extends LoadingPage {
  static propTypes = {
    id: React.PropTypes.string.isRequired
  };

  /**
   * @param {string} title
   * @param {string} id
   * @returns {*}
   */
  static toRoute({title, id}) {
    return {
      title,
      component: PlaylistItemComponent,
      leftButtonTitle: en_US.BACK,
      onLeftButtonPress() {
        Router.pop()
      },
      rightButtonTitle: en_US.PLAYER,
      onRightButtonPress() {
        Router.push('player');
      },
      passProps: {id}
    };
  }

  constructor(props, ...options) {
    super(props, ...options);
    this.id = props.id;
    this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setInitialState({content: [], sources: this.dataSource.cloneWithRows([])});
    this.setLoadingPromise(this.playlistContent());
  }

  /**
   * when component mounts get playlist item content
   */
  playlistContent() {
    return PlaylistRequest.getPlaylistItem(this.id).then(content => {
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
   * @param content
   * @returns {XML}
   */
  renderRow(content) {
    var {title, thumbnail: image} = content;
    var parsed = TitleParser.parse(title);
    var last = lastOf(content, this.state.content);
    var onPress = () => Router.push('playlistVideo', {content});
    var props = {title: parsed.artist, subtitle: parsed.title, last, image, onPress};
    return <ListViewRow {...props} />;
  }

  /**
   * @returns {XML}
   */
  renderSuccess() {
    var {sources} = this.state;
    return (
      <View style={Positions.CONTAINER_STRETCH}>
        <ListView
          pageSize={12}
          dataSource={sources}
          renderRow={this.renderRow.bind(this)} />
      </View>
    );
  }

  /**
   * @returns {XML}
   */
  renderError() {
    return <ContentCentred text={en_US.PLAYLIST_ITEM_COMPONENT_NO_CONTENT} />;
  }
}
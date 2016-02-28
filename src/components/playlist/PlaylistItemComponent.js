'use strict';

import lastOf from '../../services/unit/lastOf';
import * as en_US from '../../translates/en_US';
import React from 'react-native';
import View from 'View';
import Positions from '../../styles/Positions';
import PlaylistRequest from './PlaylistRequest';
import PlayerListComponent from '../player/PlayerListComponent';
import PlaylistErrorResponse from './PlaylistErrorResponse';
import PlaylistItemRowComponent from './PlaylistItemRowComponent';
import LoadingPage from '../LoadingPage';
import ListView from 'ListView';
import ContentCentred from '../ContentCentred';
import Router from '../../services/Router';
import TitleParser from '../../services/TitleParser';
import IconSources from '../../services/IconSources';

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
      leftButtonIcon: IconSources.getIcon('Back'),
      onLeftButtonPress() {
        Router.pop()
      },
      rightButtonIcon: IconSources.getIcon('Player'),
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
      if (content.length) {
        return content;
      } else {
        return Promise.reject();
      }
    }, err => {
      PlaylistErrorResponse.handle(err.error);
      this.setState({content: []});
      return Promise.reject();
    }).then(this.updateContentState.bind(this));
  }

  updateContentState(content) {
    this.content = content;
    this.sources = this.dataSource.cloneWithRows(content);
    return this.setAsyncState({content, sources: this.sources});
  }

  /**
   * @param content
   * @returns {XML}
   */
  renderRow(content) {
    var parsed = TitleParser.parse(content.title);
    var props = {
      videoId: content.videoId,
      title: parsed.artist,
      subtitle: parsed.title,
      downloaded: content.downloaded,
      last: lastOf(content, this.state.content),
      thumbnail: content.thumbnail,
      thumbnailHigh: content.thumbnailHigh
    };

    return <PlaylistItemRowComponent {...props}  />;
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
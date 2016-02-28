'use strict';

import * as en_US from '../../translates/en_US';
import lastOf from '../../services/unit/lastOf';
import isEqual from 'lodash/lang/isEqual';
import first from 'lodash/array/first';
import React from 'react-native';
import Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TouchableOpacity from 'TouchableOpacity';
import View from 'View';
import Text from 'Text';
import StyleSheet from 'StyleSheet';
import ListView from 'ListView';
import LinkingIOS from 'LinkingIOS';
import ActionSheetIOS from 'ActionSheetIOS';
import Colors from '../../styles/Colors';
import Positions from '../../styles/Positions';
import StorageHandler from '../../services/StorageHandler';
import PlayerComponent from './PlayerComponent';
import ContentCentred from '../ContentCentred';
import PlayerStateStorage from './PlayerStateStorage';
import TitleParser from '../../services/TitleParser';
import Router from '../../services/Router';
import Component from '../Component';
import ListViewRow from '../listView/ListViewRow';
import ListViewRowStyle from '../listView/ListViewRowStyle';
import IconSources from '../../services/IconSources';

var styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    padding: 5,
    paddingRight: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_300
  },
  listViewContainer: {
    flex: 1
  },
  playerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
});

/**
 * @param {Object} current
 * @param {Array.<Object>} collection
 * @param {number} cursor
 * @returns {Object}
 */
function moveArrayCursor(current, collection, cursor) {
  var currentItemIndex = collection.indexOf(current);
  if (currentItemIndex !== -1) {
    if (collection[currentItemIndex + cursor]) {
      return collection[currentItemIndex + cursor];
    } else if (cursor === 1) {
      return collection[0];
    } else {
      return collection[collection.length - 1];
    }
  }
}

/**
 * Get number in range
 * @param {number} scroll
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function ranged(scroll, min, max) {
  return scroll < min ? 0 : scroll > max ? max : scroll;
}

export default class PlayerListComponent extends Component {
  static toRoute() {
    return {
      title: en_US.PLAYER_LIST_COMPONENT_TITLE,
      component: PlayerListComponent,
      leftButtonIcon: IconSources.getIcon('Back'),
      onLeftButtonPress() {
        Router.pop();
      }
    }
  }

  constructor(props, ...options) {
    super(props, ...options);
    this.dataSource = new ListView.DataSource({rowHasChanged: isEqual});
    this.state.loading = true;
    this.setContent([]);
  }

  componentDidMount() {
    super.componentDidMount();
    var playerState;
    return PlayerStateStorage.getState().then(state => {
      playerState = state;
      return this.updateDataSource();
    }).then(content => {
      if (playerState === null) {
        this.play(first(content));
      } else {
        this.play(this.getTrackWithVideoId(playerState.videoId));
        this.getRef('player').seekToTime(playerState.time);
      }
    });
  }

  componentWillUnmount() {
    if (!this.getCurrentTrack()) return;
    PlayerStateStorage.setState(
      this.getCurrentTrack().videoId,
      this.getRef('player').getCurrentPlayTime()
    );
  }

  /**
   * @returns {Object}
   */
  getCurrentTrack() {
    return this.state.current;
  }

  /**
   * @param {Object} current
   */
  setCurrentTrack(current) {
    var audioUrl = StorageHandler.videoPath(current.videoId);
    this.setState({current, audioUrl});
  }

  /**
   * @param {string} videoId
   * @returns {Object}
   */
  getTrackWithVideoId(videoId) {
    return this.getContent().find(item => item.videoId === videoId);
  }

  /**
   * @param {string} videoId
   * @returns {boolean}
   */
  hasTrackWithVideoId(videoId) {
    return this.getContent().some(item => item.videoId === videoId);
  }

  /**
   * @returns {string}
   */
  getCurrentAudioUrl() {
    return this.state.audioUrl;
  }

  /**
   * @returns {Array.<Object>}
   */
  getContent() {
    return this.state.content;
  }

  /**
   * @param {Array.<Object>} content
   */
  setContent(content) {
    var sources = this.dataSource.cloneWithRows(content);
    if (this.isMounted()) {
      return this.setAsyncState({sources, content});
    } else {
      this.state.sources = sources;
      this.state.content = content;
      return Promise.resolve();
    }
  }

  /**
   * Update current date source with new from storage
   * @returns {Promise}
   */
  updateDataSource() {
    var previousVideoId;
    var nextVideoId;

    var nextPlayTrack = moveArrayCursor(this.getCurrentTrack(), this.getContent(), 1);
    if (nextPlayTrack) nextVideoId = nextPlayTrack.videoId;
    if (this.getCurrentTrack()) previousVideoId = this.getCurrentTrack().videoId;

    return StorageHandler.getVideos()
      .then(this.setContent.bind(this))
      .then(() => {
        this.setState({loading: false});
        if (this.hasTrackWithVideoId(previousVideoId)) {
          this.play(this.getTrackWithVideoId(previousVideoId));
        } else if (previousVideoId) {
          this.play(this.getTrackWithVideoId(nextVideoId));
        }
        return this.getContent();
      });
  }

  /**
   * Move currently selected track index
   * @param {number} cursor
   */
  playCursor(cursor) {
    var track = moveArrayCursor(this.getCurrentTrack(), this.getContent(), cursor);
    if (track) {
      this.play(track, true);
    }
  }

  /**
   * When player layout dispatches save player height
   * @param event
   */
  handleOnPlayerLayoutChange(event) {
    var {height} = event.nativeEvent.layout;
    this.setState({playerHeight: height});
    this.adjustScroll();
  }

  /**
   * When list layout dispatches save player height
   * @param event
   */
  handleOnWrapperLayoutChange(event) {
    var {height} = event.nativeEvent.layout;
    this.setState({wrapperHeight: height});
    this.adjustScroll();
  }

  /**
   * @param {Object} item
   */
  handleOnMoreActionPress(item) {
    var {current} = this.state;
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        en_US.DELETE,
        en_US.CANCEL,
        en_US.OPEN_IN_YOUTUBE
      ],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1
    }, buttonIndex => {
      var {videoId} = item;
      if (buttonIndex === 0) {
        StorageHandler.removeVideoContent(videoId)
          .then(StorageHandler.unlink(StorageHandler.thumbnailPath(videoId)))
          .then(StorageHandler.unlink(StorageHandler.videoPath(videoId)))
          .then(this.updateDataSource.bind(this));
      } else if (buttonIndex === 2) {
        LinkingIOS.openURL(`http://youtu.be/${videoId}`);
      }
    });
  }

  /**
   * @param {Object} current
   * @param {boolean} scrollAnimation
   */
  play(current, scrollAnimation = false) {
    this.setCurrentTrack(current);
    this.setContent(this.getContent());
    this.adjustScroll(scrollAnimation);
  }

  /**
   * @param {boolean} scrollAnimation
   */
  adjustScroll(scrollAnimation = false) {
    var {wrapperHeight, playerHeight} = this.state;
    var length = this.getContent().length;
    var scrollResponder = this.getRef('listView').getScrollResponder();
    if (wrapperHeight && playerHeight) {
      var indexOf = this.getContent().indexOf(this.getCurrentTrack());
      var listSize = (wrapperHeight - playerHeight);
      var totalListSize = length * ListViewRow.ITEM_SIZE;
      var totalVisibleItems = (wrapperHeight - playerHeight) / ListViewRow.ITEM_SIZE;
      var totalVisibleSize = totalVisibleItems * ListViewRow.ITEM_SIZE;
      var totalMaxScroll = totalListSize - totalVisibleSize;
      scrollResponder.scrollTo(ranged(indexOf * ListViewRow.ITEM_SIZE, 0, totalMaxScroll > 0 ? totalMaxScroll : 0));
    }
  }

  /**
   * @param {Object} content
   * @returns {Object}
   */
  getRowItemMapped(content) {
    var {title, artist: subtitle} = TitleParser.parse(content.title);
    var currentVideoId;
    if (this.getCurrentTrack()) currentVideoId = this.getCurrentTrack().videoId;
    return {
      title, subtitle,
      last: lastOf(content, this.state.content),
      image: StorageHandler.thumbnailPath(content.videoId),
      selected: content.videoId === currentVideoId,
      actions: [this.renderListItemOption(this.handleOnMoreActionPress.bind(this, content))],
      onPress: this.play.bind(this, content)
    };
  }

  /**
   * @param {Function} onPress
   * @returns {XML}
   */
  renderListItemOption(onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={ListViewRowStyle.BUTTON}>
          <Ionicons color={Colors.TEAL_500} size={24} name='android-more-vertical' />
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * @returns {XML}
   */
  renderRow(content) {
    return <ListViewRow {...this.getRowItemMapped(content)} />;
  }

  /**
   * @returns {XML|undefined}
   */
  renderPlayer() {
    if (!this.getCurrentAudioUrl()) return;
    return (
      <View style={styles.playerContainer}>
        <PlayerComponent
          ref='player'
          onLayout={this.handleOnPlayerLayoutChange.bind(this)}
          onFinished={this.playCursor.bind(this, 1)}
          onPrevPress={this.playCursor.bind(this, -1)}
          onNextPress={this.playCursor.bind(this, 1)}
          title={this.getCurrentTrack().title}
          audioUrl={this.getCurrentAudioUrl()} />
      </View>
    );
  }

  /**
   * @returns {XML}
   */
  renderListView() {
    var {sources, playerHeight: paddingTop} = this.state;
    return (
      <View
        onLayout={this.handleOnWrapperLayoutChange.bind(this)}
        style={Positions.CONTAINER_STRETCH}>
        <ListView
          ref='listView'
          style={{paddingTop}}
          dataSource={sources}
          renderRow={this.renderRow.bind(this)} />
        {this.renderPlayer()}
      </View>
    );
  }

  /**
   * @returns {XML}
   */
  render() {
    var {loading} = this.state;
    if (!loading) {
      return this.getContent().length === 0
        ? <ContentCentred text={en_US.PLAYER_LIST_COMPONENT_NO_CONTENT} />
        : this.renderListView();
    } else {
      return <ContentCentred element={<Progress.CircleSnail size={40} color={[Colors.TEAL_500]} thickness={2} />} />;
    }
  }
}
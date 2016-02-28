'use strict';

import * as en_US from '../../translates/en_US';
import isUndefined from 'lodash/lang/isUndefined';
import React from 'react-native';
import Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TouchableOpacity from 'TouchableOpacity';
import AlertIOS from 'AlertIOS';
import View from 'View';
import NativeModules from 'NativeModules';
import PlaylistRequest from './PlaylistRequest';
import Component from '../Component';
import ListViewRow from '../listView/ListViewRow';
import ListViewRowStyle from '../listView/ListViewRowStyle';
import Colors from '../../styles/Colors';
import StorageHandler from '../../services/StorageHandler';

var {RNAudioPlayerURL} = NativeModules;

// audio url errors
const errors = new Map();

export default class PlaylistItemRowComponent extends Component {
  static propTypes = {
    videoId: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    subtitle: React.PropTypes.string.isRequired,
    last: React.PropTypes.bool.isRequired,
    downloaded: React.PropTypes.bool.isRequired,
    thumbnail: React.PropTypes.string.isRequired,
    thumbnailHigh: React.PropTypes.string.isRequired
  };

  constructor(props, ...args) {
    super(props, ...args);
    this.setInitialState({error: errors.has(props.videoId)});
  }

  /**
   * On press download button
   */
  onPress() {
    this.getAudioUrl().then(
      this.onAudioUrlReceived.bind(this),
      this.onAudioUrlFailed.bind(this)
    );
  }

  /**
   * On download progress changed
   * @param e
   */
  onDownloadProgress(e) {
    this.setState({progress: e.progress});
  }

  /**
   * On audio download success
   */
  onSuccessFileDownload() {
    this.setState({downloaded: true});
  }

  /**
   * On audio url got when pressing download button
   * @param audioUrl
   */
  onAudioUrlReceived(audioUrl) {
    var {videoId, thumbnailHigh, title, subtitle} = this.props;
    var track = `${title} - ${subtitle}`;

    StorageHandler.downloadVideo(audioUrl, videoId, this.onDownloadProgress.bind(this))
      .then(() => StorageHandler.downloadThumbnail(thumbnailHigh, videoId))
      .then(() => StorageHandler.setVideoContent(videoId, {title: track, videoId}))
      .then(this.onSuccessFileDownload.bind(this));
  }

  /**
   * On audio url failed when pressing download button
   */
  onAudioUrlFailed() {
    var {videoId} = this.props;
    this.setState({error: true});
    errors.set(videoId, true);

    // alert user that this track is not available
    AlertIOS.alert(
      en_US.ERROR,
      en_US.PLAYLIST_VIDEO_COMPONENT_NOT_AVAILABLE
    );
  }

  /**
   * On press in list item
   */
  onPressIn() {
    this.activePlay = true;
    this.setState({previewMode: 1});
    this.getAudioUrl().then(
      this.onQuickPreview.bind(this),
      this.onQuickPreviewError.bind(this)
    );
  }

  /**
   * On press out list item
   */
  onPressOut() {
    this.setState({previewMode: undefined});
    this.activePlay = false;
    if (this.activePlayStarted) {
      RNAudioPlayerURL.pause();
      RNAudioPlayerURL.destroy();
      this.activePlayStarted = false;
    }
  }

  /**
   * On quick preview start
   * @param audioUrl
   */
  onQuickPreview(audioUrl) {
    if (this.activePlay) {
      RNAudioPlayerURL.initWithURL(audioUrl);
      RNAudioPlayerURL.play();
      this.activePlayStarted = true;
    }
  }

  /**
   * On quick preview error
   */
  onQuickPreviewError() {
    var {videoId} = this.props;
    if (this.activePlay) {
      errors.set(videoId, true);
      this.setState({previewMode: 2, error: true});
    }
  }

  /**
   * Get audio url
   * @returns {Promise.<string>}
   */
  getAudioUrl() {
    var {videoId} = this.props;
    if (!this.audioUrl) this.audioUrl = PlaylistRequest.getAudioUrl(videoId);
    return this.audioUrl;
  }

  /**
   * @returns {[]}
   */
  getActionsList() {
    var {state} = this;
    var {downloaded} = this.props;
    var {error, progress, previewMode} = state;
    var isDownloaded = state.downloaded || downloaded;
    if (previewMode) {
      return [this.renderPreviewMode()];
    } else if (!isDownloaded && !error && isUndefined(progress)) {
      return [this.renderDownloadButton()];
    } else if (!isDownloaded && !isUndefined(progress)) {
      return [this.renderDownloadingProgress()];
    }
  }

  /**
   * @returns {XML}
   */
  renderDownloadingProgress() {
    var {progress} = this.state;
    return (
      <View style={ListViewRowStyle.BUTTON} key={0}>
        <Progress.Circle size={24} progress={progress / 100} color={Colors.TEAL_500} thickness={2} />
      </View>
    );
  }

  /**
   * @returns {XML}
   */
  renderPreviewMode() {
    var {previewMode} = this.state;
    if (previewMode === 1) {
      return (
        <View style={ListViewRowStyle.BUTTON} key={0}>
          <Ionicons name='ios-musical-notes' size={24} color={Colors.TEAL_500}/>
        </View>
      );
    } else if (previewMode === 2) {
      return (
        <View style={ListViewRowStyle.BUTTON} key={0}>
          <Ionicons name='sad-outline' size={24} color={Colors.RED_500}/>
        </View>
      );
    }
  }

  /**
   * @returns {XML}
   */
  renderDownloadButton() {
    return (
      <TouchableOpacity onPress={this.onPress.bind(this)} key={0}>
        <View style={ListViewRowStyle.BUTTON}>
          <Ionicons name='ios-download-outline' size={24} color={Colors.TEAL_500} />
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * @returns {XML}
   */
  render() {
    var props = this.props;
    return <ListViewRow
      {...props}
      image={props.thumbnail}
      onPress={() => null}
      onPressIn={this.onPressIn.bind(this)}
      onPressOut={this.onPressOut.bind(this)}
      actions={this.getActionsList()} />;
  }
}
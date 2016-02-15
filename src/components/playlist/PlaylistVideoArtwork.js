'use strict';

import * as en_US from '../../translates/en_US';
import isUndefined from 'lodash/lang/isUndefined';
import React from 'react-native';
import View from 'View';
import Component from '../Component';
import ArtworkContainer from '../artwork/ArtworkComponent';
import Button from '../buttons/Button';
import Positions from '../../styles/Positions';
import TransparentView from '../TransparentView';
import StorageHandler from '../../services/StorageHandler';

export default class PlaylistVideoArtwork extends Component {
  static propTypes = {
    image: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    videoId: React.PropTypes.string.isRequired,
    audioUrl: React.PropTypes.string
  };

  constructor(props, ...args) {
    super(props, args);
    this.setInitialState({artwork: {}, button: {}});
    StorageHandler.getVideoContent(props.videoId)
      .then(res => this.setState({isDownloaded: res !== null}));
  }

  handleOnLayoutArtwork(event) {
    var {layout: artwork} = event.nativeEvent;
    this.setState({artwork});
  }

  handleOnLayoutButton(event) {
    var {layout: button} = event.nativeEvent;
    this.setState({button});
  }

  handleOnFileDownloadClick() {
    var {audioUrl, image, videoId, title} = this.props;
    StorageHandler.downloadVideo(audioUrl, videoId, this.handleOnDownloadProgress.bind(this))
      .then(e => StorageHandler.downloadThumbnail(image, videoId))
      .then(e => StorageHandler.setVideoContent(videoId, {title, videoId}))
      .then(this.handleOnSuccessFileDownload.bind(this));
  }

  handleOnDownloadProgress(e) {
    this.setState({progress: e.progress});
  }

  handleOnSuccessFileDownload() {

  }

  /**
   * @param {number|undefined} height
   * @returns {number}
   */
  haftSizeOf(height) {
    return height ? height / 2 : 0;
  }

  getButtonLabel() {
    var {progress, isDownloaded} = this.state;
    if (isDownloaded || progress === 100) {
      return en_US.VIDEO_DOWNLOADED;
    } else if (isUndefined(progress)) {
      return en_US.VIDEO_DOWNLOAD;
    } else {
      return en_US.VIDEO_DOWNLOADING(progress);
    }
  }

  /**
   * @returns {XML}
   */
  renderDownloadButton() {
    var {button, artwork, isDownloaded, progress} = this.state;
    var {audioUrl} = this.props;
    var position = 'absolute';
    var buttonHaftSize = this.haftSizeOf(button.height);
    var artworkHaftSize = this.haftSizeOf(artwork.height);
    var top = artworkHaftSize ? artworkHaftSize - buttonHaftSize : 0;
    if (audioUrl) {
      return (
        <TransparentView style={[{position, top, left: 0, right: 0}]}>
          <TransparentView style={Positions.CENTER}>
            <Button
              title={this.getButtonLabel()}
              disabled={isDownloaded || !isUndefined(progress)}
              onLayout={this.handleOnLayoutButton.bind(this)}
              onPress={this.handleOnFileDownloadClick.bind(this)}/>
          </TransparentView>
        </TransparentView>
      );
    }
  }

  /**
   * @returns {XML}
   */
  render() {
    return (
      <View style={Positions.RELATIVE}>
        <ArtworkContainer
          image={this.props.image}
          onLayout={this.handleOnLayoutArtwork.bind(this)} />
        {this.renderDownloadButton()}
      </View>
    );
  }
}
'use strict';

import * as en_US from '../../translates/en_US';
import React from 'react-native';
import View from 'View';
import Text from 'Text';
import Colors from '../../styles/Colors';
import Positions from '../../styles/Positions';
import PlaylistRequest from './PlaylistRequest';
import PlaylistVideoArtwork from './PlaylistVideoArtwork';
import TransparentView from '../TransparentView';
import Router from '../../services/Router';
import Component from '../Component';
import GlobalStyles from '../../styles/GlobalStyles';

export default class PlaylistVideoComponent extends Component {
  static propTypes = {
    content: React.PropTypes.object.isRequired
  };

  /**
   * @param {Object} content
   * @returns {*}
   */
  static toRoute({content}) {
    return {
      title: en_US.PLAYLIST_VIDEO_COMPONENT_TITLE,
      component: PlaylistVideoComponent,
      leftButtonTitle: en_US.BACK,
      onLeftButtonPress() {
        Router.pop();
      },
      rightButtonTitle: en_US.PLAYER,
      onRightButtonPress() {
        Router.push('player');
      },
      passProps: {content}
    };
  }

  constructor(props, ...options) {
    super(props, ...options);
    this.content = props.content;
  }

  componentDidMount() {
    super.componentDidMount();
    var {videoId} = this.content;
    this.audioUrl = PlaylistRequest.getAudioUrl(videoId);
    this.audioUrl.then(
      res => this.setState({audioUrl: res}),
      err => this.handleOnDownloadLinkError(err)
    );
  }

  handleOnDownloadLinkError() {
    this.setState({isError: true});
  }

  renderLinkError() {
    if (this.state.isError) {
      return (
        <TransparentView style={{padding: 10}}>
          <Text style={Positions.TEXT_CENTER}>
            {en_US.PLAYLIST_VIDEO_COMPONENT_NOT_AVAILABLE}
          </Text>
        </TransparentView>
      );
    }
  }

  render() {
    var padding = {padding: 10};
    return (
      <View style={Positions.FLEX}>
        <View style={Positions.CONTAINER_STRETCH}>
          <PlaylistVideoArtwork
            image={this.content.thumbnailHigh}
            title={this.content.title}
            videoId={this.content.videoId}
            audioUrl={this.state.audioUrl} />
          <TransparentView style={[Positions.FLEX, padding]}>
            <Text style={GlobalStyles.H1} numberOfLines={1}>{this.content.title}</Text>
            <Text style={GlobalStyles.H2} numberOfLines={9}>{this.content.description}</Text>
          </TransparentView>
          {this.renderLinkError()}
        </View>
      </View>
    );
  }
}
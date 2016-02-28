'use strict';

import debounce from 'lodash/function/debounce';
import React from 'react-native';
import Progress from 'react-native-progress/CircleSnail';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TouchableOpacity from 'TouchableOpacity';
import StyleSheet from 'StyleSheet';
import View from 'View';
import Text from 'Text';
import NativeModules from 'NativeModules';
import Slider from 'react-native-slider';
import Positions from '../../styles/Positions';
import Colors from '../../styles/Colors';
import TransparentView from '../TransparentView';
import PlayerEvents from './PlayerEvents';
import Component from '../Component';

var {RNAudioPlayerURL, RNIdleTimer} = NativeModules;

var styles = StyleSheet.create({
  player: {
    backgroundColor: Colors.TEAL_500
  },
  playerSlider: {
    marginTop: -20
  },
  playerTitle: {
    fontWeight: '500',
    textAlign: 'center',
    padding: 5,
    color: Colors.WHITE
  },
  playerTime: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontSize: 12
  }
});

export default class PlayerComponent extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    audioUrl: React.PropTypes.string.isRequired,
    onFinished: React.PropTypes.func,
    onNextPress: React.PropTypes.func,
    onPrevPress: React.PropTypes.func,
    onLayout: React.PropTypes.func
  };

  constructor(props, ...options) {
    super(props, ...options);
    this.setInitialState({isPlaying: false, playTime: 0, playStatus: 0});
    this.audioPlayer(props.audioUrl);
  }

  componentDidMount() {
    super.componentDidMount();
    this.subscriber = PlayerEvents.subscribe();
    this.subscriber.addPlayerStatusListener(this.playerStatus.bind(this));
    this.subscriber.addPlayTimeListener(e => this.playTime(e));
    this.subscriber.addOnFinishedListener(this.handleOnFinished.bind(this));
    this.subscriber.addOnDurationListener(playDuration => this.setState({playDuration}));
  }

  playerStatus = debounce(status => {
    this.setState({playStatus: Number.parseInt(status)});
    this.lockSlider(false);
  }, 10);

  audioPlayer(audioUrl) {
    if (this.audioPlay) {
      RNAudioPlayerURL.destroy();
      this.audioPlay = false;
    }
    RNAudioPlayerURL.initWithURL(audioUrl);
    this.audioPlay = true;
  }

  componentWillUnmount() {
    RNAudioPlayerURL.pause();
    this.subscriber.destroy();
  }

  /**
   * @param {Object} newProps
   */
  componentDidUpdate(newProps) {
    if (this.props.audioUrl !== newProps.audioUrl) {
      var {isPlaying} = this.state;
      this.lockSlider();
      this.audioPlayer(this.props.audioUrl);
      this.setState({playTime: 0});
      if (isPlaying) RNAudioPlayerURL.play();
    }
  }

  /**
   * @param {number} playTime
   */
  playTime(playTime) {
    if (!this.sliderLocked) {
      this.setState({playTime})
    }
  }

  /**
   * @returns {number}
   */
  getCurrentPlayTime() {
    return this.state.playTime;
  }

  /**
   * @param {number} value
   */
  seekToTime(value) {
    RNAudioPlayerURL.seekToTime(value);
  }

  handleOnFinished() {
    if (this.props.onFinished) {
      if (this.props.onFinished() === false) {
        this.setState({isPlaying: false});
      }
    } else {
      this.setState({isPlaying: false});
    }
  }

  handleOnPlayPress() {
    this.setState({isPlaying: true});
    RNAudioPlayerURL.play();
    RNIdleTimer.disable();
  }

  handleOnPausePress() {
    this.setState({isPlaying: false});
    RNAudioPlayerURL.pause();
    RNIdleTimer.enable();
  }

  /**
   * @param {boolean} sliderLocked
   */
  lockSlider(sliderLocked = true) {
    this.sliderLocked = sliderLocked;
  }

  /**
   * @param {number} value
   */
  handleOnSlidingComplete(value) {
    this.lockSlider(false);
    this.seekToTime(value);
  }

  /**
   * @param {Function} callback
   */
  lockTillPlayStatus(callback) {
    this.lockSlider();
    callback();
  }

  /**
   * @returns {XML}
   */
  renderPlayerIcon() {
    var {isPlaying, playStatus} = this.state;
    var size = 55;
    if (!isPlaying) {
      return (
        <TouchableOpacity onPress={this.handleOnPlayPress.bind(this)}>
          <MaterialIcons size={size} color={Colors.WHITE} name='play-arrow' />
        </TouchableOpacity>
      );
    } else if (playStatus === 0) {
      return <Progress color={[Colors.GRAY_100]} size={size} thickness={2} />;
    } else {
      return (
        <TouchableOpacity onPress={this.handleOnPausePress.bind(this)}>
          <MaterialIcons size={size} color={Colors.WHITE} name='pause' />
        </TouchableOpacity>
      );
    }
  }

  /**
   * @returns {XML}
   */
  renderNextButton() {
    var {onNextPress} = this.props;
    if (onNextPress) {
      return (
        <TouchableOpacity onPress={this.lockTillPlayStatus.bind(this, onNextPress)}>
          <MaterialIcons size={40} color={Colors.WHITE} name='fast-forward' />
        </TouchableOpacity>
      );
    }
  }

  /**
   * @returns {XML}
   */
  renderPrevButton() {
    var {onPrevPress} = this.props;
    if (onPrevPress) {
      return (
        <TouchableOpacity onPress={this.lockTillPlayStatus.bind(this, onPrevPress)}>
          <MaterialIcons size={40} color={Colors.WHITE} name='fast-rewind' />
        </TouchableOpacity>
      );
    }
  }

  /**
   * @param {number} time
   * @returns {XML}
   */
  renderTileValue(time) {
    var MM = `0${Math.floor(time / 60)}`.slice(-2);
    var SS = `0${Math.floor(time % 60)}`.slice(-2);
    return (
      <View style={{width: 50}}>
        <Text style={styles.playerTime}>{MM}:{SS}</Text>
      </View>
    );
  }

  /**
   * @returns {XML}
   */
  renderPlayerActionsTop() {
    var padding = {padding: 10};
    var {playTime, playDuration} = this.state;
    return (
      <View style={[Positions.CENTER, {flexDirection: 'row'}]}>
        <View style={padding}>{this.renderTileValue(playTime)}</View>
        <View style={padding}>{this.renderPrevButton()}</View>
        <View style={padding}>{this.renderPlayerIcon()}</View>
        <View style={padding}>{this.renderNextButton()}</View>
        <View style={padding}>{this.renderTileValue(playDuration)}</View>
      </View>
    );
  }

  /**
   * @returns {XML}
   */
  render() {
    var {playDuration, playTime} = this.state;
    return (
      <TransparentView
        onLayout={this.props.onLayout}
        style={{position: 'relative', height: 104}}>
        <View style={styles.player}>
          <Text numberOfLines={1} style={styles.playerTitle}>{this.props.title}</Text>
          {this.renderPlayerActionsTop()}
        </View>
        <Slider
          style={styles.playerSlider}
          value={playTime}
          onSlidingStart={this.lockSlider.bind(this)}
          onSlidingComplete={this.handleOnSlidingComplete.bind(this)}
          maximumValue={playDuration}
          thumbTintColor={Colors.TEAL_900}
          minimumTrackTintColor={Colors.TEAL_700}
          maximumTrackTintColor={Colors.TEAL_600} />
      </TransparentView>
    );
  }
}
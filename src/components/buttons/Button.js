'use strict';

import React from 'react-native';
import View from 'View';
import Text from 'Text';
import TouchableOpacity from 'TouchableOpacity';
import BottomStyle from './ButtonStyle';

export default class Button extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    icon: React.PropTypes.element,
    disabled: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired,
    onLayout: React.PropTypes.func
  };

  handlerOnPress() {
    var {onPress} = this.props;
    setTimeout(onPress, 100);
  }

  /**
   * @returns {XML}
   */
  renderContent() {
    var stylesExtend = {};
    if (this.props.disabled) {
      stylesExtend = BottomStyle.DISABLED;
    }
    return (
      <View style={[BottomStyle.CONTAINER, stylesExtend]}>
        <Text style={BottomStyle.TEXT}>{this.props.title.toUpperCase()}</Text>
      </View>
    );
  }

  /**
   * @returns {XML}
   */
  render() {
    var {disabled} = this.props;
    if (!disabled) {
      return (
        <TouchableOpacity
          delayPressIn={0}
          activeOpacity={.6}
          onPress={this.handlerOnPress.bind(this)}
          onLayout={this.props.onLayout}>
          {this.renderContent()}
        </TouchableOpacity>
      );
    } else {
      return this.renderContent();
    }
  }
}
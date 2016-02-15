'use strict';

import React from 'react-native';
import View from 'View';
import Text from 'Text';
import Positions from '../styles/Positions';

export default class ContentCentred extends React.Component {
  static propTypes = {
    text: React.PropTypes.string,
    element: React.PropTypes.element
  };

  /**
   * @returns {XML}
   */
  renderText() {
    if (this.props.text) {
      return <Text style={Positions.TEXT_CENTER}>{this.props.text}</Text>;
    }
  }

  /**
   * @returns {XML}
   */
  renderElement() {
    if (this.props.element) {
      return this.props.element;
    }
  }

  /**
   * @returns {XML}
   */
  render() {
    return (
      <View style={Positions.CONTAINER_CENTER_WITH_PADDING}>
        {this.renderText()}
        {this.renderElement()}
      </View>
    );
  }
}
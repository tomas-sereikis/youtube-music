'use strict';

import React from 'react-native';
import View from 'View';
import Colors from '../styles/Colors';

export default class TransparentView extends React.Component {
  /**
   * @returns {XML}
   */
  render() {
    var backgroundColor = {backgroundColor: Colors.TRANSPARENT};
    return (
      <View
        style={[backgroundColor, this.props.style]}
        onLayout={this.props.onLayout}>
        {this.props.children}
      </View>
    );
  }
}
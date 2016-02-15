'use strict';

import React from 'react-native';
import Spinkit from 'react-native-spinkit';
import Colors from '../styles/Colors';

export default class Loading extends React.Component {
  static propTypes = {
    color: React.PropTypes.string,
    size: React.PropTypes.number
  };

  /**
   * Render loading component
   * @returns {XML}
   */
  render() {
    var {color, size} = this.props;
    return <Spinkit type='Arc' color={color || Colors.TEAL_500} size={size || 40} />;
  }
}
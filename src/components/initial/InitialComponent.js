'use strict';

import * as en_US from '../../translates/en_US';
import React from 'react-native';
import StyleSheet from 'StyleSheet';
import View from 'View';
import Text from 'Text';
import InitialStyle from './InitialStyle';
import Positions from '../../styles/Positions';
import Button from '../buttons/Button';
import Router from '../../services/Router';
import Component from '../Component';
import IconSources from '../../services/IconSources';

export default class InitialComponent extends Component {
  static toRoute() {
    return {
      title: en_US.INITIAL_COMPONENT_TITLE,
      component: InitialComponent,
      leftButtonTitle: ' ',
      rightButtonIcon: IconSources.getIcon('Player'),
      onRightButtonPress() {
        Router.push('player');
      }
    };
  };

  /**
   * Handle authorization button press
   */
  handleOnAuthorizationPress() {
    Router.push('authorization');
  }

  /**
   * @returns {XML}
   */
  render() {
    return (
      <View style={Positions.CONTAINER_CENTER_WITH_PADDING}>
        <Text style={InitialStyle.MESSAGE}>{en_US.INITIAL_COMPONENT_MESSAGE}</Text>
        <Button
          title={en_US.INITIAL_COMPONENT_AUTHORIZE_ACTION}
          onPress={this.handleOnAuthorizationPress.bind(this)} />
      </View>
    );
  }
}
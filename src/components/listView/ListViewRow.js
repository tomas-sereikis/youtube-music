'use strict';

import isArray from 'lodash/lang/isArray';
import map from 'lodash/collection/map';
import React, {PropTypes} from 'react-native';
import TouchableHighlight from 'TouchableHighlight';
import TouchableOpacity from 'TouchableOpacity';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../styles/Colors';
import Component from '../Component';
import ListViewRowStyle from './ListViewRowStyle';
import GlobalStyles from '../../styles/GlobalStyles';
import View from 'View';
import Image from 'Image';
import Text from 'Text';

export default class ListViewRow extends Component {
  static ITEM_SIZE = 56;
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    last: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    selected: PropTypes.bool,
    actions: PropTypes.array
  };

  /**
   * @returns {XML}
   */
  renderActions() {
    var {actions} = this.props;
    if (isArray(actions)) {
      return (
        <View>
          {map(actions, (component, index) => <View key={index}>{component}</View>)}
        </View>
      );
    }
  }

  /**
   * @returns {XML}
   */
  render() {
    var borderBottomWidth = {borderBottomWidth: this.props.last ? 0 : 1};
    var color = this.props.selected ? {color: Colors.TEAL_700} : {};
    return (
      <TouchableHighlight
        delayPressIn={0}
        underlayColor={Colors.GRAY_100}
        onPress={this.props.onPress}
        onPressIn={this.props.onPressIn}
        onPressOut={this.props.onPressOut}>
        <View style={[ListViewRowStyle.CONTAINER, borderBottomWidth]}>
          <Image source={{uri: this.props.image}} style={ListViewRowStyle.IMAGE} />
          <View style={ListViewRowStyle.CONTENT}>
            <Text style={[GlobalStyles.H1, color]} numberOfLines={1}>{this.props.title}</Text>
            <Text style={GlobalStyles.H2} numberOfLines={1}>{this.props.subtitle}</Text>
          </View>
          {this.renderActions()}
        </View>
      </TouchableHighlight>
    );
  }
}
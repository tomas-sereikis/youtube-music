'use strict';

import React from 'react-native';
import View from 'View';
import StyleSheet from 'StyleSheet';
import Dimensions from 'Dimensions';
import Image from 'Image';
import Positions from '../../styles/Positions';

var {width} = Dimensions.get('window');
var styles = StyleSheet.create({
  preview: {
    overflow: 'hidden',
    position: 'relative'
  },
  innerPreview: {
    position: 'absolute'
  },
  bottomShadow: {
    height: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .1)'
  }
});

export default class ArtworkComponent extends React.Component {
  static propTypes = {
    image: React.PropTypes.string.isRequired
  };

  render() {
    var x = 80;
    var y = 195 * x / 260;
    var imageWidth = width + (x * 2);
    var imageHeight = 195 * width / 260;
    var height = 195 * imageWidth / 260;
    var sizes = {height, width: imageWidth, left: -x, right: -x, top: -y, bottom: -y};
    return (
      <View
        style={[styles.preview, {height: imageHeight}]}
        onLayout={this.props.onLayout}>
        <View style={[styles.innerPreview, sizes]}>
          <Image
            style={Positions.FLEX}
            source={{uri: this.props.image}}
            resizeMode={Image.resizeMode.cover} />
        </View>
        <View style={styles.bottomShadow} />
      </View>
    );
  }
}
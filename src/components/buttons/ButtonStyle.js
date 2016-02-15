'use strict';

import StyleSheet from 'StyleSheet';
import Colors from '../../styles/Colors';

export default StyleSheet.create({
  CONTAINER: {
    flex: 1,
    borderColor: Colors.TEAL_500,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20
  },
  DISABLED: {
    opacity: .6
  },
  TEXT: {
    color: Colors.TEAL_500
  }
});
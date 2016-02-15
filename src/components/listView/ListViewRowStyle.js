'use strict';

import StyleSheet from 'StyleSheet';
import Colors from '../../styles/Colors';

export default StyleSheet.create({
  CONTAINER: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_200
  },
  IMAGE: {
    width: 60,
    height: 45,
    borderRadius: 2
  },
  CONTENT: {
    flex: 1,
    paddingLeft: 5,
    paddingTop: 4
  },
  BUTTON: {
    alignItems: 'center',
    padding: 11,
    paddingRight: 10
  }
});
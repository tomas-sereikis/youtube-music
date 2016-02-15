'use strict';

import Dimensions from 'Dimensions';

var {height, width} = Dimensions.get('window');

export default {
  FLEX: {
    flex: 1
  },
  ROW: {
    flexDirection: 'row'
  },
  RELATIVE: {
    position: 'relative'
  },
  CENTER: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  CONTAINER_CENTER_WITH_PADDING: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  CONTAINER_STRETCH: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  CONTAINER_CENTER: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TEXT_CENTER: {
    textAlign: 'center'
  }
};
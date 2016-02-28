'use strict';

import keys from 'lodash/object/keys';
import values from 'lodash/object/values';
import memoize from 'lodash/function/memoize';
import Ionicons from 'react-native-vector-icons/Ionicons';

let iconList = {
  Back: Ionicons.getImageSource('ios-arrow-back', 24, 'white'),
  Player: Ionicons.getImageSource('ios-musical-notes', 24, 'white'),
  SignOut: Ionicons.getImageSource('ios-person', 24, 'white')
};

let iconKeys = keys(iconList);
let iconStatic = {};

let waitForConvert = Promise.all(values(iconList)).then(function (converted) {
  for (let i = 0; i < iconKeys.length; i++) {
    iconStatic[iconKeys[i]] = converted[i];
  }
});

export default {
  waitForConvert,
  getIcon(name) {
    return iconStatic[name];
  }
};
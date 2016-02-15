'use strict';

import last from 'lodash/array/last';

export default function lastOf(item, collection) {
  return last(collection) === item;
}
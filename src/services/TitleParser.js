'use strict';

export default {
  parse(title) {
    var spited = title.split('-');
    if (spited.length === 2) {
      return {artist: spited[0].trim(), title: spited[1].trim()};
    }
    return {artist: 'No Artist', title: title};
  }
};
'use strict';

import map from 'lodash/collection/map';
import filter from 'lodash/collection/filter';
import moment from 'moment';

export default {
  /**
   * Transform response to valid entity
   * @param response
   */
  playlist(response) {
    return map(response.items, function (item) {
      return {
        id: item.id,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        publishedAt: moment(item.snippet.publishedAt),
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.default.url
      };
    });
  },

  /**
   * Transform response to valid entity
   * @param response
   */
  playlistItem(response) {
    var items = filter(response.items, item => item.snippet.hasOwnProperty('thumbnails'));
    return map(items, function (item) {
      var {thumbnails} = item.snippet;
      return {
        id: item.id,
        publishedAt: moment(item.snippet.publishedAt),
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: thumbnails.default.url,
        thumbnailHigh: thumbnails.high.url,
        videoId: item.snippet.resourceId.videoId
      };
    });
  }
};
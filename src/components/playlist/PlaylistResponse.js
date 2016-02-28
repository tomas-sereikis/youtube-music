'use strict';

import map from 'lodash/collection/map';
import filter from 'lodash/collection/filter';
import moment from 'moment';
import StorageHandler from '../../services/StorageHandler';

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
    return Promise.all(map(items, function (item) {
      var {thumbnails} = item.snippet;
      var {videoId} = item.snippet.resourceId;
      return StorageHandler.getVideoContent(videoId).then(entity => {
        return Promise.resolve({
          id: item.id,
          publishedAt: moment(item.snippet.publishedAt),
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: thumbnails.default.url,
          thumbnailHigh: thumbnails.high.url,
          downloaded: entity !== null,
          videoId
        });
      });
    }));
  }
};
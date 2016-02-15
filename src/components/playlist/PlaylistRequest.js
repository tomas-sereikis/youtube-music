'use strict';

import AuthorizationStorage from '../authorization/AuthorizationStorage';
import PlaylistResponse from './PlaylistResponse';
import RequestHandler from '../../services/RequestHandler';
import signature from './PlaylistVideoSignature';
import uuid from 'uuid-v4';
import moment from 'moment';

export default {
  /**
   * Get playlist content
   * @returns {Promise.<Array>}
   */
  getPlaylist() {
    return AuthorizationStorage.token().then(function (token) {
      var requestUri = `https://content.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=50&mine=true&access_token=${token}`;
      return RequestHandler.get(requestUri).then(response => {
        return PlaylistResponse.playlist(response);
      });
    });
  },

  /**
   * Get playlist item content
   * @param {string} id - playlist item id
   * @returns {Promise.<Array>}
   */
  getPlaylistItem(id) {
    return AuthorizationStorage.token().then(function (token) {
      var requestUri = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&access_token=${token}`;
      return RequestHandler.get(requestUri).then(response => {
        return PlaylistResponse.playlistItem(response);
      });
    });
  },

  /**
   * @param {string} videoId
   * @returns {Promise.<string>}
   */
  getAudioUrl(videoId) {
    var youtube = `http://www.youtube.com/watch?v=${videoId}`;
    var pushItemUri = `/a/pushItem/?item=${encodeURIComponent(youtube)}&el=na&bf=false&s=${moment().valueOf()}`;
    var pushItemUrl = `http://www.youtube-mp3.org${pushItemUri}&s=${signature(pushItemUri)}`;
    return fetch(pushItemUrl).then(response => {
      return response.text();
    }).then(response => {
      var rehashUri = `/a/itemInfo/?video_id=${response}&ac=www&t=grp&r=${moment().valueOf()}`;
      var rehashUrl = `http://www.youtube-mp3.org${rehashUri}&s=${signature(rehashUri)}`;
      return fetch(rehashUrl);
    }).then(response => {
      return response.text().then(text => JSON.parse(text.substr(7, text.length - 1)));
    }).then(response => {
      var audioUri = `/get?video_id=${videoId}&ts_create=${response.ts_create}&r=${encodeURIComponent(response.r)}&h2=${response.h2}`;
      return `http://www.youtube-mp3.org${audioUri}&s=${signature(audioUri)}`;
    });
  }
};
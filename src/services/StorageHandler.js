'use strict';

import JsonStorage from './JsonStorage';
import FileSystem from 'react-native-fs';

/**
 * Get storage path
 * @param {string} [filename]
 * @returns {*}
 */
function downloadsPath(filename = '') {
  return `${FileSystem.DocumentDirectoryPath}/downloads/${filename}`;
}

/**
 * Get content in downloads directory
 * @returns {Promise.<Array>}
 */
function downloads() {
  return FileSystem.readdir(downloadsPath()).then(response => {
    return response;
  }, e => {
    return Promise.resolve([]);
  });
}

/**
 * Download video from url
 * @param {string} audioUrl
 * @param {string} videoId
 * @param {Function} progressCallback
 */
function downloadVideo(audioUrl, videoId, progressCallback) {
  return FileSystem.mkdir(downloadsPath()).then(e => {
    var lastProgress;
    var filename = `${videoId}.mp3`;
    return FileSystem.downloadFile(audioUrl, downloadsPath(filename), null, e => {
      var progress = Math.floor(e.bytesWritten / e.contentLength * 100);
      if (progress !== lastProgress) {
        lastProgress = progress;
        progressCallback({progress});
      }
    });
  });
}

/**
 * @param {string} thumbnailUrl
 * @param {string} videoId
 * @returns {Promise}
 */
function downloadThumbnail(thumbnailUrl, videoId) {
  var filename = `${videoId}.jpg`;
  return FileSystem.mkdir(downloadsPath()).then(e => {
    return FileSystem.downloadFile(thumbnailUrl, downloadsPath(filename));
  });
}

function unlink(filepath) {
  return FileSystem.unlink(filepath);
}

/**
 * @param videoId
 * @returns {*}
 */
function videoPath(videoId) {
  return downloadsPath(`${videoId}.mp3`);
}

/**
 * @param videoId
 * @returns {*}
 */
function thumbnailPath(videoId) {
  return downloadsPath(`${videoId}.jpg`);
}

/**
 * @returns {Promise}
 */
function getVideos() {
  return JsonStorage.getItem('videos', e => []);
}

/**
 * Get video content
 * @param videoId
 * @returns {Promise}
 */
function getVideoContent(videoId) {
  return JsonStorage.getItem(`video.${videoId}`);
}

/**
 * Set video content
 * @param {string} videoId
 * @param {Object} content
 * @returns {Promise.<Object|null>}
 */
function setVideoContent(videoId, content) {
  return JsonStorage.setItem(`video.${videoId}`, content)
    .then(getVideos)
    .then(res => res.concat(content))
    .then(res => JsonStorage.setItem('videos', res));
}

/**
 * Remove video
 * @param videoId
 * @returns {Promise}
 */
function removeVideoContent(videoId) {
  return JsonStorage.removeItem(`video.${videoId}`)
    .then(getVideos)
    .then(res => res.filter(video => video.videoId !== videoId))
    .then(res => JsonStorage.setItem('videos', res));
}

export default {
  unlink,
  downloads,
  downloadVideo,
  downloadThumbnail,
  videoPath,
  thumbnailPath,
  getVideos,
  getVideoContent,
  setVideoContent,
  removeVideoContent
};
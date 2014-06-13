'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('ngGcActiveVideoService', [
]).factory('ngGcActiveVideo', [
  function ngGcActiveVideo() {

    var videos = [];
    var activeVideo = {};
    function hasVideo(video) {
      return _.some(videos, { 'slug': video.slug });
    }

    return {
      addVideo: function addVideo(video) {
        if (!video || !video.slug) {
          return false;
        }
        if (hasVideo(video)) {
          return false;
        }
        videos.push(video);
        return true;
      },
      setActiveVideo: function setActiveVideo(video) {
        if (!video || !video.slug) {
          return false;
        }
        if (!hasVideo(video)) {
          return false;
        }
        var newVideo = _.find(videos, { 'slug': video.slug });
        _.extend(activeVideo, newVideo);
        return true;
      },
      getActiveVideo: function getActiveVideo() {
        return activeVideo;
      }
    };

  }
]);

'use strict';

var angular = require('angular');
var _ = require('lodash');
var Froogaloop = require('froogaloop');

angular.module('ngGcAutoplayVimeoDirective', [])
  .directive('ngGcAutoplayVimeo', [
    function ngGcAutoplayVimeoDirective() {

      return {
        link: function link(scope, element) {
          var playerReady;

          var bindPlayerReady = _.once(function bindPlayerReady(player) {
            player.addEvent('ready', function() {
              playerReady = true;
            });
          });

          // Fired each time the src changes
          element.on('load', function() {
            var player = Froogaloop(element[0]);
            if (playerReady) {
              player.api('play');
            }
            bindPlayerReady(player);
          });
        }
      };

    }
  ]);

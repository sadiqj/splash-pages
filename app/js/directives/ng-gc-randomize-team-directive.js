'use strict';

var _ = require('lodash');

angular.module('ngGcRandomizeTeamDirective', []).directive('ngGcRandomizeTeam', [
  function ngGcRandomizeTeamDirective() {

    return {
      link: function link(scope, element, attrs) {

        var teamArray = [];
        var teamMembers = element.find('.grid').detach();
        teamArray.push(teamMembers);
        var elements = teamArray[0];
        var shuffledElements = _.shuffle(elements);
        element.append(shuffledElements);

      }
    };

  }
]);

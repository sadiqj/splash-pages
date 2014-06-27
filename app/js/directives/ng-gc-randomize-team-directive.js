'use strict';

var _ = require('lodash');

angular.module('ngGcRandomizeTeamDirective', []).directive('ngGcRandomizeTeam', [
  function ngGcRandomizeTeamDirective() {

    return {
      link: function link(scope, element, attrs) {

        var teamArray = [];
        var teamMembers = element.find('.team-member').detach();
        teamArray.push(teamMembers);
        var shuffledElements = _.shuffle(teamArray[0]);
        element.append(shuffledElements);

      }
    };

  }
]);

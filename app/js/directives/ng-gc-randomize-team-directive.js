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

        // This element is invisible (but is still on page, to retain the correct height)
        // until the shuffling is done. (Note: no-js class means it's not invisible if there's no JS)
        element.css("opacity", 1);

      }
    };

  }
]);

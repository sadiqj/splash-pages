'use strict';

var _ = require('lodash');

angular.module('ngGcRandomizeTeamDirective', []).directive('ngGcRandomizeTeam', [
  function ngGcRandomizeTeamDirective() {

    return {
      link: function link(scope, element) {

        var teamMembers = element.find('.team-member').detach();
        var shuffled = _.shuffle(teamMembers);
        element.append(shuffled);

        // This element is invisible (but is still on page, to retain the correct height)
        // until the shuffling is done. (Note: no-js class means it's not invisible if there's no JS)
        element.css('opacity', 1);

      }
    };

  }
]);

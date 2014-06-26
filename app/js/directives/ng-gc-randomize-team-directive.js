'use strict';

angular.module('ngGcRandomizeTeamDirective', []).directive('ngGcRandomizeTeam', [
  function ngGcRandomizeTeamDirective() {

    return {
      link: function link(scope, element, attrs) {

        // shuffle() taken from http://stackoverflow.com/a/2450976/2394569
        function shuffle(array) {
          var currentIndex = array.length, temporaryValue, randomIndex;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }

          return array;
        }

        var teamArray = new Array();
        var teamMembers = element.find('.team-member').detach();
        teamArray.push(teamMembers);
        var elements = teamArray[0];
        shuffle(elements);
        element.append(elements);

      }
    };

  }
]);

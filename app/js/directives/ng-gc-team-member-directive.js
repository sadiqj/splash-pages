'use strict';

angular.module('ngGcTeamMemberDirective', [
  'gc.toggle',
  'gc.popover'
]).directive('ngGcTeamMember', [
  function ngGcTeamMemberDirective($scope) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template:
        ['<div class="team-member u-pull-start u-size1of6 u-padding-Bm u-padding-Hs u-margin-Bm">',
            '<div toggle="isVisible">',
              '<div class="team-member__image">',
                '<img ng-src="{{ imageSrc }}" alt="{{ forename }} {{ surname }}">',
              '</div>',
              '<h5 class="u-text-center u-text-heading team-member__name u-color-meta u-margin-Ts">',
                '{{ forename }}<br>{{ surname }}',
              '</h5>',
            '</div>',
            '<popover show="isVisible" ng-animate class="team-member__popover u-color-invert" ng-class="{ \'u-is-visible\': isVisible }">',
              '<div class="arrow"></div>',
              '<h3 class="u-text-heading u-text-left u-color-invert u-margin-Bs">{{ forename }} {{ surname }}</h3>',
              '<span ng-transclude></span>',
              '<div class="u-margin-Tm" ng-if="hasSocialLinks">',
                '<a href="{{ twitter }}" ng-if="twitter" target="_blank" class="team-member__link team-member__link--twitter"></a>',
                '<a href="{{ github }}" ng-if="github" target="_blank" class="team-member__link team-member__link--github"></a>',
                '<a href="{{ linkedin }}" ng-if="linkedin" target="_blank" class="team-member__link team-member__link--linkedin"></a>',
              '</div>',
            '</popover>',
          '</div>'
        ].join(''),
      scope: {
        forename: '@',
        surname: '@',
        imageSrc: '@',
        twitter: '@',
        github: '@',
        linkedin: '@'
      },
      link: function link(scope) {
        scope.isVisible = false;
        scope.hasSocialLinks = !!scope.twitter || !!scope.github || !!scope.linkedin;
      }
    };

  }
]);

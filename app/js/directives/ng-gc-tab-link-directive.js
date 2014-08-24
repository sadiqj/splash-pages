'use strict';

require('../services/ng-gc-active-tab-service');

angular.module('ngGcTabLinkDirective', [
  'ngGcActiveTabService'
]).directive('ngGcTabLink', [
  'ngGcActiveTab',
  function ngGcTabLinkDirective(ngGcActiveTab) {

    return {
      restrict: 'E',
      replace: true,
      template:
        ['<div class="grid__cell u-size1of4 u-text-center u-margin-Bl">',
            '<a class="u-link-clean"',
              'href ng-click="setActiveTab()" ng-gc-smooth-scroll>',
              '<div class="videos-container__thumbnail u-margin-Hs u-margin-Bs"',
                'ng-class="{',
                '  \'is-active\': isSelfActive()',
                '}">',
                '<div class="u-size5of6 u-center u-padding-Txxs">',
                  '<i class="videos-container__play-button u-margin-Tl u-margin-Bs"',
                    'ng-class="{',
                    '  \'is-active\': isSelfActive()',
                    '}"></i>',
                  '<p class="u-text-heading u-text-h2 u-text-light',
                  'u-link-clean u-cf u-color-base videos-container__link"',
                    'ng-class="{',
                    '  \'is-active\': isSelfActive()',
                    '}">',
                    '{{ title }}',
                  '</p>',
                  '<p class="u-margin-Ts u-color-base videos-container__time"',
                    'ng-class="{',
                    '  \'is-active\': isSelfActive()',
                    '}">',
                    '{{ time }}',
                  '</p>',
                '</div>',
              '</div>',
            '</a>',
          '</div>'].join(''),
      link: function link(scope) {
        var tab = {
          id: scope.id,
          title: scope.title,
          time: scope.time,
          slug: scope.slug,
          description: scope.description
        };

        ngGcActiveTab.addTab(tab);

        scope.isSelfActive = function isSelfActive() {
          return scope.id === ngGcActiveTab.getActiveTab().id;
        };

        function getSlug() {
          var slug = window.location.hash && window.location.hash.replace(/^#/, '');
          return slug;
        }

        scope.setActiveTab = function setActiveTab() {
          var slug = getSlug();
          // only set hash when the slug is different from the current tab
          if (slug !== scope.slug) {
            location.hash = scope.slug;
          }
          ngGcActiveTab.setActiveTab(tab);
        };

        function setActiveSlug() {
          var slug = getSlug();
          if (slug) {
            ngGcActiveTab.setActiveTab({
              slug: slug
            });
          } else if (scope.isActive) {
            scope.setActiveTab();
          }
        }

        // Set initial state from hash/isActive
        setActiveSlug();

        // When navigating back/forward
        $(window).on('hashchange', function() {
          scope.$apply(function() {
            setActiveSlug();
          });
        });
      },
      scope: {
        id: '@',
        title: '@',
        time: '@',
        slug: '@',
        description: '@',
        isActive: '='
      }
    };

  }
]);

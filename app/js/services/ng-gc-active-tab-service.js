'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('ngGcActiveTabService', [
]).factory('ngGcActiveTab', [
  function ngGcActiveTab() {

    var tabs = [];
    var activeTab = {};
    function hasTab(tab) {
      return _.some(tabs, { 'slug': tab.slug });
    }

    return {
      addTab: function addTab(tab) {
        if (!tab || !tab.slug) {
          return false;
        }
        if (hasTab(tab)) {
          return false;
        }
        tabs.push(tab);
        return true;
      },
      setActiveTab: function setActiveTab(tab) {
        if (!tab || !tab.slug) {
          return false;
        }
        if (!hasTab(tab)) {
          return false;
        }
        var newTab = _.find(tabs, { 'slug': tab.slug });
        _.extend(activeTab, newTab);
        return true;
      },
      getActiveTab: function getActiveTab() {
        return activeTab;
      }
    };

  }
]);

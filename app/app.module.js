'use strict';

var linkApp = angular.module('linkApp', ['ui.router', 'home', 'angularModalService']);

linkApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/home");

  $stateProvider
    .state('home', {
      url: "/home",
      template: "<home></home>"
    });
});
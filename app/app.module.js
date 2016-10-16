'use strict';

var linkApp = angular.module('linkApp', ['ui.router', 'angularModalService', 'header', 'lectors']);

linkApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/lectors");

  $stateProvider
    .state('main', {
      url: "/",
      templateUrl: "components/tpl/mainView.tpl.html",
      abstract: true  
    })
    .state('main.lectors', {
      url: "lectors",
      template: "<lectors></lectors>"
    });
});
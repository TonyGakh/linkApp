'use strict';

var linkApp = angular.module('linkApp', ['ui.router', 'angularModalService', 'header', 'lectors','diploms','lessons', 'utils']);

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
    })
    .state('main.diploms', {
      url: "diploms/{id}",
      template: "<diploms></diploms>"
    })
    .state('main.lessons', {
      url: "lessons",
      template: "<lessons></lessons>"
    });
});
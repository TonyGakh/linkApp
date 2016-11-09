'use strict';

var linkApp = angular.module('linkApp', ['ui.router', 'angularModalService', 'header', 'lectors','students', 'disciplines', 'assignments', 'utils']);

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
    .state('main.assignments', {
      url: "assignments",
      template: "<assignments></assignments>"
    })
    .state('main.students', {
      url: "students",
      template: "<students></students>"
    })
    .state('main.disciplines', {
      url: "disciplines",
      template: "<disciplines></disciplines>"
    });
});
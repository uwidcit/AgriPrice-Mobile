// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('agrinet', ['ionic', 'agrinet.controllers', 'agrinet.services'])

  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state("menu", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html"
      })

      .state("menu.home",{
        url: "/home",
        views: {
          "content":{
            templateUrl: "templates/home.html",
            controller: "HomeCtrl"
          }
        }
      })

      .state("menu.checkprices", {
        url: "/checkprices",
        views:{
          "content":{
            templateUrl: "templates/checkprices.html",
            controller : "PriceCtrl"
          }
        }
      })

      .state("menu.notifications", {
        url: "/notifications",
        views:{
          "content":{
            templateUrl: "templates/notifications.html",
            controller : "NotifyCtrl"
          }
        }
      })
      $urlRouterProvider.otherwise("app/checkprices");
  });



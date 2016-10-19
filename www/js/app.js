// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('agrinet', 
[
  'ionic', 
  'agrinet.controllers', 
  'agrinet.services', 
  'ngCordova', 
  'ui.router', 
  'dcbImgFallback', 
  'chart.js',
  'angulartics', 
  'angulartics.google.analytics',
  'angulartics.scroll',
  'ngCordovaOauth'])

  .config(function($stateProvider, $urlRouterProvider){
    $stateProvider
      .state("menu", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: "SystemCtrl"
      })

      .state("menu.about",{
        url: "/about",
        views: {
          "content":{
            templateUrl: "templates/about.html",
            controller: "AboutCtrl"
          }
        }
      })

      .state("menu.checkprices", {
        url: "/checkprices",
        views:{
          "content":{
            templateUrl: "templates/checkprices.html",
            controller : "PriceListCtrl"
          }
        }
      })

      .state("menu.crop",{
        url: "/crop/:crop/:date",
        views:{
          "content":{
            templateUrl : "templates/cropview.html",
            controller : "CropPriceCtrl"
          }
        }
      })

      .state("menu.visualize",{
        url: "/visualize/:crop",
        views:{
          "content":{
            templateUrl : "templates/visualize.html",
            controller : "VisualCtrl"
          }
        }
      })
    
     .state("menu.login", {
        url: "/login",
        views:{
          "content":{
            templateUrl: "templates/login.html",
            controller : "LoginCtrl"
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



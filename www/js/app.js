// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic.apis', 'ngCordova', 'ngMaterial', 'ionic.utils', 'ngRadialGauge'])
.constant('$api', {url :'http://54.214.240.60:8080/BURN_IT'}) // /api || http://54.214.240.60:8080/BURN_IT
.run(function($ionicPlatform, $ionicPopup, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device."
            })
            .then(function(result) {
                if(!result) {
                    ionic.Platform.exitApp();
                }
            });
        }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('profile', {
    url: "/profile",
    templateUrl: "templates/default-profile.html",
    controller: 'ProfileCtrl'
  })


  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.food', {
    url: "/food",
    views: {
      'menuContent': {
        templateUrl: "templates/food.html",
       controller: 'FoodCtrl'
      }
    }
  })

  .state('app.activities', {
    url: "/activities",
    views: {
      'menuContent': {
        templateUrl: "templates/activities.html",
       controller: 'ActivityCtrl'
      }
    }
  })


  .state('app.fooddetails', {
    url: "/food/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/food-details.html",
       controller: 'FoodDetailsCtrl'
      }
    }
  })

  .state('app.activitydetails', {
    url: "/activity/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/activity-details.html",
       controller: 'ActivityDetailsCtrl'
      }
    }
  })

  .state('app.newfood', {
    url: "/newfood",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/newfood.html",
        controller: 'AddFoodCtrl'
      }
    }
  })

  .state('app.newactivity', {
    url: "/newactivity",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/newactivity.html",
        controller: 'AddActivityCtrl'
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html",
        controller: 'ProfileCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  var session = JSON.parse(window.localStorage['data'] || '{}')
  if($.isEmptyObject(session)) {
    $urlRouterProvider.otherwise('/profile');  
  } else {
    $urlRouterProvider.otherwise('/app/home');
  }  
});

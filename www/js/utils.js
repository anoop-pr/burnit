angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])
.factory('$spinner', ['$ionicLoading', function($ionicLoading){
  return {
    show: function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
      });
    },
    hide: function() {
      $ionicLoading.hide();
    }
  }
}])
.factory('bmiCategory',  function(){
  return {
    text: function(bmi) {
      var category;

      if(bmi <= 18.5) {
        category = 'Underweight';
      } else if(bmi > 18.5 && bmi <= 24.9) {
        category = "Normal weight";
      } else if(bmi > 24.9 && bmi <= 29.9 ) {
        category = "Overweight";
      } else if(bmi > 30) {
        category = "Obesity";
      }
      return category;     
    }
  }
});
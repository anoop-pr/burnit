angular.module('ionic.apis', ['ionic.utils'])

/*.factory('$auth', ['$http', '$q', function($http, $q) {
  return {
    login: function(data) {
    	var deffered = $q.defer();
    	$http({method: 'GET', url: 'http://localhost:8100/data/login.json'}).
        success(function(out) {
            deffered.resolve(out);
        }).
        error(function(response) {
            deffered.reject(response);
        });
        return deffered.promise;
    }
  }
}])*/

.factory('$food', ['$http', '$q', '$spinner', '$timeout', '$cordovaDevice', '$localstorage', '$api', '$filter', function($http, $q, $spinner, $timeout, $cordovaDevice, $localstorage, $api, $filter) {
  
  var uuid;

  try {
      uuid = $cordovaDevice.getUUID();
  } catch (err) {
      uuid = 'sample'
  }

  return {
    get: function(data) {
    	$spinner.show();
    	var deffered = $q.defer();
    	$http({method: 'GET', url: $api.url + '/fooddiary/user?userId=' + uuid}).
        success(function(out) {
        	$spinner.hide();
            deffered.resolve(out);
        }).
        error(function(response) {
        	$spinner.hide();
          deffered.reject(response);
        });
        return deffered.promise;
    },

    save: function(data) {
      $spinner.show();
      var deffered = $q.defer();
      // var date = $filter('date')(data.date, 'MM-dd-yyyy');
      var data = JSON.stringify({"userId": uuid, "date": data.date, "foodText": data.text});
      $http({method: 'POST', url: $api.url + '/fooddiary', data: $.param({foodDiary: data}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
        success(function(out) {
          $spinner.hide();
            deffered.resolve(out);
        }).
        error(function(response) {
          $spinner.hide();
          deffered.reject(response);
        });
        return deffered.promise;
    },

    update: function(data) {
      $spinner.show();
      var deffered = $q.defer(),
          data = JSON.stringify({"id": data.id, "userId": uuid, "foodText": data.foodText});
          
      $http({method: 'POST', url: $api.url + '/fooddiary/food', data: $.param({foodDiary: data}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
        success(function(out) {
          $spinner.hide();
            deffered.resolve(out);
        }).
        error(function(response) {
          $spinner.hide();
          deffered.reject(response);
        });
        return deffered.promise;
    },

    remove: function(data) {
      
      var deffered = $q.defer(),
          data = JSON.stringify(data);
          
      $http({method: 'POST', url: $api.url + '/fooddiary/rm/food', data: $.param({foodDeleteDetails: data}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
        success(function(out) {
            deffered.resolve(out);
        }).
        error(function(response) {
          deffered.reject(response);
        });
        return deffered.promise;
    },

    profile: function(data) {
      $spinner.show();
      var deffered = $q.defer();
      data.uuid = uuid;
      $http({method: 'POST', url: $api.url + '/userprofile', data: $.param({userProfile: JSON.stringify(data)}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
        success(function(out) {
          $spinner.hide();
            deffered.resolve(out);
        }).
        error(function(response) {
          $spinner.hide();
          deffered.reject(response);
        });
        return deffered.promise;
    },

    details: function(index) {
    	var deffered = $q.defer(),
          food = $localstorage.getObject('food');
    	deffered.resolve(food[index].data);
    	return deffered.promise;
    }
  }
}])


.factory('$activity', ['$http', '$q', '$spinner', '$timeout', '$api', '$filter', '$localstorage', '$cordovaDevice', function($http, $q, $spinner, $timeout, $api, $filter, $localstorage, $cordovaDevice) {
  var uuid;

  try {
      uuid = $cordovaDevice.getUUID();
  } catch (err) {
      uuid = 'sample'
  }

  return {
    get: function(data) {
      $spinner.show();
      var deffered = $q.defer();
      $http({method: 'GET', url: $api.url + '/activitydiary/user?uuId=' + uuid}).
        success(function(out) {
          $spinner.hide();
            deffered.resolve(out);
        }).
        error(function(response) {
          $spinner.hide();
          deffered.reject(response);
        });
        return deffered.promise;
    },

    save: function(data) {
      $spinner.show();
      console.log(data); 
      var deffered = $q.defer();
      // var date = $filter('date')(data.date, 'MM-dd-yyyy');
      var data = JSON.stringify({"uuid": uuid, "date": data.date, "activityText": data.text});
      $http({method: 'POST', url: $api.url + '/activitydiary', data: $.param({activityDiary: data}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
        success(function(out) {
          $spinner.hide();
            deffered.resolve(out);
        }).
        error(function(response) {
          $spinner.hide();
          deffered.reject(response);
        });
        return deffered.promise;
    },

    remove: function(data) {
      
      var deffered = $q.defer(),
          data = JSON.stringify(data);
          
      $http({method: 'POST', url: $api.url + '/activitydiary/rm/activity', data: $.param({activityDeleteDetails: data}), headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
        success(function(out) {
            deffered.resolve(out);
        }).
        error(function(response) {
          deffered.reject(response);
        });
        return deffered.promise;
    },

    details: function(index) {
      var deffered = $q.defer(),
          activity = $localstorage.getObject('activity');
      deffered.resolve(activity[index]);
      return deffered.promise;
    }
  }
}]);
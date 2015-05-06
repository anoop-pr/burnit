angular.module('ionic.apis', ['ionic.utils'])

.factory('$auth', ['$http', '$q', function($http, $q) {
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
}])

.factory('$food', ['$http', '$q', '$spinner', '$timeout', '$cordovaDevice', '$localstorage', '$api', '$filter', function($http, $q, $spinner, $timeout, $cordovaDevice, $localstorage, $api, $filter) {
  
  var uuid;

  try {
      uuid = $cordovaDevice.getUUID();
  } catch (err) {
      uuid = 'anoop1'
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
      var date = $filter('date')(data.date, 'MM-dd-yyyy');
      var data = JSON.stringify({"userId": uuid, "date": date, "foodText": data.text});
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


.factory('$activity', ['$http', '$q', '$spinner', '$timeout', function($http, $q, $spinner, $timeout) {
  var uuid;
  try {
      uuid = $cordovaDevice.getUUID();
  } catch (err) {
      uuid = 'anoop1'
  }

  return {
    get: function(data) {

      /*$spinner.show();
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
        return deffered.promise;*/
      // $spinner.show();
      var deffered = $q.defer();
      deffered.resolve([{"id":1,"date":"1400323623006","cal":8186},{"id":1,"date":"1398323623006","cal":1686},{"id":2,"date":"1388323623006","cal":2498},{"id":3,"date":"1378323623006","cal":5236},{"id":4,"date":"1368323623006","cal":4583},{"id":5,"date":"1361323623006","cal":7241}]);

      // $http({method: 'GET', url: 'http://localhost:8100/data/food.json'}).
     //    success(function(out) {
     //     $spinner.hide();
     //     out[0].date = new Date();
     //        deffered.resolve(out);
     //    }).
     //    error(function(response) {
     //     $spinner.hide();
     //        deffered.reject(response);
     //    });
        return deffered.promise;
    },

    save: function(data) {

      $spinner.show();

      var deffered = $q.defer();
      $timeout(function() {
        $spinner.hide();
        deffered.resolve({'status': 200});
      }, 2000);
      

      return deffered.promise;
    },

    details: function(data) {
      var deffered = $q.defer();
      deffered.resolve({
        'date': new Date(),
        'id' : 1,
        'items': [
          {"id":1,"time":"1400323623006", 'cal': 564, 'text': "5km run, 50 push ups and 20 pull ups"},
          {"id":2,"time":"1400323623100", 'cal': 123, 'text': "Played badminton for 2hrs"}
          ]
        });
      return deffered.promise;
    }
  }
}]);
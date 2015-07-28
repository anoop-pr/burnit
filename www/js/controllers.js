angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $localstorage) {
  $scope.logout = function() {
    $localstorage.remove('data');
    $state.go('login');
  }
})

.controller('PlaylistsCtrl', function($scope, $cordovaDatePicker, $cordovaToast) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 }
  ];

  $scope.datepicker = function() {
     var options = {
      date: new Date(),
      mode: 'date', // or 'time'
      minDate: new Date() - 10000,
      allowOldDates: true,
      allowFutureDates: false,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };

    /*$cordovaDatePicker.show(options).then(function(date){
        alert(date);
    });*/

    // $cordovaToast.showLongBottom('Here is a message');

  }

})

.controller('FoodCtrl', function($food, $scope, $rootScope, $ionicPopup, $localstorage) {
  var updateList;
  (updateList = function() {
    $food.get().then(function(data) {
      $scope.food = data;  
      $localstorage.setObject('food', data);
    });  
  })();

  $rootScope.$on('food:listChanged', function() {
      updateList();
  });

  $scope.delete = function(item, $index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you want remove this item?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        var input = {date: $scope.food[$index].date};
        $scope.food.splice($index, 1);
        $food.remove(input).then(function() {
          // console.log('removed from database');
        });
      }
    });
  };
})

.controller('ActivityCtrl', function($activity, $scope, $rootScope, $ionicPopup, $localstorage) {
  var updateList;
  (updateList = function() {
    $activity.get().then(function(data) {
      $scope.activities = data;  
      $localstorage.setObject('activity', data);
    });  
  })();

  $rootScope.$on('activity:listChanged', function() {
      updateList();
  });

  $scope.delete = function(item, $index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you want remove this item?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        var input = {date: $scope.activities[$index].date};
        $scope.activities.splice($index, 1);
        $activity.remove(input).then(function() {
          // console.log('removed from database');
        });
      }
    });
  };
})


.controller('FoodDetailsCtrl', function($stateParams, $rootScope, $timeout, $scope, $food, $ionicPopup, $localstorage, $ionicModal, $state, $cordovaToast){
  var details,
      id  = $stateParams.id;

  (details = function(id) {
    $food.details(id).then(function(data) {
      $scope.data = data;
      calculateTotal();
    });
  })(id);

  function calculateTotal() {
    $scope.total = 0;
      for (var i = 0; i < $scope.data.length; i++) {
        $scope.total += $scope.data[i].calorieConsumption
      };
  }

  $rootScope.$on('food:DetailsChanged', function() {
      details();
  });

  $scope.remove = function(item, $index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you want remove this item?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        // console.log($scope.data[$index]);
        var input = {id: $scope.data[$index].id};
        $scope.data.splice($index, 1);
        $food.remove(input).then(function() {});
        if($scope.data.length <= 0) {
          $scope.$emit('food:listChanged');
          $state.transitionTo('app.food');
        } else {
          var food = $localstorage.getObject('food');
          food[id].data = $scope.data;
          $localstorage.setObject('food', food);
          calculateTotal();
        }
      }
    });
  }

  $ionicModal.fromTemplateUrl('templates/update-food.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeAdd = function() {
    details(id);
    $scope.modal.hide();
  }

  $scope.edit = function(item, $index) {
    $scope.food = $scope.data[$index];
    $scope.index = $index;
    $scope.modal.show();
  }

  $scope.update = function(data) {
    $food.update(data).then(function(data) {
      if(data.calorieConsumption == 0) {
        $cordovaToast.showLongBottom('Something went wrong with the text please try again!');
      } else {
        $scope.$emit('food:listChanged');
        $cordovaToast.showLongBottom('Food diary updated');
      }
      $scope.modal.hide();
      $state.transitionTo('app.food');
    });
  }

})

.controller('ActivityDetailsCtrl', function($stateParams, $rootScope, $timeout, $scope, $activity, $ionicPopup, $localstorage, $ionicModal, $state, activityLevel){
  var details,
      id  = $stateParams.id;

  (details = function(id) {
    $activity.details(id).then(function(data) {
      console.log(data);
      $scope.data = data;
      $scope.level = activityLevel.text(data.effort);
    });
  })(id);


  $rootScope.$on('activity:DetailsChanged', function() {
      details();
  });

  $scope.remove = function(item, $index) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm',
      template: 'Are you sure you want remove this item?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        // console.log($scope.data[$index]);
        var input = {id: $scope.data[$index].id};
        $scope.data.splice($index, 1);
        $food.remove(input).then(function() {});
        if($scope.data.length <= 0) {
          $scope.$emit('food:listChanged');
          $state.transitionTo('app.food');
        } else {
          var food = $localstorage.getObject('food');
          food[id].data = $scope.data;
          $localstorage.setObject('food', food);
          calculateTotal();
        }
      }
    });
  }

  $ionicModal.fromTemplateUrl('templates/update-food.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeAdd = function() {
    details(id);
    $scope.modal.hide();
  }

  $scope.edit = function(item, $index) {
    $scope.food = $scope.data[$index];
    $scope.index = $index;
    $scope.modal.show();
  }

  $scope.update = function(data) {
    $food.update(data).then(function(data) {
      if(data.calorieConsumption == 0) {
        $cordovaToast.showLongBottom("We can't recognize the text, please try again");
      } else {
        $scope.$emit('food:listChanged');
        $cordovaToast.showLongBottom('Food diary updated');
      }
      $scope.modal.hide();
      $state.transitionTo('app.food');
    });
  }

})

.controller('AddFoodCtrl', function($scope,  $mdDialog,  $state, $food, $cordovaToast, $cordovaDatePicker, $filter) {

  var initData;
  (initData = function() {
    $scope.food = {};  
  })();
  $scope.saveFood = function(data) {
    $food.save(data).then(function(data) {
      if(data.calorieConsumption == 0) {
        $cordovaToast.showLongBottom('Something went wrong with the text please try again!');
      } else {
        initData();
        $scope.$emit('food:listChanged');
        $cordovaToast.showLongBottom('Food diary saved');
      }
      $state.transitionTo('app.food');
    });
  }

  $scope.datepicker = function() {
     var options = {
      date: new Date(),
      mode: 'date'
    };

    $cordovaDatePicker.show(options).then(function(date){
        $scope.food.date = $filter('date')(date, 'dd-MM-yyyy');
    });
  }



})

.controller('AddActivityCtrl', function($scope,  $mdDialog,  $state, $activity, $cordovaToast, $cordovaDatePicker, $filter, $localstorage) {

  var initData;
  (initData = function() {
    $scope.activity = {};  
  })();
  $scope.saveActivity = function(data) {
    $activity.save(data).then(function(data) {
      if(data.effort == 0) {
        $cordovaToast.showLongBottom("We can't recognize the text, please try again!");
      } else {
        initData();
        $scope.$emit('activity:listChanged');
        $cordovaToast.showLongBottom('Activity saved');
      }
      $state.transitionTo('app.activities');
    });
  }
  var activities = $localstorage.getObject('activity');
  $scope.$watch('activity.date', function(date) {
    $.grep(activities, function(e){ 
      var to = e.date.split("-");
      var from = $scope.activity.date.split("-");
      
      var o = new Date(to[0], to[1] - 1, to[2]),
          t = new Date(from[2], from[1] - 1, from[0]);

       if(o.getTime() == t.getTime()) {
        $scope.activity.text = e.activityText;
       } 
    });
    
  });

  $scope.datepicker = function() {
     var options = {
      date: new Date(),
      mode: 'date'
    };
    $cordovaDatePicker.show(options).then(function(date){
        $scope.activity.date = $filter('date')(date, 'dd-MM-yyyy');
    });
  }
})

.controller('ProfileCtrl', function($scope, $ionicHistory, $cordovaToast, $state, $localstorage, $food) {
  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  var initData;
    (initData = function() {
      $scope.profile = $localstorage.getObject('data');
    })();

  $scope.showError = false;

  $scope.update = function(data) {
    console.log(data);
    $food.profile(data).then(function(data) {
      $localstorage.setObject('data', data);
      $cordovaToast.showLongBottom('Profile updated!');
      $ionicHistory.nextViewOptions({
            disableBack: true
        });
      $state.transitionTo('app.home');
    });
  }
})

.controller('HomeCtrl', function($scope, bmiCategory, $localstorage, $rootScope, $cordovaDevice, $ionicHistory, $state) {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    var initData;
    (initData = function() {
      $scope.data = $localstorage.getObject('data');
      if($.isEmptyObject($scope.data)){
        $state.go('app.food');
      } else {
        $scope.data.category = bmiCategory.text($scope.data.bmi); 
      }
    })();

    $rootScope.$on('dashboard:updated', function() {
        initData();
    });

    $scope.upperLimit = 40;
    $scope.lowerLimit = 10;
    $scope.unit = "";
    $scope.precision = 1;
    $scope.ranges = [
        {
            min: 10,
            max: 18.4,
            color: '#FFEE58'
        },
        {
            min: 18.5,
            max: 24.9,
            color: '#9CCC65'
        },
        {
            min: 25,
            max: 29.9,
            color: '#EF5350'
        },
        {
            min: 30.0,
            max: 40.0,
            color: '#D50000'
        }
    ];
});
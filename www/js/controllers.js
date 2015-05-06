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

    // $cordovaToast.showLongCenter('Here is a message');

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
        $scope.food.splice($index, 1)
      }
    });
  };
})


.controller('ActivityCtrl', function($activity, $scope, $rootScope, $ionicPopup) {
  var updateList;
  (updateList = function() {
    $activity.get().then(function(data) {
      $scope.activities = data;  
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
        $scope.food.splice($index, 1)
      }
    });
  };
})


.controller('FoodDetailsCtrl', function($stateParams, $rootScope, $timeout, $scope, $food, $ionicPopup, $localstorage, $ionicModal, $state){
  var details,
      id  = $stateParams.id;

  (details = function(id) {
    $food.details(id).then(function(data) {
      $scope.data = data;
    });
  })(id);

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
        $scope.data.splice($index, 1);
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
        $cordovaToast.showLongCenter('Something went wrong with the text please try again!');
      } else {
        $scope.$emit('food:listChanged');
        $cordovaToast.showLongCenter('Food diary updated');
      }
      $scope.modal.hide();
      $state.transitionTo('app.food');
    });
  }

})

.controller('AddFoodCtrl', function($scope,  $mdDialog,  $state, $food, $cordovaToast) {

  var initData;
  (initData = function() {
    $scope.food = {};  
  })();
  $scope.saveFood = function(data) {

    // var alert = $mdDialog.alert({
    //   title: 'Attention',
    //   content: 'This is an example of how easy dialogs can be!',
    //   ok: 'Close'
    // });
    // $mdDialog.show( alert );

    $food.save(data).then(function(data) {
      if(data.calorieConsumption == 0) {
        $cordovaToast.showLongCenter('Something went wrong with the text please try again!');
      } else {
        initData();
        $scope.$emit('food:listChanged');
        $cordovaToast.showLongCenter('Food diary saved');
      }
      $state.transitionTo('app.food');
    });
  }


})

.controller('ProfileCtrl', function($scope, $ionicViewService, $cordovaToast, $state, $localstorage, $food) {
  $ionicViewService.nextViewOptions({
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
      $cordovaToast.showLongCenter('Profile updated!');
      $ionicViewService.nextViewOptions({
            disableBack: true
        });
      $state.transitionTo('app.home');
    });
  }
})

.controller('HomeCtrl', function($scope, bmiCategory, $localstorage, $rootScope, $cordovaDevice, $ionicViewService, $state) {
    $ionicViewService.nextViewOptions({
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
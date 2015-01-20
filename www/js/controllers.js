
angular.module('agrinet.controllers', [])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
        console.log("ready");
        //var parsePlugin = cordova.require("cordova/core/parseplugin");
         window.parsePlugin.initialize("ZEYEsAFRRgxjy0BXX1d5BJ2xkdJtsjt8irLTEnYJ", "zLFVgMOZVwxC3IsSKCCgsnL2yEe1IrSRxitas2kb", function() {
            console.log('success');
        }, function(e) {
            console.log('error');
        });
  });
})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
    
    $scope.attendees = [
        { firstname: 'Nicolas', 		lastname: 'Cage' },
        { firstname: 'Jean-Claude', lastname: 'Van Damme' },
        { firstname: 'Keanu', 			lastname: 'Reeves' },
        { firstname: 'Steven', 			lastname: 'Seagal' }
    ];

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller("HomeCtrl", function($scope){
    console.log("Home Controller Executed");
})

//populates crop prices page
.controller("PriceCtrl", ["$scope", "DailyCrop", "$localstorage", "$ionicPopup", function($scope, DailyCrop, $localstorage, $ionicPopup){
    
    var recentTxt = "Most recent";
    var MAX_CHECKS = 20;
    var recentCrops;
    
    var cropCache = $localstorage.get((new Date()).toDateString());
    if(typeof cropCache == "undefined"){
        DailyCrop.cropList()
        .then(function(val){
            $scope.dailycrops = val;
            recentCrops = val;

        });
    }
    
    /*DailyCrop.cropDates()
    .then(function(data){
        $scope.dates = data;
        $scope.dates.push(recentTxt)
        $scope.dates.reverse();
    });*/
    
    var genDates = function(){
        var dates = [];
        var date = new Date();
        dates.push(date.toDateString());
        for(var i = 0; i < 7; i++){
            var yest = new Date(date.getTime());
            yest.setDate(date.getDate() - 1);
            dates.push(yest.toDateString());
            date = yest;
        }
        return dates;
    }
    
    $scope.dates = genDates();
    
    $scope.changeDate = function(selected){
        var today = new Date();
        if(selected == today.toDateString()){
            $scope.dailycrops = recentCrops;
            return;
        }
        var cache = $localstorage.get(selected);
        if(typeof cache == "undefined"){
            DailyCrop.cropsByDate(selected)
            .then(function(data){
                var dateSelection = {};
                dateSelection.date = new Date();
                dateSelection.data = JSON.stringify(data);
                $localstorage.set(selected, JSON.stringify(dateSelection));
                $scope.dailycrops = data;
            });
        }
        else{
            cache = JSON.parse(cache);
            console.log("cached");
            $scope.dailycrops = JSON.parse(cache.data);
        }
    }
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleCrop = function(crop) {
        if ($scope.isCropShown(crop)) {
            $scope.shownCrop = null;
        } 
        else {
            $scope.shownCrop = crop;
            var cache = JSON.parse($localstorage.get(crop.commodity));
            var obj = {};
            obj.state = cache.state;
            obj.checks = (parseInt(cache.checks)) + 1;
            if(obj.checks >= MAX_CHECKS && obj.state == false){
                showConfirm(crop.commodity);
            }
            $localstorage.set(crop.commodity, JSON.stringify(obj));
        }
    };
    
    $scope.isCropShown = function(crop) {
        return $scope.shownCrop === crop;
    };
    
    var showConfirm = function(name) {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Get Reminders',
         template: 'Would you like to be notified of changes to this crops price?'
       });
       confirmPopup.then(function(res) {
           var obj = {};
           obj.state = res;
           obj.checks = 0;
           $localstorage.set(name, JSON.stringify(obj));
       });
     };

}])

//populates notificates mgmt page
.controller("NotifyCtrl", ["$scope", "notifyService", "$localstorage", function($scope, notifyService, $localstorage){
    
    var checkConnection = function() {
        if(navigator && navigator.connection && navigator.connection.type === 'none') {
            return false;
        }
        return true;
    };
    
    var getCrops = function(){
        var promise = notifyService.getCropNames();
        promise.then(function(val){
            var data = val.data;
            var cache = {};
            $scope.crops = cacheCrops(data);
            cache.date = (new Date()).toDateString();
            cache.data = JSON.stringify($scope.crops);
            $localstorage.set('crops', JSON.stringify(cache));
        });
    }
    
    var cacheCrops = function(data){
        var cropStates = [];
        for(var i = 0; i < data.length; i++){
            var curr = {};
            if(typeof $localstorage.get(data[i]) == 'undefined'){
                var obj = {};
                obj.state = 'false';
                obj.checks = 0;
                $localstorage.set(data[i], JSON.stringify(obj));
                curr.name = data[i];
                curr.state = false;
            }
            else{
                curr.name = data[i];
                curr.state = (JSON.parse($localstorage.get(data[i]))).state;
            }
            cropStates.push(curr);
        }
        return cropStates;
    }
    
    var check = $localstorage.get('crops');
    if(typeof check == 'undefined'){
        getCrops();
    }
    else if(check.date != (new Date()).toDateString()){
        getCrops();
    }
    else{
        check = JSON.parse(check);
        $scope.crops = JSON.parse(check.data);
    }
    
    
    $scope.cropToggled = function(crop){
        crop.state = !crop.state;
        console.log(crop.name + " " + crop.state);
        var obj = {};
        obj.state = crop.state;
        obj.checks = (JSON.parse($localstorage.get(crop.name, 'false'))).checks;
        console.log(obj);
        if(crop.state){
            $localstorage.set(crop.name, JSON.stringify(obj));
            parsePlugin.subscribe(crop.name, function() {
                
            }, function(e) {
                alert("error");
            });
        }
        else{
            $localstorage.set(crop.name, JSON.stringify(obj));
            parsePlugin.unsubscribe(crop.name, function(msg) {
                
            }, function(e) {
                alert("error");
            });
        }
    }

}])



// 	.controller("OptionCtrl", function($scope){
// 		$scope.options = [
// 			{title: "Monthly"},
// 			{title: "Daily"}
// 		];
// 	})

// .controller('DashCtrl', function($scope) {
// })

// .controller('FriendsCtrl', function($scope, Friends) {
//   $scope.friends = Friends.all();
// })

// .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
//   $scope.friend = Friends.get($stateParams.friendId);
// })

// .controller('AccountCtrl', function($scope) {
// });

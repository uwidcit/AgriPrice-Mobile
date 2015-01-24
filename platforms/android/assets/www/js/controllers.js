
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

.controller('AboutCtrl', function($scope, $ionicSideMenuDelegate) {
    
    
})

.controller("LoginCtrl", ["$scope", "$cordovaOauth", function($scope, $cordovaOauth){
    $scope.val = "asdas";
    
    $scope.googleLogin = function() {
        $cordovaOauth.google("602269272261-ihuhk6paf4bnpppdkmo4fpc1qanhhvp2.apps.googleusercontent.com", ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
            alert(JSON.stringify(result));
            var User = $resource('https://www.googleapis.com/plus/v1/people/userId',{});
            Crop.get().$promise.then(
            function(userData) {
                alert(userData);
            }, 
            function(error){
                
            });
        }, function(error) {
            alert(error);
        });
    }
}])

//populates crop prices page
.controller("PriceCtrl", ["$scope", "DailyCrop", "$localstorage", "$ionicPopup", '$ionicLoading', function($scope, DailyCrop, $localstorage, $ionicPopup, $ionicLoading){
    
    $scope.genDates = function(start){
        var dates = [];
        dates.push(start.toDateString());
        for(var i = 0; i < 7; i++){
            var yest = new Date(start.getTime());
            yest.setDate(start.getDate() - 1);
            dates.push(yest.toDateString());
            start = yest;
        }
        return dates;
    }
    
    var recentTxt = "Most recent";
    var MAX_CHECKS = 20;
    var recentCrops;
    
    $ionicLoading.show({
      template: 'Loading...'
    });
    var cropCache = $localstorage.get((new Date()).toDateString());
    if(typeof cropCache == "undefined"){
        DailyCrop.cropList()
        .then(function(val){
            $scope.dailycrops = val;
            recentCrops = val;
            var recent = {};
            recent.date = new Date();
            recent.data = JSON.stringify(val);
            $localstorage.set((new Date()).toDateString(), JSON.stringify(recent));
            $scope.dates = $scope.genDates(new Date(val[0].date));
            $ionicLoading.hide();
        });
    }
    else{
        console.log('cached');
        cropCache = JSON.parse(cropCache);
        $scope.dailycrops = JSON.parse(cropCache.data);
        $scope.dates = $scope.genDates(new Date($scope.dailycrops[0].date));
        $ionicLoading.hide();
    }
    
    /*DailyCrop.cropDates()
    .then(function(data){
        $scope.dates = data;
        $scope.dates.push(recentTxt)
        $scope.dates.reverse();
    });*/
    
    
    
    $scope.changeDate = function(selected){
        var today = new Date();
        if(selected == today.toDateString()){
            $scope.dailycrops = recentCrops;
            return;
        }
        $ionicLoading.show({
          template: 'Loading...'
        });
        var cache = $localstorage.get(selected);
        if(typeof cache == "undefined"){
            DailyCrop.cropsByDate(selected)
            .then(function(data){
                var dateSelection = {};
                dateSelection.date = new Date();
                dateSelection.data = JSON.stringify(data);
                $localstorage.set(selected, JSON.stringify(dateSelection));
                $scope.dailycrops = data;
                $ionicLoading.hide();
            });
        }
        else{
            cache = JSON.parse(cache);
            console.log("cached");
            $scope.dailycrops = JSON.parse(cache.data);
            $ionicLoading.hide();
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
            var idx = crop.commodity.indexOf('(');
            var name = crop.commodity;
            if(idx != -1)
                name = (crop.commodity.substr(0, idx)).replace(" ", "");
            var cache = JSON.parse($localstorage.get(name));
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
.controller("NotifyCtrl", ["$scope", "notifyService", "$localstorage", "$ionicLoading", function($scope, notifyService, $localstorage, $ionicLoading){
    
    var checkConnection = function() {
        if(navigator && navigator.connection && navigator.connection.type === 'none') {
            return false;
        }
        return true;
    };
    
    var getCrops = function(){
        $ionicLoading.show({
          template: 'Loading...'
        });
        var promise = notifyService.getCropNames();
        promise.then(function(val){
            var data = val.data;
            var cache = {};
            $scope.crops = cacheCrops(data);
            cache.date = (new Date()).toDateString();
            cache.data = JSON.stringify($scope.crops);
            $localstorage.set('crops', JSON.stringify(cache));
            $ionicLoading.hide();
        });
    }
    
    var cacheCrops = function(data){
        var cropStates = [];
        for(var i = 0; i < data.length; i++){
            var curr = {};
            if(typeof $localstorage.get(data[i]) == 'undefined'){
                var idx = data[i].indexOf('(');
                var name = data[i];
                if(idx != -1)
                    name = (data[i].substr(0, idx)).replace(" ", "");
                console.log(name);
                if(typeof $localstorage.get(name) == 'undefined'){
                    var obj = {};
                    obj.state = 'false';
                    obj.checks = 0;
                    obj.aliases = [];
                    obj.aliases.push(data[i]);
                    $localstorage.set(name, JSON.stringify(obj));
                    curr.name = name;
                    curr.state = false;
                    cropStates.push(curr);
                }
                else{
                    var cache = JSON.parse($localstorage.get(name));
                    var obj = {};
                    obj.state = cache.state;
                    obj.checks = cache.checks;
                    obj.aliases = cache.aliases;
                    obj.aliases.push(data[i]);
                    $localstorage.set(name, JSON.stringify(obj));
                    curr.name = name;
                    curr.state = false;
                }
            }
            else{
                curr.name = data[i];
                curr.state = (JSON.parse($localstorage.get(data[i]))).state;
                cropStates.push(curr);
            }
        }
        return cropStates;
    }
    
    var check = $localstorage.get('crops');
    if(typeof check == 'undefined'){
        getCrops();
    }
    else{ 
        check = JSON.parse(check);
        if(check.date != (new Date()).toDateString()){
            console.log(check.date);
            getCrops();
        }
        else{
            console.log('cache');
            $scope.crops = JSON.parse(check.data);
        }
    }
    
    
    $scope.cropToggled = function(crop){
        crop.state = !crop.state;
        console.log(crop.name + " " + crop.state);
        var obj = JSON.parse($localstorage.get(crop.name, 'false'));
        obj.state = crop.state;
        console.log(obj);
        if(crop.state){
            $localstorage.set(crop.name, JSON.stringify(obj));
            //for(var i = 0; i < obj.aliases.length; i++){
              //  console.log(obj.aliases[i]);
                parsePlugin.subscribe(obj.aliases[i], function() {

                }, function(e) {
                    alert("error");
                });
        //    }
        }
        else{
            $localstorage.set(crop.name, JSON.stringify(obj));
          //  for(var i = 0; i < obj.aliases.length; i++){
                parsePlugin.unsubscribe(obj.aliases[i], function() {

                }, function(e) {
                    alert("error");
                });
            //}
        }
    }

}])

.filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
    });



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


angular.module('agrinet.controllers', [])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
        console.log("ready");
        //var parsePlugin = window.cordova.require("cordova/core/parseplugin");
        Parse.initialize("ZEYEsAFRRgxjy0BXX1d5BJ2xkdJtsjt8irLTEnYJ", "HbaUIyhiXFpUYhDQ7EsXW4IwP6zeXgqC81AQhQSL");
        parsePlugin.register({
            "appId":"ZEYEsAFRRgxjy0BXX1d5BJ2xkdJtsjt8irLTEnYJ", "clientKey":"zLFVgMOZVwxC3IsSKCCgsnL2yEe1IrSRxitas2kb", "ecb":"onNotification"}, 
            function() {
                alert('successfully registered device!');
                doWhatever();
            }, function(e) {
                alert('error registering device: ' + e);
        });
  });
    
  function onNotification(){
  }
})

.controller('AboutCtrl', function($scope, $ionicSideMenuDelegate) {
    
    
})

/* LoginCtrl:
noLogin - Should give an option not to login, sends them directly to checkprices.
          The latest date should be loaded

googleLogin - If the user is already registered, the app will automatically login to the registered account.

register - If the user is not registered Google login would open and the user would need to sign up.
           May need to be adjusted to pull information stored already on the phone.
*/

.controller("LoginCtrl", ["$scope", "$cordovaOauth", "$http", "$state", "$localstorage", "$ionicLoading", function($scope, $cordovaOauth, $http, $state, $localstorage, $ionicLoading){
    var login = $localstorage.get("login");
    
    if(typeof login != "undefined"){
        $state.go("menu.checkprices");
    }
    
    $scope.noLogin = function() {
        //gets access token from google
        $localstorage.set("login", "none");
        $state.go("menu.checkprices");
    }
        
    $scope.googleLogin = function() {
        //gets access token from google
        $cordovaOauth.google("602269272261-ihuhk6paf4bnpppdkmo4fpc1qanhhvp2.apps.googleusercontent.com", ["https://www.googleapis.com/auth/plus.login", "https://www.googleapis.com/auth/plus.profile.emails.read"]).then(function(result) {
            $http.defaults.headers.common.Authorization = "Bearer " + result.access_token;
            //gets user data using token
            $http.get('https://www.googleapis.com/plus/v1/people/me').
            then(function(data) {
                var email = data.data.emails[0].value;
                $localstorage.set("login", email);
                $scope.register(email);
                
            }, function(error){alert(JSON.stringify(error));});
        }, function(error) {
            alert(error);
        });
    }
    
    //checks if user already registered or not and does accordingly
    $scope.register = function(userEmail){
        $ionicLoading.show({
          template: 'Signing in...'
        });
        parsePlugin.getInstallationId(function(installId) {
            Parse.Cloud.run('register', {email: userEmail, id: installId}, {
                success: function(result) { //returns users subscribed channels in an array
                    result = JSON.parse(result);
                    for(var i = 0; i < result.length; i++){
                        var obj = {};
                        obj.checks = 0;
                        obj.name = result[i];
                        obj.state = true;
                        $localstorage.set(result[i], JSON.stringify(obj));
                        parsePlugin.subscribe(result[i], function() {
                                
                        }, function(e) {
                            alert("error");
                        });
                        $ionicLoading.hide();
                        $state.go('menu.checkprices');
                    }
                },
                error: function(error) {
                    alert(JSON.stringify(error));
                }
            });
        }, function(e) {
            alert('error');
        });
    }
}])

/*PriceCtrl:
genDates - Pulls information from the last 7 days from the server.
           Dates pulled may also contain days that no information.

$ionicLoading - While the page is being populated the loading... template would show.

Data on the crops for the latest date will be Cached

changeDate - Would allow the user to display information for a day selected.
             If the date selected has no data then no information would show.
             Either load dates that have information only or show error message.

toggleCrops - should load crops that have been selected in notifications


*/
//populates crop prices page

.controller("PriceCtrl", ["$scope", "DailyCrop", "$localstorage", "$ionicPopup", "$ionicLoading", function($scope, DailyCrop, $localstorage, $ionicPopup, $ionicLoading){
    
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
    
    //runs when user changes the date picker
    $scope.changeDate = function(selected){
        var today = new Date();
        //if date selected is today just returns cached data
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
        $scope.getProjected(crop);
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
    
    //stores projected price
    $scope.projected = "$20.00";
    
    //gets the price the crop might be on the next day
    $scope.getProjected= function(crop){
        DailyCrop.cropPredByCrop(crop.commodity)
        .then(function(val){
            $scope.projected = val[0].price;
        });
    }

}])

/*NotifyCtrl:
getCrops - Loads crops that are availible.

 */
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
            var resp = cacheCrops(data);
            $scope.crops = resp.states;
            cache.date = (new Date()).toDateString();
            cache.names = resp.names;
            $localstorage.set('crops', JSON.stringify(cache));
            $ionicLoading.hide();
        });
    }
    
    var cacheCrops = function(data){
        var cropStates = [];
        var names = [];
        for(var i = 0; i < data.length; i++){
            var curr = {};
            if(typeof $localstorage.get(data[i]) == 'undefined'){
                var idx = data[i].indexOf('(');
                var name = data[i];
                if(idx != -1)
                    name = (data[i].substr(0, idx)).replace(" ", "");
                console.log(name);
                if(typeof $localstorage.get(name) == 'undefined'){
                    names.push(name);
                    var obj = {};
                    obj.name = name;
                    obj.state = 'false';
                    obj.checks = 0;
                    $localstorage.set(name, JSON.stringify(obj));
                    curr.name = name;
                    curr.state = false;
                    cropStates.push(curr);
                }
                else{
                    var cache = JSON.parse($localstorage.get(name));
                    var obj = {};
                    obj.name = cache.name;
                    obj.state = cache.state;
                    obj.checks = cache.checks;
                    $localstorage.set(name, JSON.stringify(obj));
                }
            }
            else{
                curr.name = data[i];
                curr.state = (JSON.parse($localstorage.get(data[i]))).state;
                cropStates.push(curr);
            }
        }
        var data = {};
        data.states = cropStates;
        data.names = names;
        return data;
    }
    
    $scope.cropToggled = function(crop){
        crop.state = !crop.state;
        console.log(crop.name + " " + crop.state);
        var obj = JSON.parse($localstorage.get(crop.name, 'false'));
        obj.state = crop.state;
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
            parsePlugin.unsubscribe(crop.name, function() {

            }, function(e) {
                alert("error");
            });
        }
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
            var crops = [];// = JSON.parse(check.name);
            for(var i = 0; i < check.names.length; i++){
                crops.push(JSON.parse($localstorage.get(check.names[i])));
            }
            $scope.crops = crops;
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

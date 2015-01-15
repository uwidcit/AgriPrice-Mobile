
angular.module('agrinet.controllers', [])
	
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
.controller("PriceCtrl", ["$scope", "DailyCrop", function($scope, DailyCrop){

    DailyCrop.cropList()
    .then(function(val){
        $scope.dailycrops = val;
    });

    
    DailyCrop.cropDates()
    .then(function(data){
        $scope.dates = data;
    });
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
            console.log(crop);
            var obj = {};
            obj.state = $localstorage.get(crop.commodity, 'false').state;
            obj.checks = parseInt($localstorage.get(crop.commodity, 'false').checks)++;
            $localstorage.set(crop.commodity, obj);
        }
    };
    
    $scope.isCropShown = function(crop) {
        return $scope.shownCrop === crop;
    };
}])

//populates notificates mgmt page
.controller("NotifyCtrl", ["$scope", "notifyService", "$localstorage", function($scope, notifyService, $localstorage){
    
    var promise = notifyService.getCropNames();
    promise.then(function(val){
        var data = val.data;
        var cropStates = [];
        for(var i = 0; i < data.length; i++){
            var curr = {};
            if(typeof $localstorage.get(data[i]) == 'undefined'){
                var obj = {};
                obj.state = 'false';
                obj.checks = 0;
                $localstorage.set(data[i], obj);
                curr.name = data[i];
                curr.state = false;
            }
            else{
                curr.name = data[i];
                curr.state = $localstorage.get(data[i], 'false').state == 'true';
            }
            cropStates.push(curr);
        }
        $scope.crops = cropStates;
    });
    
    
    $scope.cropToggled = function(crop){
        var pusher = new Pusher('8749af531d18b551d367');
        crop.state = !crop.state;
        console.log(crop.name + " " + crop.state);
        $localstorage.set(crop.name, crop.state);
        if(crop.state)
            var channel = pusher.subscribe(crop.name);
        else
            var channel = pusher.unsubscribe(crop.name);
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

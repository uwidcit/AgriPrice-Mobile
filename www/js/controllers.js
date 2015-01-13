
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
    .then(function(val){
        console.log(val);
        //$scope.dates = val;
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
        }
    };
    
    $scope.isCropShown = function(crop) {
        return $scope.shownCrop === crop;
    };
}])

//populates notificates mgmt page
.controller("NotifyCtrl", ["$scope", "notifyService", function($scope, notifyService){
    
    
    var promise = notifyService.getCropNames();
    promise.then(function(val){
        $scope.crops = val.data;
    });
    
    $scope.cropStatus = false;
    
    $scope.cropToggled = function(name){
        var pusher = new Pusher('8749af531d18b551d367');
        console.log(name + " " + $scope.cropStatus);
        if($scope.cropStatus)
            var channel = pusher.subscribe(name);
        else
            var channel = pusher.unsubscribe(name);
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

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

	.controller("NotifyCtrl", function($scope){
		console.log("Notification Controller Executed");
	})

	.controller("PriceCtrl", function($scope, DailyCrop){

		$scope.dailycrops = DailyCrop.all();

		/*
		 * if given group is the selected group, deselect it
		 * else, select the given group
		 */
		$scope.toggleCrop = function(crop) {
		  if ($scope.isCropShown(crop)) {
		    $scope.shownCrop = null;
		  } else {
		    $scope.shownCrop = crop;
		  }
		};
		$scope.isCropShown = function(crop) {
		  return $scope.shownCrop === crop;
		};
	})



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

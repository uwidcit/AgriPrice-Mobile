var angular = window.angular,
	_ = window._,
	Parse = window.Parse || {},
	parsePlugin = window.parsePlugin || {},
	isDeviceReady = false,
	isConnected = false;

angular.module('agrinet.controllers', [])

.run(["$ionicPlatform", "$state", "$localstorage",function($ionicPlatform, $state, $localstorage) {
	
	$ionicPlatform.ready(function() {
		console.log("Ionic Platform is ready");
		isDeviceReady = true;
		

		if (window.Connection){
			if (navigator.connection.type === window.Connection.NONE){
				console.log("No Connection Detected - Attempting to Exit App");
				navigator.notification.alert("Unable to Connect to the Internet. Please Connect and Try Again", function(){
					ionic.Platform.exitApp();
				}, "AgriPrice");
				
				return;
			}else{
				console.log("Connection Available");
			}
		}else{
			console.log("No Window Connection Found");
		}

		// Check if cordova parse plugin is available
		if (parsePlugin && parsePlugin.getInstallationId && parsePlugin.initialize){
			//TODO Place the Parse Plugin Functionality in its own module (Clean up from run state)
			parsePlugin.getInstallationId(function(id) {
				console.log("Received Installation ID: " + id);
			}, function(e) { console.log("Unable to Retrive Installation ID: " + e); });

			var appid = "ZEYEsAFRRgxjy0BXX1d5BJ2xkdJtsjt8irLTEnYJ";
			var clientKey = "zLFVgMOZVwxC3IsSKCCgsnL2yEe1IrSRxitas2kb";

			parsePlugin.initialize(appid, clientKey, function() {
				console.log("Starting Process to Connect to the Parse API");

				parsePlugin.subscribe('SampleChannel', function() {
					console.log("Successfully Initialized the appropriate Channel");
				}, function(e) {
					console.log("Unable to connect to the Parse API:" + e);
				});

				console.log("Attempting to retrieve current subscriptions");

				parsePlugin.getSubscriptions(function(subscriptions) {
					console.log(subscriptions);
				}, function(e) {
					console.log("Error Occurred while retrieving subscriptions: " + e);
				});
			}, function(e) { console.log(e); });
		}else{
			console.log("Parse Plugin in not available - probably running in browser");
		}
		
		// Check if the Parse web library loaded
		if (Parse && Parse.initialize){
			Parse.initialize("ZEYEsAFRRgxjy0BXX1d5BJ2xkdJtsjt8irLTEnYJ", "HbaUIyhiXFpUYhDQ7EsXW4IwP6zeXgqC81AQhQSL");
		}else{
			console.log("Parse Library not loaded");
		}
			

		function alertDismissed() {
			$state.go("menu.checkprices");
		}

		function onConfirm(buttonIndex) {
			if (buttonIndex === 2) { // if user taps yes
				var login = $localstorage.get("login");
				if (login) {
					navigator.notification.alert(
						'You are already logged in.', // message
						alertDismissed, // callback to invoke with index of button pressed
						'AgriPrice', // title
						'Continue' // buttonLabels
					);
				} else {
					$state.go("menu.login");
				}
			}else if (buttonIndex === 1){
				navigator.notification.alert(
					"The Login option can be accessed later in the right side menu",
					function() { $localstorage.set("tried_login", "true"); $state.go("menu.checkprices"); },
					'AgriPrice', // title
					'Continue' // buttonLabels
				);
			}
		}



		// If user not logged in, the prompt to login
		if (!$localstorage.get("login") && !$localstorage.get("tried_login")) {
			navigator.notification.confirm(
				'Login will Enable device to recieve notification of Price changes. Will you like to Login', // message
				onConfirm, // callback to invoke with index of button pressed
				'Log in to AgriPrice', // title of notification
				['No', 'Yes'] // buttonLabels
			);
		}

	});
}])


/*
	System Controller
*/
.controller("SystemCtrl", ["$scope", function($scope){
	console.log("System Controller Loaded");
	console.log($scope);
}])

/*
	About Controller
*/
.controller('AboutCtrl', function($scope, $ionicSideMenuDelegate) {
	console.log("About Controller Launched");
})

/* LoginCtrl:
noLogin - Should give an option not to login, sends them directly to checkprices.
					The latest date should be loaded

googleLogin - If the user is already registered, the app will automatically login to the registered account.

register - If the user is not registered Google login would open and the user would need to sign up.
					 May need to be adjusted to pull information stored already on the phone.
*/

.controller("LoginCtrl", ["$scope", "$cordovaOauth", "$http", "$state", "$localstorage", "$ionicLoading", function($scope, $cordovaOauth, $http, $state, $localstorage, $ionicLoading) {
	var login = $localstorage.get("login");
	console.log(login);
	if (login) {
		navigator.notification.alert(
			'You are already logged in.', // message
			function() { $state.go("menu.checkprices"); }, // callback to invoke with index of button pressed
			'AgriPrice', // title
			'Continue' // buttonLabels
		);
	}

	//if(typeof login != "undefined"){
	//    $state.go("menu.checkprices");
	//}

	$scope.noLogin = function() {
		//gets access token from google
		//$localstorage.set("", "");
		$state.go("menu.checkprices");
	}

	$scope.googleLogin = function() {
		//gets access token from google
		$cordovaOauth
			.google(
				"602269272261-ihuhk6paf4bnpppdkmo4fpc1qanhhvp2.apps.googleusercontent.com", [
					"https://www.googleapis.com/auth/plus.login",
					"https://www.googleapis.com/auth/plus.profile.emails.read"
				]
			).then(function(result) { // Successful Oauth Authentication
				$http.defaults.headers.common.Authorization = "Bearer " + result.access_token;
				//gets user data using token
				$http
					.get('https://www.googleapis.com/plus/v1/people/me')
					.then(function(data) { // Successful HTTP Connection
						var email = data.data.emails[0].value;
						$localstorage.set("login", email);
						$scope.register(email);
					}, function(error) { // Error connecting to Google Services
						console.log(error);
						navigator.notification.alert("Unable to Connect to Google");
					});
			}, function(error) {
				console.log(error);
				navigator.notification.alert("Unable to Connect to Google");
			});
	}

	$scope.register = function(userEmail) {
		$ionicLoading.show({
			template: 'Signing in...'
		});

		parsePlugin
			.getInstallationId(function(installId) {
				console.log("Retrieving Installation Id: " + installId);
				Parse.Cloud.run('register', {
					email: userEmail,
					id: installId
				}, {
					success: function(result) { //returns users subscribed channels in an array
						console.log("Successfully registered with Parse service");
						result = JSON.parse(result);
						if (result.length !== 0) {
							for (var i = 0; i < result.length; i++) {
								var obj = {};
								obj.checks = 0;
								obj.name = result[i];
								obj.state = true;
								$localstorage.set(result[i], JSON.stringify(obj));
								parsePlugin.subscribe(result[i], function() {
									console.log("Successfully Subscribed to: " + result[i]);
								}, function(e) {
									console.log("Unable to Subscribe to " + result[i] + " Error: " + e);
									navigator.notification.alert("error");
								});
								$ionicLoading.hide();
								$state.go('menu.checkprices');
								$scope.$apply();
							}
						} else {
							$ionicLoading.hide();
							$state.go('menu.checkprices');
							$scope.$apply();
						}
					},
					error: function(error) {
						navigator.notification.alert("Unable to Complete Login");
						console.log(error);
					}
				});
			}, function(e) {
				navigator.notification.alert("Unable to Complete Login");
				console.log(e);
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
*/
//populates crop prices page

.controller("PriceListCtrl", ["$scope", "DailyCrop", "$localstorage", "$ionicPopup", "$ionicLoading", "$http", "$state", "$sessionstorage", function($scope, DailyCrop, $localstorage, $ionicPopup, $ionicLoading, $http, $state, $sessionstorage) {

	$ionicLoading.show({
		template: 'Loading...'
	});

	var processDate = function(date) { // adjust the date to correspond to the actual date from the server since it is 4 hours off(date being selected for change date)
		// console.log(typeof date);
		date = new Date(date);
		date.setHours(date.getHours() + 4);
		date = date.toDateString();
		return date;
	};
	
	var processPrice = function(crop){ // Convert KG to LB (based on request from Farmers)
		crop.price = parseFloat(crop.price.slice(1));
		if (crop.unit && crop.unit.toLowerCase() === "kg"){
			crop.unit = "lb";
			crop.volume = Math.round(crop.volume * 2.20462);
			crop.price = crop.price / 2.20462; 
		}
		return crop;
	};

	$scope.processMissingImgs = function(el){
		console.log(el);
	};
	
	$scope.filterCrops =  function(crop){
		if ( !isNaN(crop.price) && crop.price > 0){ // If valid price and system actual has a price for commodity
			return crop;	
		}
	};

	$scope.manageNotification = function(){
		$state.go("menu.notifications");
	};


	// Load Dates from Server to populate the dropdown menu
	var dateKey = (new Date().toDateString());
	if (!$sessionstorage.exists(dateKey)){
	console.log("No previous Request for Dates");
		$http
			.get("https://agrimarketwatch.herokuapp.com/crops/daily/dates")
			.success(function(data) {
				var dates = _.map(data, processDate);
				dates.reverse();
				dates = dates.slice(0, 5); // Limit date list to the last 5 available dates
				$scope.dates = dates;
				$sessionstorage.setObject(dateKey, dates);
			});
	}else{
		console.log("Using Cached Request for Dates");
		$scope.dates = $sessionstorage.getObject(dateKey);
	}

		

	var MAX_CHECKS = 20;
	var recentCrops;

	// Attempt to Load Data from Cache
	var cropCache = $localstorage.getObject((new Date()).toDateString());
	console.log(Object.keys(cropCache).length);

	if (!cropCache || Object.keys(cropCache).length < 1) { // Data for the date was not found in cache
		// Load from Server
		DailyCrop
			.cropList()
			.then(function(val) {
				val = _.map(val, processPrice);
				$scope.dailycrops = val;
				$ionicLoading.hide();
				$localstorage.setObject((new Date()).toDateString(), val);
			});
	} else {
		console.log('cached');
		$scope.dailycrops = cropCache;
		$ionicLoading.hide();
	}

	//runs when user changes the date picker
	$scope.changeDate = function(selected) {
		// Present Loading Screen 
		$ionicLoading.show({
			template: 'Loading...'
		});

		var cropCache = $localstorage.getObject(selected);
		console.log(cropCache);
		
		if (!cropCache || Object.keys(cropCache).length < 1){
			DailyCrop
				.cropsListByDate(selected)
				.then(function(data) {
					data = _.map(data, processPrice);
					$scope.dailycrops = data;
					$ionicLoading.hide();
					$localstorage.setObject(selected, data);
				});
		}else{
			console.log("cached :" + selected);
			$scope.dailycrops = cropCache;
			$ionicLoading.hide();
		}
	};
		/*
		 * if given group is the selected group, deselect it
		 * else, select the given group
		 */
	$scope.toggleCrop = function(crop) {
		console.log($scope.getProjected(crop));
		
		if ($scope.isCropShown(crop)) {
			$scope.shownCrop = null;
		} else {
			$scope.shownCrop = crop;
			var name = crop.commodity;
			
			var idx = crop.commodity.indexOf('(');
			if (idx !== -1)
				name = (crop.commodity.substr(0, idx)).replace(" ", "");
			
			console.log(name);
			
			var obj = { state: true, checks: 1};
			
			// Attempting to keep a track of how much times a user selects a particular crop (this information will be used for future recommendations);
			
			if ($localstorage.exists(name)){
				var cache = $localstorage.getObject(name);
				obj.state = cache.state;
				obj.checks = (parseInt(cache.checks)) + 1;
			}
			
			// If selected more than MAX CHECKS then ask user if they would like to add crop to their recommendation
			if (obj.checks >= MAX_CHECKS && obj.state === false) {
				showConfirm(crop.commodity);
			}
			$localstorage.setObject(crop.commodity, obj);
		}
	};

	$scope.isCropShown = function(crop) {
		return $scope.shownCrop === crop;
	};

	// Prompt User to add crop to set of recommendations
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
	$scope.getProjected = function(crop) {
		DailyCrop.cropPredByCrop(crop.commodity)
			.then(function(val) {
				$scope.projected = val[0].price;
			});
	};
}])

.controller("CropPriceCtrl", ["$stateParams", "$scope", "$localstorage", function($stateParams, $scope,$localstorage){
	// Making the Assumption that at this point they already have the data cached
	var date = (new Date($stateParams['date'])).toDateString();
	// console.log($stateParams);
	// console.log(new Date($stateParams['date']));
	if (!$localstorage.exists()){
		date = (new Date()).toDateString()
	}

	var cropCache = $localstorage.getObject(date);
	$scope.crop = cropCache.find(function(el){
		if (el.commodity.toLowerCase() === $stateParams.crop.toLowerCase())
			return el;
		else
			return false;
	})
}])

/*NotifyCtrl:
getCrops - Loads crops that are availible.

 */
//populates notificates mgmt page

.controller("NotifyCtrl", ["$scope", "notifyService", "$localstorage", "$ionicLoading","loggedInService", function($scope, notifyService, $localstorage, $ionicLoading, loggedInService) {

	var checkConnection = function() {
		if (navigator && navigator.connection && navigator.connection.type === 'none') {
			return false;
		}
		return true;
	};

	var getCrops = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});


		notifyService
			.getCropNames()
			.then(function(val) {
				var data = val.data;
				var cache = {};
				var resp = cacheCrops(data);
				$scope.crops = resp.states;
				cache.date = (new Date()).toDateString();
				cache.names = resp.names;
				$localstorage.setObject('crops', val);
				$ionicLoading.hide();
			});
	}

	var cacheCrops = function(data) {
		var cropStates = [];
		var names = [];
		for (var i = 0; i < data.length; i++) {
			var curr = {};
			if (!$localstorage.get(data[i])) {
				var idx = data[i].indexOf('(');
				var name = data[i];
				if (idx != -1)
					name = (data[i].substr(0, idx)).replace(" ", "");
				//console.log(name);
				if (!$localstorage.get(name)) {
					names.push(name);
					var obj = {};
					obj.name = name;
					obj.state = 'false';
					obj.checks = 0;
					$localstorage.setObject(name, obj);
					curr.name = name;
					curr.state = false;
					cropStates.push(curr);
				} else {
					var cache = JSON.parse($localstorage.get(name));
					var obj = {};
					obj.name = cache.name;
					obj.state = cache.state;
					obj.checks = cache.checks;
					$localstorage.setObject(name, obj);
				}
			} else {
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

	$scope.cropToggled = function(crop) {
		var name = crop.name.replace(/ +/g, "");
		try {
			var obj = $localstorage.getObject(crop.name);
			obj.state = crop.state;
			$localstorage.setObject(crop.name, obj);
			if (crop.state) {
				parsePlugin.subscribe(name, function() {
					console.log("Client subscribed to crop: " + crop.name);
				}, function(e) {
					alert("Unable to subscribe to crop: " + crop.name);
				});
			} else {
				parsePlugin.unsubscribe(name, function() {
					console.log("Client unsubcribed to crop.");
				}, function(e) {
					alert("error");
				});
			}
		} catch (e) {
			console.log("Error Occurred: " + e);
		}
	}

	// Main of the Notify Controller

	// Check if User Logged In
	var res = loggedInService.checkRedirect("notify");
	if (!res)
		return;

	if ($localstorage.exists('crops')) {
		getCrops();
	} else {
		var check = $localstorage.getObject('crops');
		if (check.date != (new Date()).toDateString()) {
			//console.log(check.date);
			getCrops();
		} else {
			//console.log('cache');
			var crops = []; // = JSON.parse(check.name);
			for (var i = 0; i < check.names.length; i++) {
				crops.push(JSON.parse($localstorage.get(check.names[i])));
			}
			$scope.crops = crops;
		}
	}

}])

.controller("VisualCtrl", ['$scope',"$stateParams","DailyCrop", function($scope, $stateParams, DailyCrop){
	var crop = $stateParams['crop'];

	var processDate = function(date) { // adjust the date to correspond to the actual date from the server since it is 4 hours off(date being selected for change date)
		// console.log(typeof date);
		date = new Date(date);
		date.setHours(date.getHours() + 4);
		date = date.toDateString();
		return date;
	};

	var start = new Date((new Date()).getTime() - (30 * 86400000));

	DailyCrop
		.cropBetweenDates(crop, start)
		.then(function(data){
			console.log("Processing Records " )
			// Process the data in the format need for the chanrts
			var labels = [], price_recs = [], vol_recs = [];
			// Transform the data recieved into the form need for visualization
			_.each(data, function(el){
				labels.push(processDate(el['date']));

				price_recs.push(el['price']);
				vol_recs.push(el['volume']);
			});

			$scope.price_data = [price_recs];
			$scope.volume_data = [vol_recs];
			$scope.price_series = ["Price for " + crop + " per "+data[0].unit+ " in TTD"];
			$scope.volume_series =["Volume for " + crop+ " in " + data[0].unit]
			$scope.labels = labels;
		});

	// console.log("Received: " + crop);
	// $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
	// $scope.series = ['Series A', 'Series B'];

	// $scope.data = [
	// 	[65, 59, 80, 81, 56, 55, 40],
	// 	[28, 48, 40, 19, 86, 27, 90]
	// ];

}])

.filter('capitalize', function() {
	return function(input, all) {
		return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}) : '';
	}
});
var app = angular.module('agrinet.services', ['ngResource'])

app.service("DailyCrop", ['$resource', '$q', '$http', function($resource, $q, $http){
	console.log("Initializing DailyCrop");

	// returns the information form the server of the crops.

	//TODO the difference between the processCropResource and processCropResourceFormatted, is opposite than what is logically expected. Need to be reversed

	// Helper function to return the promise of the REST request for crop prices
	var processCropResource = function(CropResource){
		var deferredObject = $q.defer();

		CropResource.query().$promise.then(
			function(croplist) {
				deferredObject.resolve(_.map(croplist,processListDisplay));
			}, 
			function(error){
				deferredObject.reject(error);
			}
		);
		return deferredObject.promise;
	}

	var processCropResourceFormatted = function(CropResource){
		var deferredObject = $q.defer();

		CropResource.query().$promise.then(
			function(croplist) {
				deferredObject.resolve(_.map(croplist,processListDisplayFormat));
			}, 
			function(error){
				deferredObject.reject(error);
			}
		);
		return deferredObject.promise;
	}

	var dateHelper = function(dateStr){
		var dateObj;
		if (dateStr)
		 	dateObj = new Date(dateStr);
		 else
		 	dateObj = new Date();

		return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
	}

	this.cropList = function(){
		var Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/daily/recent',{}); // https://docs.angularjs.org/api/ngResource/service/$resource
		return processCropResource(Crop);
	};

	// holds the recent dates that information is stored for

	this.cropsListByDate = function(date){
		var dateTxt = dateHelper(date),
			Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/daily/dates/' + dateTxt , {});

		// console.log('Retrieving information from: https://agrimarketwatch.herokuapp.com/crops/daily/dates/' + dateTxt);

		return processCropResource(Crop);
	};

	this.cropBetweenDates = function(crop, start){
		var start_date = dateHelper(start),
			end_date = dateHelper(),
			Crop = $resource("https://agrimarketwatch.herokuapp.com/crops/daily/dates/" + start_date + "/" + end_date+"/"+crop);
			return processCropResourceFormatted(Crop);
	};

	//no information form the server

	this.cropPredictions = function(selDate){
		var Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/predict',{});
		var deferredObject = $q.defer();
		Crop.query().$promise.then(
			function(croplist) {
				deferredObject.resolve(_.map(croplist,processListDisplay));
			}, 
			function(error){
				deferredObject.reject(error);
			});
		return deferredObject.promise;
	};
	
	this.cropPredByCrop = function(selCrop){
		var Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/daily/predict/'+selCrop,{});
		var deferredObject = $q.defer();
		Crop.query().$promise.then(
			function(crop) {
				deferredObject.resolve(_.map(crop,processListDisplay));
			}, 
			function(error){
				deferredObject.reject(error);
			});
		return deferredObject.promise;
	};
	
	//returns monthly dates
	this.cropMonthlyDates = function(){
		return $http
			.get('https://agrimarketwatch.herokuapp.com/crops/monthly/dates')
			.then(function(data) {
				return _.map(data.data, processDate);
			});
	};
	
	var processListDisplay = function(el){
		//remove id
		delete el._id;
		//convert date to human readable form
		el.date = processDate(el.date);
		//make price more presentable
		el.price = "$"+ el.price.toFixed(2);
		return el;
	};

	var processListDisplayFormat =function(el){
		//remove id
		delete el._id;
		//convert date to human readable form
		el.date = processDate(el.date);
		//make price more presentable
		el.price = el.price.toFixed(2);
		return el;
	}
	
	var processDate = function(date){// adjust the date to correspond to the actual date from the server since it is 4 hours off (date which is shown when a crop is selected)
		//console.log(typeof date);
		date = new Date(date);
		date.setHours(date.getHours() + 4);
		date = date.toDateString();
		return date;
	};
	
}])

.factory('notifyService',['$http', function($http) {
	return {
	  getCropNames: function() {
		 return $http.get('https://agrimarketwatch.herokuapp.com/crops/crops');
	  }
	}
}])

.factory('loggedInService', ['$state','$localstorage', function($state, $localstorage){
	return {
		isLoggedIn: function(){
			return ($localstorage.get("login") !== undefined);
		},
		checkRedirect: function(type){
			var login = $localstorage.get("login") ;
			if (!login){
				var mssg = "Unable to proceed without logging in.";
				if (type === "notify" || type === "notification"){
					msg = "Must be logged in to Manage Notifications";
				}
				navigator.notification.alert("Must be logged in to Manage Notifications", function(btn){
					$state.go("menu.login");
				}, "AgriPrice")
				return false;
			}
			return true;
		}
	}
}])

.factory('$localstorage', ['$window', function($window) {
  return {
		set: function(key, value) {
		  $window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
		  return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
		  $window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
		  return JSON.parse($window.localStorage[key] || '{}');
		},
		exists : function(key){
			var val = $window.localStorage[key];
			return (val !== null && val !== undefined);
		}
  	}
}])

.factory("$sessionstorage", ['$window', function($window){
	return {
		set : function(key, value) {
			// if (typeof(value) === 'object')value = JSON.stringify(value);
			$window.sessionStorage.setItem(key, value);
		},
		get : function(key){
			return $window.sessionStorage.getItem(key);
		},
		setObject: function(key, value) {
		  $window.sessionStorage.setItem(key,JSON.stringify(value));
		},
		getObject: function(key) {
		  return JSON.parse($window.sessionStorage.getItem(key) || '{}');
		},
		exists : function(key){
			var val = $window.sessionStorage.getItem(key)
			return (val !== null && val !== undefined);
		}
	}
}])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
	{ id: 0, name: 'Scruff McGruff' },
	{ id: 1, name: 'G.I. Joe' },
	{ id: 2, name: 'Miss Frizzle' },
	{ id: 3, name: 'Ash Ketchum' }
  ];

  return {
	all: function() {
	  return friends;
	},
	get: function(friendId) {
	  // Simple index lookup
	  return friends[friendId];
	}
  }
});

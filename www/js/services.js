var app = angular.module('agrinet.services', ['ngResource']);


app.service("DailyCrop", ['$resource', '$q', '$http', function($resource, $q, $http){
    console.log("Initializing DailyCrop");

    // returns the information form the server of the crops.

    this.cropList = function(){
        var Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/daily/recent',{}); // https://docs.angularjs.org/api/ngResource/service/$resource
        var deferredObject = $q.defer();

        Crop.query().$promise.then(
            function(croplist) {
                deferredObject.resolve(_.map(croplist,processListDisplay));
            }, 
            function(error){
                deferredObject.reject(error);
            }
        );
        return deferredObject.promise;
    };

    // holds the recent dates that information is stored for

    this.cropsByDate = function(date){
        var dateObj = new Date(date);
        console.log(dateObj);

        var dateTxt = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
        console.log(dateTxt);

        console.log('https://agrimarketwatch.herokuapp.com/crops/daily/dates/' + dateTxt);

        var Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/daily/dates/' + dateTxt,{});
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
                console.log(crop);
                deferredObject.resolve(_.map(crop,processListDisplay));
            }, 
            function(error){
                deferredObject.reject(error);
            });
        return deferredObject.promise;
    };
    
    //returns monthly dates
    this.cropDates = function(){
        return $http.get('https://agrimarketwatch.herokuapp.com/crops/monthly/dates').
            then(function(data) {
                //var dates = [];
                //for(var i = 0; i < data.length; i++)
                  //  dates.push(processDate(data[i]));
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
    
    //makes a date string readable
    //var processDate = function(date){
    //    //create a date object based off  "date" passed in.
    //    date  = new Date(date);
    //    date.setDate(date.getDate() + 1);
    //    console.log(date);
    //    date = (date).toDateString();
    //    return date;
    //};

    var processDate = function(date){// adjust the date to correspond to the actual date from the server since it is 4 hours off (date which is shown when a crop is selected)
        console.log(typeof date);
        date = new Date(date);
        date.setHours(date.getHours() + 4);
        date = date.toDateString();
        return date;
    };
    
}])

app.factory('notifyService',['$http', function($http) {
    return {
      getCropNames: function() {
         return $http.get('https://agrimarketwatch.herokuapp.com/crops/crops');
      }
    }
}])

app.factory('$localstorage', ['$window', function($window) {
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

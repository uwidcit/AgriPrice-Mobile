var app = angular.module('agrinet.services', ['ngResource']);


app.service("DailyCrop", ['$resource', '$q', '$http', function($resource, $q, $http){
    console.log("Initializing DailyCrop");
    
    this.cropList = function(){
        var Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/daily/recent',{});
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
     
    this.cropsByDate = function(date){
        var dateObj = new Date(date);
        var dateTxt = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
        console.log(dateTxt);
        var Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/daily/dates' + dateTxt,{});
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
    var processDate = function(date){
        date = (new Date(date)).toDateString();
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

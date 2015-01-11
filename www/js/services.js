var app = angular.module('agrinet.services', ['ngResource']);


app.service("DailyCrop", ['$resource', '$q', function($resource, $q){
  console.log("Initializing DailyCrop");
    
  var Crop = $resource('https://agrimarketwatch.herokuapp.com/crops/daily',{});
  this.cropList = function(){
      var deferredObject = $q.defer();
      Crop.query().$promise.then(
          function(croplist) {
            deferredObject.resolve(_.map(croplist,processListDisplay));
        }, function(error){
            deferredObject.reject(error);
        });
        return deferredObject.promise;
  };
    
    
  var processListDisplay = function(el){
     //remove id
      delete el._id;
      //convert date to human readable form
      el.date = (new Date(el.date)).toDateString();
      //make price more presentable
      el.price = "$"+ el.price.toFixed(2);
      return el;
  };
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

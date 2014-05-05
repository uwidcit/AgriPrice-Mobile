angular.module('agrinet.services', [])


.factory("DailyCrop", function(){
  console.log("Initializing DailyCrop");

  var crops = [
    {"category": "ROOT CROPS", "commodity": "Carrot", "price": 10.8, "volume": 14062.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4bc", "unit": "Kg"}, {"category": "ROOT CROPS", "commodity": "Cassava", "price": 5.56, "volume": 2952.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4bd", "unit": "Kg"}, {"category": "ROOT CROPS", "commodity": "Yam (Local)", "price": 9.2, "volume": 576.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4be", "unit": "Kg"}, {"category": "ROOT CROPS", "commodity": "Yam (Imported)", "price": 17.64, "volume": 0.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4bf", "unit": "Kg"}, {"category": "ROOT CROPS", "commodity": "Dasheen(Local)", "price": 6.94, "volume": 612.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4c0", "unit": "Kg"}, {"category": "ROOT CROPS", "commodity": "Dasheen(Imported)", "price": 5.0, "volume": 8325.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4c1", "unit": "Kg"}, {"category": "ROOT CROPS", "commodity": "Eddoe (Local)", "price": 0.0, "volume": 0.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4c2", "unit": "Kg"}, {"category": "ROOT CROPS", "commodity": "Eddoe (Imported)", "price": 14.45, "volume": 3465.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4c3", "unit": "Kg"}, {"category": "ROOT CROPS", "commodity": "Sweet Potato (Local)", "price": 6.94, "volume": 3960.0, "date": "2014-04-24T00:00:00", "_id": "53605368d9c0b00c48a6e4c4", "unit": "Kg"}
  ];

  var processListDisplay = function(el){
     //remove id
      delete el._id;
      //convert date to human readible form
      el.date = (new Date(el.date)).toDateString();
      //make price more presentable
      el.price = "$"+ el.price.toFixed(2);
      return el;
  };

  return {
    all: function(){
      return _.map(crops,processListDisplay);
    }
  }
})
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

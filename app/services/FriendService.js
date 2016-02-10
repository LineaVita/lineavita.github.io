vitaApp.factory('FriendService', ['uuid', 'pouchDB', '$q', 'broadcastService',
function(uuid, pouchDB, $q, broadcastService) {
  var friendService = {};
  
  friendService.Ready = false;
  friendService.Broadcast = broadcastService;
  
  //Setup the database for friends
  friendService.db = pouchDB("friends");
  
  //Create an index for Friend by Name
  friendService.db.createIndex({ index: { fields: ['LastName', 'FirstName'] } })
  .then(function() {
    friendService.Ready = true;
    friendService.Broadcast.Send('FriendServiceReady', null);
  });
    
  //Save ref to uuid
  friendService.uuid = uuid;
  
  //Add the getFriends method
  friendService.getFriends = function() {
    var deferred = $q.defer();

    friendService.db.allDocs({ include_docs: true, attachments: true })
    .then(function(docs){
      var output = [];

      for (i = 0, len = docs.rows.length; i < len; i++) { 
          output.push(docs.rows[i].doc);
      }

      deferred.resolve(output);
    });

    return deferred.promise;
  };
  
  friendService.getFriend = function(id) {
    var deferred = $q.defer();
    
    friendService.db.get(id)
        .then(function(doc) {
          deferred.resolve(doc);
        });
    
    return deferred.promise;
  }
  
  //Create a new friend
  friendService.newFriend = function(){
    var friend = {};
    friend._id = friendService.uuid.v4();
    friend.FirstName = "";
    friend.LastName = "";
    friend.Email = "";
    friend.Twitter = "";
    friend.BirthDate = null;

    return friend;
  };

  //Load a friend from database
  friendService.loadFriend = function(id) {
    var deferred = $q.defer();

    friendService.db.get(id)
      .then(function(doc) {
        deferred.resolve(doc);         
      });

    return deferred.promise;
  };
  
  //Save a friend to the database
  friendService.saveFriend = function (friend) {
    var deferred = $q.defer();

    if (friend != null) {
      //If the friend._id is null it is new
      if (friend._id == null) {
        friend._id = uuid.v4();

        friendService.db.post(friend)
        .then(function(output) {
          friendService.Broadcast.Send('FriendSaved', friend);
          
          deferred.resolve(output);
        });
      } else {
        //Try to load the friend to get the rev
        friendService.db.get(friend._id)
        .then(function(doc) {
          if (doc != null) {
            //Found the doc so set the rev to the friend
            friend._rev = doc._rev;

            //Perform a put on the friend
            friendService.db.put(friend)
            .then(function(output) {
              friendService.Broadcast.Send('FriendSaved', friend);
              
              deferred.resolve(output);
            });
          } else {
            //Didn't find the doc so just save the new one
            friendService.db.post(friend)
            .then(function(output) {
              friendService.Broadcast.Send('FriendSaved', friend);
              
              deferred.resolve(output);
            });
          }
        })
        .catch(function (err) {
          console.log(err);
        });   
      }
    }
    
    return deferred.promise;   
  };
  
  return friendService;
}]);
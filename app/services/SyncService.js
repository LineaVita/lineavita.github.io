vitaApp.factory('SyncService', ['uuid', '$q', 'awsService', 
                                'PostService', 'FriendService', 
                                'PlaceService',
function(uuid, $q, awsService,
         postService, friendService, 
         placeService, configService) {
  var syncService = {};
  
  syncService.AWSService = awsService;
  syncService.PostService = postService;
  
  syncService.SyncAll = function(lastSyncDate) {
    var deferred = $q.defer();
    
    syncService.SyncPosts(lastSyncDate)
    .then(function() {
      return syncService.SyncPlaces(lastSyncDate);
    })
    .then(function() {
      return syncService.SyncFriends(lastSyncDate);
    })
    .finally(function () {      
      deferred.resolve();
    });
    
    return deferred.promise;
  };
  
  syncService.SyncFriends = function(lastSyncDate) {
    var deferred = $q.defer();      
    
    syncService.AWSService.ListBucket('friends/')
    .then(function (remoteFriends){
      //Get all local posts
      friendService.GetFriends()
      .then(function(localFriends) {
        return syncService.ProcessArrays('friends', localFriends, remoteFriends);
      })
      .then(function() {
        return deferred.resolve();
      }); 
    });
    
    return deferred.promise;
  };
  
  syncService.SyncPosts = function(lastSyncDate) {
    var deferred = $q.defer();      
    
    syncService.AWSService.ListBucket('posts/')
    .then(function (remotePosts) {      
      //Get all local posts
      postService.GetPosts()
      .then(function(localPosts) {
        return syncService.ProcessArrays('posts', localPosts, remotePosts);
      })
      .then(function() {
        return deferred.resolve();
      });       
    });
    
    return deferred.promise;
  };
  
  syncService.SyncPlaces = function(lastSyncDate) {
    var deferred = $q.defer();      
    
    syncService.AWSService.ListBucket('places/')
    .then(function (remotePlaces){
      //Get all local places
      placeService.GetPlaces()
      .then(function(localPlaces) {
        return syncService.ProcessArrays('places', localPlaces, remotePlaces);
      })
      .then(function() {
        return deferred.resolve();
      });           
    });
    
    return deferred.promise;
  };
  
  syncService.AddToArrayIfNotInternal = function(arrayObj, testObj) {
    if (testObj != null) {
      var id = testObj._id;
      if (id != null) {
        var idStart = id.substring(0, 7);
        if (idStart != "_design") {
          arrayObj.push(testObj);
        }
      }
    } 
  }
  
  syncService.ProcessArrays = function(type, localsObjects, remoteObjects) {   
    var deferred = $q.defer(); 
    
    var localsToPush = [];
    var serverToGet = [];
    var localObj = null;
    var i = 0;
    
    if (remoteObjects == null || remoteObjects.Contents.length == 0) {
      if (localsObjects != null && localsObjects.length > 0) {        
        //Push everything up
        for (i = 0; i < localsObjects.length; i++) {
          localObj = localsObjects[i];
          
          syncService.AddToArrayIfNotInternal(localsToPush, localObj);
        }  
      }          
    } else if (localsObjects == null || localsObjects.length == 0) {
      if (remoteObjects != null && remoteObjects.Contents.length > 0) {        
        //Bring everything down
        for (i = 0; i < remoteObjects.Contents.length; i++) {
          serverToGet.push(remoteObjects.Contents[i]);
        }  
      }              
    } else {
      //Loop through weed out what is already on server
      for (i = 0; i < remoteObjects.Contents.length ; i++) {
        var remoteObject = remoteObjects.Contents[i];
        
        var id = remoteObject.Key.slice(type.length + 1, -5);
        var lastModified = Date.parse(remoteObject.LastModified);
        
        var localObject = syncService.FindInList(id, localsObjects, true);
        if (localObject == null) {
          console.log("Remote Object to Get");
          serverToGet.push(remoteObject);          
        } else {
          //Check the date
          console.log("Found object checking date");
        }
      } 
      
      //remaining local objects are not on the server
      for (j = 0; j < localsObjects.length; j++) {
        localObj = localsObjects[j];
        
        syncService.AddToArrayIfNotInternal(localsToPush, localObj);
      }
    } 
    
    syncService.SendAllToServer(type, localsToPush)
    .then(function() {
      deferred.resolve();
    })
    
    return deferred.promise;
  }
  
  syncService.SendAllToServer = function(type, items) {
    var deferred = $q.defer();
    var promises = [];
    
    for (i = 0; i < items.length; i++) {
      var item = items[i];
            
      var promise = syncService.AWSService.Save(type, item);
      promises.push(promise);
    }
    
    $q.all(promises)
    .then(function(values) {
      deferred.resolve();
    });
        
    return deferred.promise;
  }
  
  syncService.PullAllFromServer = function(type, items) {
    
  }
  
  syncService.FindInList = function(id, list, remove) {
    var output = null;
    var element = -1;
    
    for (var j = 0; j<list.length; j++) {
      var obj = list[j];
      
      if (obj._id == id) {
        output = obj;
        element = j;
        break;
      }
    }
    
    if (output != null && remove) {
      list.splice(element, 1);
    }
    
    return output;
  }
 
  return syncService;
}]);
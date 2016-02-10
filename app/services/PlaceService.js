vitaApp.factory('PlaceService', ['uuid', 'pouchDB', '$q', 'broadcastService', 'GeodesyService',
function(uuid, pouchDB, $q, broadcastService, geodesyService) {
  var placeService = {};
  
  //Set variables
  placeService.Broadcast = broadcastService;
  placeService.uuid = uuid;
  placeService.GeodesyService = geodesyService;
  
  //Set ready state
  placeService.Ready = false;
  placeService.NameIndexReady = false;
  placeService.LocationIndexReady = false;
    
  //Setup the database
  placeService.db = pouchDB("places"); 
  
  //Create Indexes
  var nameIndex = { index: { 
      name: "nameIndex",
      fields: ['Name'] 
    }
  };
  
  var locationIndex = { index: { 
      name: "locationIndex",
      fields: ['Latitude', 'Longitude'] 
    }
  };  

  //Create an index for names
  placeService.db.createIndex(nameIndex)
  .then(function() {
    placeService.NameIndexReady = true;
    
    if (placeService.LocationIndexReady) {
      placeService.SetReady();   
    }    
  });
  
  //Create an index for names
  placeService.db.createIndex(locationIndex)
  .then(function() {
    placeService.LocationIndexReady = true;
    
    if (placeService.NameIndexReady) {
      placeService.SetReady();   
    }    
  });
    
  placeService.SetReady = function()
  {
    placeService.Ready = true;
    placeService.Broadcast.Send('PlaceServiceReady', null);
  }
   
  //New Post
  placeService.NewPlace = function() {
    var entry = {};
    
    entry._id = uuid.v4();
    entry.Latitude = null;
    entry.Longitude = null;
    entry.Name = null;
    entry.Description = null;
           
    return entry;
  };
  
  placeService.SavePlaceIfNew = function(placeName, latitude, longitude) {
    var deferred = $q.defer();
    
    placeService.FindPlacesNearPoint(latitude, longitude)
    .then(function(places) {
      var savePlace = true;

      if (places != null) {
        for (i = 0, len = places.length; i < len; i++) { 
          var place = places[i];
          if (place != null && place.Name == placeName) {
            savePlace = false;
          }              
        }
      }
      
      if (savePlace) {
        var placeToSave = placeService.NewPlace();
        placeToSave.Name = placeName;
        placeToSave.Latitude = latitude;
        placeToSave.Longitude = longitude;
        
        placeService.SavePlace(placeToSave)
        .then(function(place) {
          deferred.resolve(place);
        }); 
      } else {
        deferred.resolve(null);
      }
      
    });
    
    return deferred.promise;
  }
  
  placeService.SavePlace = function(entry) {
    var deferred = $q.defer();

    if (entry != null) {
      //if null then a new post
      if (entry._id == null) {
        entry._id = uuid.v4();

        placeService.db.post(entry)
        .then(function(output) {
          placeService.Broadcast.Send('PlaceSaved', entry);
          
          return deferred.resolve(output);
        });
      } else {
        //Try to load the post
        placeService.GetPlace(entry._id)
        .then(function(doc) {
          if (doc != null) {
            //found the post so pull the rev out of it and
            //put it on the post
            entry._rev = doc._rev;
            
            //Save the post to db
            placeService.db.put(entry)
            .then(function(output) {
              placeService.Broadcast.Send('PlaceSaved', entry);
              
              deferred.resolve(output);
            });
          } else {
            //not found so a new post
            placeService.db.post(entry)
            .then(function(output) {
              placeService.Broadcast.Send('PlaceSaved', entry);
              
              deferred.resolve(output);
            });
          }
        });   
      }
    }
    
    return deferred.promise;   
  };
  
  //Get a specific place from the database
  placeService.GetPlace = function(id) {
    var deferred = $q.defer();
    
    placeService.db.get(id)
    .then(function(doc) {
      deferred.resolve(doc);
    })
    .catch(function (err) {
      deferred.resolve(null);         
    });

    return deferred.promise; 
  };
  
  placeService.FindPlacesNearPoint = function(latitude, longitude) {
    var deferred = $q.defer();
    
    var geobox = placeService.GeodesyService.GetGeobox(latitude, longitude, 50);
    
    placeService.FindPlaces(geobox.MinLatitude, geobox.MaxLatitude, geobox.MinLongitude, geobox.MaxLongitude)
    .then(function(places) {
      deferred.resolve(places);
    });    
    
    return deferred.promise;
  }
  
  placeService.FindPlaces = function(minLat, maxLat, minLon, maxLon) {
    var deferred = $q.defer();
    
    var query = {
      selector: {
        $and: [
          { Latitude: { $gte: minLat } },
          { Latitude: { $lte: maxLat } },
          { Longitude: { $gte: minLon } },
          { Longitude: { $lte: maxLon } }
        ]
      }, 
      sort: [ {Latitude: 'desc'}, {Longitude: 'desc'} ] 
    };
    
    placeService.db.find(query)
    .then(function(places) {
        //loop through and just return the actual posts.
        var output = [];
    
        if (places != null && places.docs != null) {
          for (i = 0, len = places.docs.length; i < len; i++) { 
              output.push(places.docs[i]);
          }
        }

        deferred.resolve(output);
    })
    .catch(function (err) {
      deferred.resolve(null);         
    });
    
    return deferred.promise; 
  } 
  
  return placeService;
  
}]);
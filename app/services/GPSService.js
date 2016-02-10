vitaApp.factory('GPSService', ['$q', 
function($q) {
  var gpsService = {};
  
  //Sets up empty object
  gpsService.NewPosition = function() {
    var position = {};
    
    position.Latitude = null;
    position.Longitude = null;
    
    return position;
  };
  
  gpsService.GetLocation = function() {
    var deferred = $q.defer();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          if (pos != null && pos.coords != null) {
            var position = gpsService.NewPosition();

            position.Latitude = pos.coords.latitude;
            position.Longitude = pos.coords.longitude;

            deferred.resolve(position);
          } else {
            deferred.resolve(null);
          }
        });
    } else {
        deferred.resolve(null);
    }
    
    return deferred.promise;
  };
  
  
  gpsService.GetDistanceKM = function(position1, position2) {
    // Adapted from http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // Radius of the earth in km
    
    var lat1 = position1.Latitude;
    var lon1 = position1.Longitude;
    
    var lat2 = position2.Latitude;
    var lon2 = position2.Longitude;
    
    var dLat = gpsService.DegreeToRadian(lat2-lat1);  
    var dLon = gpsService.DegreeToRadian(lon2-lon1); 
    
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(gpsService.DegreeToRadian(lat1)) * Math.cos(gpsService.DegreeToRadian(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;    
  };
  
  gpsService.DegreeToRadian = function(degreeValue) {
    return degreeValue * (Math.PI/180);
  }; 
  
  gpsService.RadianToDegree = function(radianValue) {
    return (radianValue * 180) / Math.PI;
  }; 
  
  gpsService.GetNewPosition = function(startPosition, kmDistance, degreeBearing) {
    // Adapted from http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // Radius of the earth in km
    
    var radLat1 = gpsService.DegreeToRadian(startPosition.Latitude);
    var radLon1 = gpsService.DegreeToRadian(startPosition.Longitude);
    var radBearing = gpsService.DegreeToRadian(degreeBearing);
    
    
    var radLat2 = Math.asin( Math.sin(radLat1)*Math.cos(kmDistance/R) +
                    Math.cos(radLat1)*Math.sin(kmDistance/R)*Math.cos(radBearing) );
    
    var radLon2 = radLon1 + Math.atan2(Math.sin(radBearing)*Math.sin(kmDistance/R)*Math.cos(radLat1),
                         Math.cos(kmDistance/R)-Math.sin(radLat1)*Math.sin(radLon1));
    
    var position = gpsService.NewPosition();
    position.Latitude = gpsService.RadianToDegree(radLat2);
    position.Longitude = gpsService.RadianToDegree(radLon2);    
    return position;
  }
  
  gpsService.GetGeobox = function(centerPosition, kmSize) {
    var north = gpsService.GetNewPosition(centerPosition, kmSize, 0);
    var east = gpsService.GetNewPosition(centerPosition, kmSize, 90);
    var south = gpsService.GetNewPosition(centerPosition, kmSize, 180);
    var west = gpsService.GetNewPosition(centerPosition, kmSize, 270);
    
    var geobox = {};
    geobox.MaxLatitude = north.Latitude;
    geobox.MinLatitude = south.Latitude;
    geobox.MinLongitude = west.Longitude;
    geobox.MinLongitude = east.Longitude;    
    return geobox;    
  }
  
  // factory function body that constructs shinyNewServiceInstance
  return gpsService;
  
}]);
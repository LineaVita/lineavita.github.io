vitaApp.factory('GeodesyService', [ 
function() {
  var geodesyService = {};
  
  geodesyService.GetGeobox = function(latitude, longitude, distance) {
    var point = LatLon(latitude, longitude);
    
    var north = point.destinationPoint(distance, 0);
    var east = point.destinationPoint(distance, 90);
    var south = point.destinationPoint(distance, 180);
    var west = point.destinationPoint(distance, 270);
    
    var output =  { };
    output.MaxLatitude = north.lat;
    output.MinLatitude = south.lat;
    output.MaxLongitude = east.lon;
    output.MinLongitude = west.lon;
    
    return output;    
  }
  
  return geodesyService;
}]);
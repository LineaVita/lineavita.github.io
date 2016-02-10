vitaApp.factory('broadcastService', ['$rootScope',
function($rootScope) {
  var broadcastService = {};
  
  broadcastService.Send = function(msg, data) {
    $rootScope.$broadcast(msg, data);
  };
  
  return broadcastService;
}]);
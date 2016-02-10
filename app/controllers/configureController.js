vitaApp.controller('configureController', ['$scope', '$location', 'ConfigurationService',
function($scope, $location, configurationService) {
  $scope.Configuration = {};
    
  $scope.getConfig = function() {
    configurationService.LoadConfiguration()
    .then(function(config) {
      $scope.Configuration = config;     
    });    
  }
  
  $scope.saveConfig = function(config) {
    configurationService.SaveConfiguration(config)
    .then(function(output) {
      $location.path('/home');                  
    });
  }
  
  $scope.getConfig();
 
}]);
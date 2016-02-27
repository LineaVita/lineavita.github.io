vitaApp.controller('syncController', ['$scope', '$routeParams', '$location', 'ConfigurationService',
                                      'SyncService',
function($scope, $routeParams, $location, configService, syncService) { 
  $scope.LastSyncTime = null;
  $scope.LastSyncTimeString = null;
  $scope.ProgressMode = null;
  $scope.Syncing = false;
    
  $scope.GetLastSyncTimeString = function() {
    configService.GetSettingValueByName('LastAWSSyncTime')
    .then(function (rawValue) {
      if (rawValue != null) {
        var d = new Date(rawValue);
        $scope.LastSyncTime = d;
        $scope.LastSyncTimeString = "Last sync time: " + d.toLocaleDateString() + " " + d.toLocaleTimeString();
      } else {
        $scope.LastSyncTimeString = "Last sync time: Never synced";
      }      
    });
  }
  
  $scope.SyncNow = function () {
    $scope.ProgressMode = "indeterminate";
    $scope.Syncing = true;
    
    syncService.SyncAll($scope.LastSyncTime)
    .then(function(){
      $scope.ProgressMode = "";
      $scope.Syncing = false;
      
      configService.SaveSetting("LastAWSSyncTime", Date.now())
      .then(function() {
        //refresh last sync time
        $scope.GetLastSyncTimeString();        
      });
    });
  }
  
  //Run setup functions
  $scope.GetLastSyncTimeString();

}]);
                                      
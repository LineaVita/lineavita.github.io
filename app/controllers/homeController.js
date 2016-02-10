vitaApp.controller('homeController', ['$scope', 'PostService', 'awsService', 
                                      'FileService', 'ConfigurationService',
                                      'PlaceService',
function($scope, postService, awsService, fileService, configService, placeService) {
  $scope.PostService = postService;
  $scope.FileService = fileService;
  $scope.PlaceService = placeService;
  $scope.ConfigurationService = configService;
  
  $scope.RecentPosts = [];
  $scope.Images = {};
  $scope.Configuration = {};
    
  $scope.GetRecentPosts = function() {
      postService.GetRecentPosts()
      .then(function(posts) {
        $scope.RecentPosts = posts;
        
        $scope.$apply;
    });
  };
  
  $scope.HasFile = function(post) {
    if (post != null && post.FileIds != null) {
      if (post.FileIds.length > 0) {
        return true;
      }        
    }
    
    return false;
  }
  
  $scope.GetFileUrl = function(post) {
    
    if (post != null && post.FileIds != null) {
      if (post.FileIds.length > 0) {
        var id = post.FileIds[0];
        
        if ($scope.Images[id] == null) {
          $scope.Images[id] = null;

          $scope.FileService.GetFile(id)
          .then(function(url) {
            $scope.Images[id] = url;
          });          
        } 

        return $scope.Images[id];
      }        
      
      return null;
    }
  }
  
  $scope.ConfigurationService.LoadConfiguration()
  .then(function(config) {
    $scope.Configuration = config;    
  });
  
  $scope.$on('PostServiceReady', function(event, args){
    $scope.GetRecentPosts();
  });
  
  if (postService.Ready) {
    $scope.GetRecentPosts();  
  }  
  
}]);
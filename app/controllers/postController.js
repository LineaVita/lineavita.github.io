vitaApp.controller('postController', ['$scope', '$routeParams', '$location', 'PostService', 'GPSService', 'FileService', 'PlaceService',
function($scope, $routeParams, $location, postService, gpsService, fileService, placeService) {
  $scope.PostService = postService;
  $scope.GPSService = gpsService;
  $scope.FileService = fileService;
  $scope.PlaceService = placeService;
  
  $scope.ItemsToSave = 0;
  $scope.ItemsSaved = 0;
  
  $scope.PlaceSearchText = null;
  $scope.NearbyPlaces = null;
  $scope.SelectedPlace = null;
  
  $scope.GetGPS = function() {
    $scope.GPSService.GetLocation()
    .then(function (position){
      $scope.Post.Location = position;
      
      $scope.PlaceService.FindPlacesNearPoint(position.Latitude, position.Longitude)
      .then(function(places){
        $scope.NearbyPlaces = places;
      })      
    });
  };
  
  $scope.SavePost = function(post) {
    //Not sure why we are getting an array
    var fileControl = $("#postImage")[0];
    
    if ($scope.SelectedPlace != null) {
      post.Place = $scope.SelectedPlace.Name;
    } else {
      post.Place = $scope.PlaceSearchText;
    }
    
    $scope.ItemsToSave = 1;
    
    if (fileControl != null && fileControl.files != null) {
      
      var fileCount = fileControl.files.length;
      post.FileCount = fileCount;
      post.FileIds = [];
      
      if (post.Place != null && post.Location != null && post.Location.Latitude != null && post.Location.Longitude != null) {
        $scope.ItemsToSave += 1;
        
        $scope.PlaceService.SavePlaceIfNew(post.Place, post.Location.Latitude, post.Location.Longitude)
        .then(function(place) {
          $scope.ItemsSaved += 1;  
          
          if ($scope.ItemsSaved >= $scope.ItemsToSave) {
            $location.path('/home');
          }
        })
      }
          
      $scope.ItemsToSave += fileCount;
    
      for (var i = 0; i < fileCount; i++) {       
        var filename = null;
        var filesize = 0;
        var fileId = $scope.FileService.uuid.v4();

        var file = fileControl.files[i];

        if ('name' in file) {
          filename = file.name;
        }

        if ('size' in file) {
          filesize = file.size;
        }

        post.FileIds.push(fileId);

        $scope.FileService.SaveFile(fileId, filename, filesize, file)
        .then(function() {
          $scope.ItemsSaved += 1;

          if ($scope.ItemsSaved >= $scope.ItemsToSave) {
            $location.path('/home');
          }
        });
      }
    }

    $scope.PostService.SavePost(post)
    .then(function(output) {          
      $scope.ItemsSaved += 1;
        
      if ($scope.ItemsSaved >= $scope.ItemsToSave) {
        $location.path('/home');
      }
    });
  };
  
  $scope.FileNameChanged = function(imgControl) {
    if ($scope.Post != null) {
      var files = imgControl.files;
      var namesArr = [];
      
      for (i = 0, len = files.length; i < len; i++) { 
          namesArr.push(files[i].name)
      }
      
      $scope.Post.Filename = namesArr.join(' ,');
      $scope.$apply();
    }
  };
  
  $scope.GetLocationString = function() {
    return $scope.PostService.GetLocationString($scope.Post.Location);
  };
  
  $scope.GetPostDateString = function() {
    return $scope.PostService.GetPostDateString($scope.Post.PostDateTime)
  };
  
  $scope.Post = postService.NewPost();
  
  //Set the current post to work with
  if ($routeParams.postId != null) {
    postService.GetPost($routeParams.postId)
    .then(function(post) {
      $scope.Post = post;
      $scope.GetLocationString();
    })
    .catch(function(error) {
      console.writeln(error);
    });
  }
  else {
    $scope.GetGPS();
  }
  
}]);
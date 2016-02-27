vitaApp.controller('friendsController', ['$scope', '$location', 'FriendService',
  function($scope, $location, friendService) {

    friendService.GetFriends()
      .then(function(friends) {
        $scope.Friends = friends 
      });
 
}]);
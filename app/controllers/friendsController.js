vitaApp.controller('friendsController', ['$scope', '$location', 'FriendService',
  function($scope, $location, friendService) {

    friendService.getFriends()
      .then(function(friends) {
        $scope.Friends = friends 
      });
 
}]);
vitaApp.controller('friendController', ['$scope', '$location', 'FriendService',
  function($scope, $location, friendService) {
    
    $scope.newFriend = function(){
      return friendService.newFriend();
    }

    $scope.loadFriend = function(id) {
      friendService.loadFriend(id)
        .then(function(friend) {
          return friend;
        });
    };

    $scope.saveFriend = function (friend) {
      friendService.saveFriend(friend)
        .then(function(output) {
          return output;
        });
    };
    
    $scope.saveAndRedirect = function(friend) {
      friendService.saveFriend(friend)
        .then(function (output) {
          $location.path('/friends');
        });           
    };    
}]);
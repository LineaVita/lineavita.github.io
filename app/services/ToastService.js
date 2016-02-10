vitaApp.factory('ToastService', ['$mdToast', 
function($mdToast) {
  var toastService = {};
  
  toastService.Last = {
      bottom: false,
      top: true,
      left: false,
      right: true 
    };
  
  toastService.toastPosition = angular.extend({}, toastService.last);
  
  toastService.getToastPosition = function() {
    toastService.sanitizePosition();
    return Object.keys(toastService.toastPosition)
      .filter(function(pos) { return toastService.toastPosition[pos]; })
      .join(' ');
  };
  
  toastService.ShowToast = function(message) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(message)
        .position(toastService.getToastPosition())
        .hideDelay(3000)
    );
  };
  
  toastService.sanitizePosition = function sanitizePosition() {
    var current = toastService.toastPosition;
    if ( current.bottom && toastService.Last.top ) current.top = false;
    if ( current.top && toastService.Last.bottom ) current.bottom = false;
    if ( current.right && toastService.Last.left ) current.left = false;
    if ( current.left && toastService.Last.right ) current.right = false;
    toastService.Last = angular.extend({},current);
  }
  
  return toastService;
}]);
var vitaApp = angular.module('vita', ['ngRoute', 'pouchdb','ngMaterial', 'angular-uuid'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
	when("/home", {templateUrl: "partials/home.html", controller: "homeController"}).
	when("/configure", {templateUrl: "partials/configure.html", controller: "configureController"}).
	when("/post", {templateUrl: "partials/post.html", controller: "postController"}).
	when("/post/:postId", {templateUrl: "partials/post.html", controller: "postController"}).
	when("/friends", {templateUrl: "partials/friends.html", controller: "friendsController"}).
	when("/friend", {templateUrl: "partials/friend.html", controller: "friendController"}).
	when("/friend/:friendId", {templateUrl: "partials/friend.html", controller: "friendController"}).
	when("/sync", {templateUrl: "partials/sync.html", controller: "syncController"}).
	otherwise({redirectTo:"/home"});
}])
.config(function(pouchDBProvider, POUCHDB_METHODS) {
	
})
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('orange')
		.backgroundPalette('blue-grey');
});
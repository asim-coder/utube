var app = angular.module("app", ["ionic"]);

app.service("FreshlyPressed",["$http", "$log", FreshlyPressed]);

app.controller("AppCtrl",["$scope", "FreshlyPressed", "$log", AppCtrl]);

function AppCtrl ($scope, FreshlyPressed, $log) {
	$scope.posts = [];			
	$scope.refresh = function() {
		FreshlyPressed.getBlogs($scope);
	}
}

function FreshlyPressed($http, $log) {
	this.getBlogs = function($scope){
		$http.jsonp("https://public-api.wordpress.com/rest/v1/freshly-pressed?callback=JSON_CALLBACK").success(function(result){		
				$scope.posts = result.posts;
		});
	};
}
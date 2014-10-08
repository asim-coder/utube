var FreshlyPressed = angular.module("FreshlyPressed", ["ionic"]);

FreshlyPressed.controller("FreshlyPressedCtrl",
                          ["$scope", "$sce", "$ionicLoading", "FreshlyPressedService", "$log", FreshlyPressedCtrl]);

FreshlyPressed.service("FreshlyPressedService",
                       [ "$http", "$log", FreshlyPressedService ]);

function FreshlyPressedCtrl($scope, $sce, $ionicLoading, FreshlyPressedService, $log) {
    $scope.posts = [];
    $scope.beforeDate = null;    
    $scope.infiniteLoad = false;
    $scope.viewBlog = function(url) {        
        window.open(url, "_blank", "location=no");        
    }
    $scope.loadBlogs = function() {
        $scope.infiniteLoad = false;    
        $scope.beforeDate = null;
        if ($scope.posts.length) {
            $scope.posts = [];
            $scope.moreBlogs();
        }        
        $scope.$broadcast("scroll.refreshComplete");
        $scope.infiniteLoad = true; 
    }
    $scope.moreBlogs = function() {    
        $ionicLoading.show({ template: "Loading blogs..."});
        FreshlyPressedService.loadBlogs($scope.beforeDate)
            .success(function(result) {
                $scope.posts = $scope.posts.concat(result.posts);
                $scope.beforeDate = result.date_range.oldest;
                $scope.$broadcast("scroll.infiniteScrollComplete");   
                $ionicLoading.hide();
            });
    }
    $scope.toTrusted = function(text) {
        return ($sce.trustAsHtml(text));
    }
}

function FreshlyPressedService($http, $log) {
    this.loadBlogs = function(date) {
        var params = { number: 15 };
        if (date)
            params.before = date;
        return ($http.get("https://public-api.wordpress.com/rest/v1/freshly-pressed/", {
            params: params
        }));
    }
}
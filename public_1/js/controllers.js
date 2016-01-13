'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AdminPagesCtrl', ['$scope', '$log', 'pagesFactory','DummyFactory','$http', 
    function($scope, $log, pagesFactory,DummyFactory, $http) {
      console.log('calling /api/pages');
      $scope.allPages = DummyFactory.query();
/*      $http.get('/api/pages').then(
        function(res){
            console.log("callback with:" + res.data[3].title);
            $scope.allPages = res.data;
        },
        function(err){
            $log.error(err);
        }
      );*/

      //$scope.allPages = pagesFactory.getPages();
      // pagesFactory.getPages().then(
      //   function(response){
      //     console.log("controller getPages:" + response.data[3].title);
      //     $scope.allPages = response.data;
      //   },
      //   function(err){
      //     $log.error(err);
      //   });
        
        $scope.deletePage = function(id) {
          pagesFactory.deletePage(id);
        };
  }])
  .controller('AdminLoginCtrl', ['$scope','$location','$cookies','AuthService','$log','flashMessageService',
    function($scope,$location,$cookies,AuthService,$log,flashMessageService){
      $scope.credentials={
        username: '',
        password: ''
      };
      $scope.login = function(credentials){
        AuthService.login(credentials).then(
          function(res){
            $cookies.loggedInUser = res.data;
            $location.path('/admin/pages');
          },
          function(err){
            flashMessageService.setMessage(err.data);
            $log.log(err);
          })
      }
    }])
    .controller('AddEditPageCtrl', ['$scope', '$log', 'pagesFactory', '$routeParams', '$location', 'flashMessageService', '$filter',
      function($scope, $log, pagesFactory, $routeParams, $location, flashMessageService, $filter){
        $scope.pageContent = {};
        $scope.pageContent._id = $routeParams.id;
        $scope.heading = "Add a New Page";
        
        console.log($scope.pageContent._id);
        if($scope.pageContent._id !== "0"){
          $scope.heading = "Update Page";
          pagesFactory.getAdminPageContent($scope.pageContent._id).then(
            function(res){
              console.log(res.data);
              $scope.pageContent = res.data;
              //$log.info($scope.pageContent);
            },
            function(err){
              $log.error(err);
            }
            );
        }
        
        $scope.savePage = function(){
          pagesFactory.savePage($scope.pageContent).then(
            function(){
              flashMessageService.setMessage("Page Saved Successfully");
              $location.path('/admin/pages');
            },
            function(){
              $log.error('error saving data');
            }
            );
          $scope.$apply();
        };
        
        $scope.updateURL = function(){
          $scope.pageContent.url = $filter('formatURL')($scope.pageContent.title);
        }
        
      }]);


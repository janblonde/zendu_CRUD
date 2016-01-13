angular.module('main', ['ngRoute', 'core', 'maintenance', 'ngCookies'])
  .factory('authService', AuthService)
  .controller('adminCtrl', AdminCtrl)
  .controller('mainCtrl', MainCtrl)
  .controller('loginCtrl', LoginCtrl)
  .config(function ($routeProvider) {
    $routeProvider.when('/locations', {
      templateUrl: 'views/locations.html'
    });
    $routeProvider.when('/sites', {
      templateUrl: 'views/sites.html',
      controller: 'sitesCtrl'
    });
    $routeProvider.when('/types', {
      templateUrl: 'views/types.html',
      controller: 'typesCtrl'
    });
    $routeProvider.when('/login', {
      templateUrl: 'views/login.html',
      controller: 'loginCtrl'
    });
    $routeProvider.otherwise({
      templateUrl: 'views/main.html',
      controller: 'mainCtrl'
    });
  });

function AdminCtrl($scope, currentSpot) {
  $scope.isActive = isActive;
  $scope.getTitle = getTitle;
  $scope.getActiveMenu = getActiveMenu;

  function isActive(menuId) {
    return currentSpot.getActiveMenu() == menuId;
  }

  function getTitle() {
    return currentSpot.getTitle();
  }

  function getActiveMenu() {
    return currentSpot.getActiveMenu();
  }
}

function MainCtrl(currentSpot) {
}

function AuthService($http){
  return {
    login: function(credentials){
        return $http.post('/api/login', credentials);
    },
    logout: function(){
        return $http.get('/api/logout');
    }
  }
}

function LoginCtrl($scope, authService, $cookies, $location, $log){
  $scope.credentials={
    username: '',
    password: ''
  };
  $scope.login = function(credentials){
    console.log("LOGIN");
    authService.login(credentials).then(
      function(res){
        $cookies.loggedInUser = res.data;
        $location.path('/locations');
      },
      function(err){
        //flashMessageService.setMessage(err.data);
        console.log('ERROR');
        $log.log(err);
      })
  }
}


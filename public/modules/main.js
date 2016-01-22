angular.module('main', ['ngRoute', 'core', 'maintenance', 'locations', 'ngCookies'])
  .factory('authService', AuthService)
  .factory('myHttpInterceptor', MyHttpInterceptor)
  .controller('adminCtrl', AdminCtrl)
  .controller('mainCtrl', MainCtrl)
  .controller('loginCtrl', LoginCtrl)
  .config(function ($routeProvider) {
    $routeProvider.when('/locations', {
      templateUrl: 'views/locations.html'
    });
    $routeProvider.when('/brieven', {
      templateUrl: 'views/brieven.html',
      controller: 'brievenCtrl'
    });
    $routeProvider.when('/facturen', {
      templateUrl: 'views/facturen.html',
      controller: 'facturenCtrl'
    });
    $routeProvider.when('/credits', {
      templateUrl: 'views/credits.html',
      controller: 'creditsCtrl'
    });
    $routeProvider.when('/login', {
      templateUrl: 'views/login.html',
      controller: 'loginCtrl'
    });
    $routeProvider.otherwise({
      templateUrl: 'views/main.html',
      controller: 'mainCtrl'
    });
  })
  .config(function ($httpProvider){
    $httpProvider.interceptors.push('myHttpInterceptor');
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
  };
}

function MyHttpInterceptor($q, $location){
  return{
    response: function(response){
      return response;
    },
    responseError: function(response){
      if(response.status === 401){
        $location.path('login');
        return $q.reject(response);
      }
      return $q.reject(response);
    }
  };
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
      });
  };
}


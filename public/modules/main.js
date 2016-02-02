angular.module('main', ['ngRoute', 'core', 'maintenance', 'locations', 'brieven','ngCookies'])
  .factory('authService', AuthService)
  .factory('myHttpInterceptor', MyHttpInterceptor)
  .controller('adminCtrl', AdminCtrl)
  .controller('mainCtrl', MainCtrl)
  .controller('loginCtrl', LoginCtrl)
  .controller('registerCtrl', RegisterCtrl)
  .config(function ($routeProvider) {
    $routeProvider.when('/locations', {
      templateUrl: 'views/locations.html',
      controller: 'locationsCtrl'
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
    $routeProvider.when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registerCtrl'
    });
    $routeProvider.otherwise({
      templateUrl: 'views/login.html',
      controller: 'loginCtrl'
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
    email: '',
    password: ''
  };
  $scope.login = function(credentials){
    authService.login(credentials).then(
      function(res){
        $cookies.loggedInUser = res.data;
        $location.path('/locations');
      },
      function(err){
        //flashMessageService.setMessage(err.data);
        $log.log(err);
      });
  };
}

function RegisterCtrl($scope, authService, $cookies, $location, $log, serviceApi){
  $scope.register = function(data){
    serviceApi.post("add-user",
    {
      company: data.company,
      vat_number: data.vat_number,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      streetname: data.streetname,
      streetnumber: data.streetnumber,
      zipcode: data.zipcode,
      city: data.city
    }).then(
    function(res){
      authService.login(data).then(
      function(res){
        $cookies.loggedInUser = res.data;
        $location.path('/locations');
      },
      function(err){
        $log.log(err);
      });
    },
    function(err){
      console.log('error!');
    }
    );
  };
}

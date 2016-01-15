angular.module('services',[])
  .constant('apiUrl','http://54.93.65.196:3000/api/')
  .factory('apiService', ['$http','apiUrl', function ($http,apiUrl) {
  
    function request(verb, object, param, data){
      var req = {
        method: verb,
        url: url(object, param),
        headers: {},
        data: data
      };
      return $http(req);
    } 
    
    function url(object, param) {
      if (param==null || !angular.isDefined(param)){
        param = '';
      }
      return apiUrl + object + "/" + param;
    }
    
    return {
  
      apiGET: function(object, param){
        return request("GET",object, param);
      },
    
      apiPOST: function(object, data){
        return request("POST", object, null, data);
      },
    
      apiPUT: function (object, data){
        return request("PUT", object, null, data);
      },
    
      apiDEL: function(object, param){
        return request("DELETE", object, param);
      }
    }
  }]);
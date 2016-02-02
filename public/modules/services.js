angular.module('services',[])
  .factory('serviceApi', serviceApi)
  .constant('apiUrl','http://52.59.253.160:3000/api/')

function serviceApi($http,apiUrl) {

  function request(verb, object, param, data){
    var req = {
      method: verb,
      url: url(object, param),
      headers: {
        'Authorization': ''
      },
      data: data
    }
    return $http(req);
  } 

  function url(object, param) {
    if (param==null || !angular.isDefined(param)){
      param = '';
    }
    return apiUrl + object + "/" + param;
  }

  return {
    get: function (object, param) {
      return request("GET",object, param);
    },
    post: function (object, data) {
      return request("POST", object, null, data);
    },
    delete: function (object, param) {
      return request("DELETE", object, param);
    },
    put: function (object, data) {
      return request("PUT", object, null, data);
    }
  }
}


'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource'])
    .factory('DummyFactory', function ($resource) {
        return $resource('/api/pages', {}, {
            query: { method: 'GET', isArray: true }
        });
    })
    .factory('pagesFactory', ['$http', function($http){
        return {

            getPages: function(){
                 console.log("getPages");
                 return $http.get('/api/pages');
            },
            
            savePage: function(pageData){
                console.log("savePage:" + pageData._id);
                if(pageData._id === "0"){
                    console.log("add");
                    return $http.post('/api/pages/add', pageData);
                }else{
                    console.log("update");
                    return $http.post('/api/pages/update', pageData);
                }
            },
            
            deletePage: function(id){
                return $http.get('/api/pages/delete/' + id);
            },
            
            getAdminPageContent: function(id){
                console.log("getAdminPageContent:" + id);
                return $http.get('/api/pages/admin-details/' + id);
            },
            
            getPageContent: function(url){
                return $http.get('/api/pages/details/' + url);
            }
        };
    }])
    .factory('AuthService', ['$http',function($http){
        return {
            login: function(credentials){
                return $http.post('/api/login', credentials);
            },
            logout: function(){
                return $http.get('/api/logout');
            }
        }
    }]);

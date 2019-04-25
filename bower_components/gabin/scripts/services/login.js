'use strict';

/**
 * @ngdoc service
 * @name materializeApp.login
 * @description
 * # login
 * Service in the materializeApp.
 */
angular.module('materializeApp')
  .service('loginService', function ($http,$q,$rootScope) {
      return {
        consulta: function(cred) {
          var deferred = $q.defer();
          $http.post(url+'/api/genera', cred).then(function(response) {
            if (response.data === 0) {
              toastr('Tu licencia esta caducada', 2000);
              // new Notification('Ups', {body: 'Tu licencia esta caducada', icon: $rootScope.icon});
              // $mdToast.show (
              //   $mdToast.simple()
              //   .textContent('Tu licencia esta caducada')
              //   .hideDelay(2000)
              //   .action('OK')
              //   .toastClass('toast')
              // );
              $rootScope.loader = false;
            }else{
              // $rootScope.tk= response.data;
              // if (params.remember === true) {
                // console.log(response.data);
                deferred.resolve(response.data);
                // localStorage.setItem('token', response.data);
            }
    
            deferred.resolve(response.data);
          }, function (err) {
            deferred.reject(err);
            $rootScope.loader = false;
          });
          $rootScope.loader = true;
          return deferred.promise;
        },
        decodifica: function (obj) {
          var deferred = $q.defer();
          $http.post(url+'/api/decodifica/', obj).then(function (response) {
            deferred.resolve(response.data);
            $rootScope.loader = false;
            // new Notification('BIENVENIDO', {body: p.data.nombre, icon: $rootScope.icon});
          }, function(err){deferred.reject(err);});
          
          return deferred.promise;
        }
      };
    });
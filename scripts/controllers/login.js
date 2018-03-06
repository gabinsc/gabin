'use strict';

/**
 * @ngdoc function
 * @name materializeApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the materializeApp
 */
angular.module('materializeApp')
  .controller('LoginCtrl', function ($scope, loginService, localStorageService, $location, $rootScope) {
    // $rootScope.loader = true;
    credenciales = {};
    localStorageService.remove('token');
    $scope.envia = function (obj) {

      console.log(loginService.consulta(obj).then);
      
      loginService.consulta(obj).then(function (response) {
        if (response === 0) {
          toast('Licencia caducada <a close="toastr">OK</a>', 3000);
        }else{
          localStorageService.set('token', response);
          $location.path('/');
          toast('Bienvenido: '+ credenciales.nombre +' <a close="toastr">OK</a>', 3000);
        }
      }, function (err) {
        toast('Credenciales no validas <a close="toastr">OK</a>', 3000);
        console.log(err);
      });
    };
  });

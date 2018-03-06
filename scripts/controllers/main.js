'use strict';

/**
 * @ngdoc function
 * @name materializeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the materializeApp
 */
angular.module('materializeApp')
  .controller('MainCtrl', function ($scope, $rootScope, localStorageService) {
    $scope.open = function(id){
      if (id) {
        $('.'+id).dropdown('open');
      }
      return {
        borra : function (o) {
          console.log('borrar '+ o.nombre);
        },
        edita : function (o) {
          console.log('edita '+ o.nombre);
        },
        ver : function (o) {
          console.log('ver '+ o.nombre);
        }
      };
    }

    $scope.items;

    $scope.$watch(function() {
      return localStorageService.get('regPag');
    }, function (data) {
      localStorageService.set('regPag', data);
      $scope.pepe.regs = data;
    });
    $scope.$watch(function() {
      return $scope.pepe.regs;
    }, function (data) {
      localStorageService.set('regPag', data);
    });
    $scope.items;
    $scope.pepe = {
      tabla:'items',
      tk: localStorageService.get('token'),
      condicion: [['tcodigo'], ['($1)']],
      res: function(data){
        $scope.items = data;
      }
    };
  });

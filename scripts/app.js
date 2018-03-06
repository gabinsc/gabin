'use strict';

/**
 * @ngdoc overview
 * @name materializeApp
 * @description
 * # materializeApp
 *
 * Main module of the application.
 */
var url = 'http://localhost:3090',
credenciales;
angular
  .module('materializeApp', [
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule',
    'gabrielModule'
  ])
  .run(function($rootScope, localStorageService, loginService, $location) {
    $rootScope.$watch(function() {
      return localStorageService.get('token');
    }, function (data) {
      localStorageService.set('token', data);
      loginService.decodifica({tk:data}).then(function (params) {
          credenciales = params;
          toast('Bienvenido: <a close="toastr">OK</a>'+ credenciales.nombre , 5000);
          // $location.path('/');
      }, function(){
        toast('Inicie seción <a close="toastr">OK</a>', 3000);
        $location.path('/login');
      });
    });
    var loader = document.querySelector('.preloader-wrapper');
    $rootScope.loader = false;
    $rootScope.$watch('loader', function(data) {
      if (data === true) {
        loader.classList.add('active');
      }else{
        loader.classList.remove('active');
      }
    });
  })
  .config(function ($routeProvider, localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('');
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      // .when('/items', {
      //   templateUrl: 'views/items.html',
      //   controller: 'ItemsCtrl',
      //   controllerAs: 'items'
      // })
      .otherwise({
        redirectTo: '/'
      });
  });
'use strict';

/**
 * @ngdoc directive
 * @name materializeApp.directive:navBar
 * @description
 * # navBar
 */
angular.module('materializeApp')
	.directive('navBar', function () {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				btn: '=btn'
			},
			controller: function ($scope, $location, $window) {
				$scope.$watch(function(){return credenciales;}, function (data) {$scope.credencial = data;});
				$scope.$watch(function() {
					return $location.$$url;
				}, function (data) {
					setTimeout(function(){
						if (data <= 992) {
							$('.button-collapse').sideNav({closeOnClick: true});
						}else{
							$('.button-collapse').sideNav();
						}
						Materialize.updateTextFields();
						},1);
					});
				$scope.salir = function () {
					$location.path('/login');
				};
			},
			templateUrl: 'views/navbar.html'
		};
	});

'use strict';
angular.module('gabrielModule', [
	
])
.service('paginadorService', ['$q', '$http', '$rootScope', function($q, $http, $rootScope) {
	return {
		filtro: function(obj){
			var deferred = $q.defer();
			$rootScope.loader = true;
			$http.post('http://localhost:3090/api/filtro', obj)
			.then(function(response){
				$rootScope.loader = false;
				deferred.resolve(response.data);
				// console.log(response.data)
			},function(err){
				console.error('error en filtro: '+ obj.tabla, [JSON.stringify(err)]);
			});
			// console.log(obj)
			return deferred.promise;
		}
	}
}])
.controller('paginaCrtl', ['$scope', 'paginadorService', '$q', function($scope, paginadorService, $q){
	var deferred = $q.defer();
	$scope.paginas = [];
	$scope.totalPag;
	$scope.flechas = [];
	var t = $scope.parametro,
	nroPaginas,
	limite = 0,
	reset = function(a, b){
		if(a === undefined || a === ''){
			return b===true ? 1 : '' ;
		}else{
			return a;
		}
	},
	junta = function(o){
		/* var e = [];
		for (var i = 0; i < o.length; i++) {
			e.push(o[i]+' = ($'+(i+1)+')');
		}
		return e; esto retorna este valor: tcodigo = 'fas' and 000001 = ($2) */

		var e = [];
		// console.log(o)
		for (var i = 0; i < o[0].length; i++) {
			e.push(o[0][i]+' = '+o[1][i]);
		}
		return e;
	},
	creaPagina = function(o, r){
		if ($scope.totalPag !== 0) {
			if(r.Npag == undefined || r.Npag == ''){
				$scope.cambiaPag(1)
			}
			var array = [],
			Npag = Math.floor(o/r.regs);
			// console.log(Npag);
			if (Npag*r.regs === o){
				Npag = Npag+1;
			}else{
				// console.log('+1');
				Npag = Npag+2;
			}
			nroPaginas = Npag;
			for (var i = 0; i < Npag-1; i++) {
				if (i >= limite && i <= limite+9) {
					array.push({c:function(){
						if( i+1 === r.Npag ){return 'active'}else{return 'waves-effect'}
					}(),n:i+1});
				}
			}
			// console.log(array[0].n === 1);
			// console.log(Npag -1);
			
			if (array[0].n === 1) {$scope.flechas[0] = 'disabled'}else{$scope.flechas[0] = 'waves-effect'};
			if (array[array.length-1].n === Npag -1) {$scope.flechas[1] = 'disabled'}else{$scope.flechas[1] = 'waves-effect'};
			return array;
		}else{
			$scope.flechas = ['disabled','disabled'];
		}
	};

	$scope.ejecuta = function(obj){
		// console.log(p.condicion)
		// console.log($scope.parametro)
		paginadorService.filtro(function(o){
			// console.log('nombre like \'%'+reset($scope.filtro, false)+'%\'')
				return o==''|| o==undefined?{
					tk		: t.tk || '',
					tabla	: t.tabla || '',
					filtro	: 'nombre like \'%'+reset($scope.filtro, false)+'%\'' || '',
					NregPag	: t.regs || 50,
					Npag	: reset(t.Npag, true) || 1,
					condicion : junta(t.condicion).join(' and ') || '',
					loader	: t.loader || ''
				}:{
					tk		: o.tk,
					tabla	: o.tabla,
					filtro	: 'nombre like \'%'+reset($scope.filtro, false)+'%\'',
					NregPag	: o.regs || 50,
					Npag	: reset(o.Npag, true) || 1,
					condicion : junta(o.condicion).join(' and '),
					loader	: o.loader
				}
		}(obj)).then(function(response){
			$scope.totalPag = parseFloat(response.shift().count);
			// console.log(Npag)
			$scope.paginas = creaPagina($scope.totalPag, t);
			// $scope.cambiaPag(1)
			if ($scope.parametro.res) {
				$scope.parametro.res(response);
			}else{
				console.warn('res no esta declarado');
			}
		})

		return deferred.promise;
	}
	$scope.parametro.ejecuta = $scope.ejecuta;
	$scope.ejecuta(t);
	$scope.envia = function(filtro){
		$scope.filtro = filtro;
		$scope.cambiaPag(1);
		$scope.ejecuta(t);
	}
	$scope.cambiaPag = function(pagina){
		if(pagina !== t.Npag){
			// console.log(pagina);
			t.Npag = pagina;
			$scope.ejecuta(t);
		}
	}
	$scope.cambiaN = function(opcion, estado) {
		if (estado === 'waves-effect') {
			if (opcion === '+') {
				// console.log(opcion)
				limite = limite +10;
			}else if (opcion === '-') {
				limite = limite -10;
			}
			$scope.paginas = creaPagina($scope.totalPag, t)
		}
	}

	scrollTo(0,0);
	var q = document.querySelector('nav.waves-effect.waves-light'), qq = q.offsetTop;;
	q.style.boxShadow = 'none';
	window.addEventListener('scroll', function(){
		scrollY > qq ? q.style.boxShadow= '0 8px 17px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)' : q.style.boxShadow = 'none';
	})
}])
.directive('appPaginador', function () {
	return{
		restrict: 'E',
		transclude: true,
		scope: {
			parametro: '=options'
		},
		template: '<!-- <nav class="navbar">'+
		'<div class="nav-wrapper">'+
'			<a app-href="'/'" class="brand-logo center">Logo</a>'+
'			<ul>'+
				'<li app-href="\'/tabla\'"><a>Sass</a></li>'+
'			</ul>'+
		'</div>'+
	'</nav> -->'+
	'<nav class="waves-effect waves-light" style="position: sticky;top: 0px;z-index: 2;">'+
		'<span class="badge white-text right";>resultados encontrados: {{totalPag}}</span>'+
		'<div class="input-field">'+
'			<input id="search" type="search" ng-model="filtro" ng-keydown="$event.which === 13 && envia(filtro)">'+
'			<label for="search" class="active centra" ng-click="envia(filtro)"><i class="material-icons">search</i></label>'+
'			<i class="material-icons centra" ng-click="envia(\'\')">close</i>'+
		'</div>'+
	'</nav>'+
	'<div ng-transclude=""></div>'+
		// '<div>'+
			'<div class="row" style="margin-bottom: 0; display: flex; justify-content: center;">'+
				'<div class="col s6 l4 range-field" style="margin: initial;">'+
					'<input style="z-index: 2;" type="range" ng-model="parametro.regs" ng-mouseup="envia(filtro)" min="1" max="100" />'+
				'</div>'+
			'</div>'+
			'<ul class="pagination">'+
			'<!-- <li class="disabled"><a><i class="material-icons">first_page</i></a></li> -->'+
			'<li ng-class="flechas[0]" ng-click="cambiaN(\'-\', flechas[0])"><a><i class="material-icons">chevron_left</i></a></li>'+
			'<!-- <li class="active"><a>1</a></li> -->'+
			'<li ng-repeat="pagina in paginas" ng-click="cambiaPag(pagina.n)" style="width: 40px;" ng-class="pagina.c"><a>{{pagina.n}}</a></li>'+
			'<li ng-class="flechas[1]" ng-click="cambiaN(\'+\', flechas[1])"><a><i class="material-icons">chevron_right</i></a></li>'+
			'<!-- <li class="waves-effect"><a><i class="material-icons">last_page</i></a></li> -->'+
			'</ul>'+
		// '</div>'+
	'<style>'+
		'.pagination{'+
'			display: flex;'+
'			justify-content: center;'+
		'}'+
		'.centra{'+
'			cursor: pointer !important;'+
'			height: 100% !important;'+
'			position: absolute !important;'+
'			top: 0 !important;'+
'			display: flex !important;'+
'			align-items: center !important;'+
		'}'+
	'</style>',
		// templateUrl: 'paginador.html',
		// template: '<nav class="navbar"><div class="nav-wrapper"><a app-href="'/'" class="brand-logo center">Logo</a><ul><li app-href="\'/tabla\'"><a>Sass</a></li></ul></div></nav><nav class="waves-effect waves-light" style="position: sticky;top: 0px;"><span class="badge white-text right">resultados encontrados: {{totalPag}}</span><div class="input-field"><input id="search" type="search" ng-model="filtro" ng-keydown="$event.which === 13 && envia(filtro)"><label for="search" class="active centra" ng-click="envia(filtro)"><i class="material-icons">search</i></label><i class="material-icons centra" ng-click="envia(\'\')">close</i></div></nav><div ng-transclude=""></div><ul class="pagination"><!-- <li class="disabled"><a><i class="material-icons">first_page</i></a></li> --><li ng-class="flechas[0]" ng-click="cambiaN('-', flechas[0])"><a><i class="material-icons">chevron_left</i></a></li><!-- <li class="active"><a>1</a></li> --><li ng-repeat="pagina in paginas" ng-click="cambiaPag(pagina.n)" style="width: 40px;" ng-class="pagina.c"><a>{{pagina.n}}</a></li><li ng-class="flechas[1]" ng-click="cambiaN('+', flechas[1])"><a><i class="material-icons">chevron_right</i></a></li><!-- <li class="waves-effect"><a><i class="material-icons">last_page</i></a></li> --></ul><style>.pagination{display: flex;justify-content: center;}.centra{cursor: pointer !important;height: 100% !important;position: absolute !important;top: 0 !important;display: flex !important;align-items: center !important;}',
		controller: 'paginaCrtl'
	}
})
var toast = function() {
	var style = document.createElement('style');
	style.innerText='@media only screen and (max-width: 600px) {.toast {width: 100% !important;border-radius: 0 !important;bottom: 0%;top: initial !important;}}@media only screen and (min-width: 601px) and (max-width: 992px) {.toast {left: 5%;bottom: 7%;max-width: 90%;top: initial !important;}}@media only screen and (min-width: 993px) {.toast {top: 10%;right: 7%;max-width: 86%;}}.toast {box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);border-radius: 2px;top: 35px;width: auto;clear: both;margin-top: 10px;position: fixed;max-width: 100%;height: auto;min-height: 48px;/* line-height: 1.5em; */word-break: break-all;background-color: #323232; padding: 6px 6px 6px 25px; font-weight: 300;color: #fff;display: -webkit-flex;display: -ms-flexbox;display: flex;-webkit-align-items: center;-ms-flex-align: center;align-items: center;-webkit-justify-content: space-between;-ms-flex-pack: justify;justify-content: space-between;font-family: roboto; min-height: 17px;font-size: 14px;min-width: 288px;max-width: 568px;transition: all .3s;animation: toastShow .3s;z-index: 999;}.toast a{cursor: pointer;display: flex;align-items: center;color: #FFB300;text-decoration: none;float: right;margin-left: 48px;}.toast>div{min-height: 36px; line-height: 36px;}@keyframes toastShow {0%{transform: translateY(100%);opacity: 0.5;}100%{transform: translateY(0);opacity: 1;}}';
	document.head.appendChild(style);

	var container = document.createElement('div');
	container.id = 'toast-container';
	document.body.appendChild(container);

	// =================================================

	var toast = function(text, delay){
		var element = document.createElement('div');
		element.classList.add('toast');
		var body = document.createElement('div');
		
		if (text) {
			body.innerHTML = text;
		}else{
			body.innerHTML = ' ';
		}
		element.appendChild(body);
		if (body.querySelector('a')) {
			body.querySelectorAll('a').forEach(function(obj) {
				obj.classList.add('btn-flat')
				obj.classList.add('waves-effect')
				obj.classList.add('waves-light')
				element.appendChild(obj);
			});
		}
		container.appendChild(element);
		
		// if (!delay) {
		// 	delay = 5000;
		// }
		
		var btnClose = document.querySelectorAll('[close="toastr"]');
		btnClose.forEach(function(elemento) {
			elemento.addEventListener('click', function() {
				toast.clear(element);
			})
		});
		
		if (delay) {
			setTimeout(function() {
				toast.clear(element);
			}, delay);
		}
		element.clear = function(){
			toast.clear(element)
		};
		return element;
	}

	toast.clear = function (id) {
		if (id) {
			id.style.transform = 'translateY(200%)';
			id.style.opacity= '0';
			setTimeout(function() {
				id.remove();
			}, 300);
		}else{
			var elements = document.querySelectorAll('.toast');
			elements.forEach(function(elements)  {
					elements.style.transform = 'translateY(100%)';
					elements.style.opacity= '0';
				setTimeout(function() {
					elements.remove();
				}, 300);
			});
		}
	}
	return toast;
}();
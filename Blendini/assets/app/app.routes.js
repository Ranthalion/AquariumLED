(function(){

	angular.module('blendiniApp').config(routeConfig);
	
	routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

	function routeConfig($stateProvider, $urlRouterProvider, $locationProvider){
		
		//remove hash (#) from urls
		//$locationProvider.html5Mode(true);

		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'app/modules/home/home.html',
				controller: 'homeController',
				controllerAs: 'homeVm'
			})
			.state('settings', {
				url: '/settings',
				templateUrl: 'app/modules/settings/settings.html',
				controller: 'settingsController',
				controllerAs: 'settingsVm'
			})
			.state('scheduler', {
				url: '/scheduler',
				templateUrl: 'app/modules/schedule/schedule.html',
				controller: 'scheduleController'

			})
			.state('console', {
				url: '/console',
				templateUrl: 'app/modules/console/console.html',
				controller: 'consoleController',
				controllerAs: 'consoleVm'
			})
			.state('log', {
				url: '/log',
				template: '<div>Coming Soon</div>'
			});
	}

})();
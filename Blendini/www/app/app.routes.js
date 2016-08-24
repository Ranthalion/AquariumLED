(function(){

	angular.module('blendiniApp').config(routeConfig);
	
	routeConfig.$inject = ['$stateProvider', '$urlRouteProvider'];

	function routeConfig($stateProvider, $urlRouteProvider){
		
		$urlRouteProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'app/modules/home.html',
				controller: 'homeController'
			})
			.state('settings', {
				url: '/settings',
				templateUrl: 'app/modules/settings.html',
				controller: 'settingsController'
			})
			.state('schedule', {
				url: '/schedule',
				templateUrl: 'app/modules/schedule.html',
				controller: 'scheduleController'

			})
			.state('log', {
				url: '/log',
				template: '<div>Coming Soon</div>'
			});
	}

})();
var blendiniApp = angular.module('blendiniApp', ['ngResource']);

blendiniApp.controller('SettingsCtrl', ['$scope', '$http', 'Channel',
	function($scope, $http, Channel){
		$scope.settings = Channel.query();

		$scope.submit = function(){

			$scope.settings.forEach(function(setting){
				Channel.update(setting);
			});
			toastr.success('Channel settings have been saved.')
			
			
		};
	}
]);

blendiniApp.factory('Channel', ['$resource',
  	function($resource){
    	return $resource('/channel/:id', {id: '@id'}, {
    		'update': {method: 'PUT'}
    	});
	}
]);

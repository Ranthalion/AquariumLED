(function(){
	angular.module('blendiniApp').factory('systemStateService', systemStateService);

	systemStateService.$inject = ['$resource'];

	function systemStateService($resource){
		return $resource('/systemstate/:id', {id: '@id'}, {
			'update': {method: 'PUT'}
		});
	}
})();
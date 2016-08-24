(function(){
	angular.module('blendiniApp').factory('scheduleService', scheduleService);

	scheduleService.$inject = ['$resource'];

	function scheduleService($resource){
		return $resource('/schedule/:id', {id: '@id'}, {
			'update': {method: 'PUT'},
			'query': {method: 'GET', isArray:true, params: {populate: 'transitions'} }
		});
	}
})();
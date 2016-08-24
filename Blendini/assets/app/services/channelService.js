(function(){
	angular.module('blendiniApp').factory('channelService', channelService);

	channelService.$inject = ['$resource'];

	function channelService($resource){
		return $resource('/channel/:id', {id: '@id'}, {
			'update': {method: 'PUT'}
		});
	}
})();
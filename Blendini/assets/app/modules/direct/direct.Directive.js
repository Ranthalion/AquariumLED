(function(){
	angular.module('blendiniApp').directive('direct', function(){
		
		return {
			restrict: 'EA',
			scope: {
			},
			controller: 'directController',
			controllerAs: 'directVm',
			templateUrl: 'app/modules/direct/direct.html',
			bindToController: true
		};
	});
}());
(function(){
	angular.module('blendiniApp').directive('historyChart', function(){
		
		return {
			restrict: 'EA',
			scope: {
				setting: '='
			},
			controller: 'historyChartController',
			controllerAs: 'historyChart',
			templateUrl: 'app/modules/historyChart/HistoryChart.html',
			bindToController: true
		};
	});
}());
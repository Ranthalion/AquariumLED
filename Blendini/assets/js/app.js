var blendiniApp = angular.module('blendiniApp', ['ngResource', 'rzModule']);

blendiniApp.controller('SettingsCtrl', ['$scope', '$http', 'Channel',
	function($scope, $http, Channel){
		$scope.settings = Channel.query();

		$scope.getTextColor = function(r,g,b){
			var yiq = ((r*299)+(g*587)+(b*114))/1000;
			return (yiq >= 128) ? 'black' : 'white';
		};
	}
]);

blendiniApp.controller('SettingCtrl', ['$scope', '$timeout', 'Channel', 
	function($scope, $timeout, Channel){
		var timeout = null;
		var saveUpdates = function() {
			if ($scope['form_' + $scope.$id].$valid) {
				Channel.update($scope.setting);
			} else {
				toastr.error('Unable to save settings for Port ' + $scope.setting.port + ' because it is invalid.');
			}
		};
		var debounceUpdate = function(newVal, oldVal) {
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout(saveUpdates, 2000);
			}
		};
		$scope.$watch('setting.color', debounceUpdate);
		$scope.$watch('setting.red', debounceUpdate);
		$scope.$watch('setting.green', debounceUpdate);
		$scope.$watch('setting.blue', debounceUpdate);

	}
	]);

blendiniApp.factory('Channel', ['$resource',
	function($resource){
		return $resource('/channel/:id', {id: '@id'}, {
			'update': {method: 'PUT'}
		});
	}
]);


blendiniApp.controller('DirectCtrl', ['$scope', 'Channel',
	function($scope, Channel){
		
		//closure function to use in loop.
		var getColor = function(r, g, b){
			return function(){ return 'rgb(' + r + ',' + g + ',' + b + ')'; }
		} 

		Channel.query({}, function(response){
			for(var i = 0; i <response.length; i++){
				var channel = response[i];
				var rgb = 'rgb(' + channel.red + ',' + channel.green + ',' + channel.blue + ')';
				response[i].sliderOptions = {
					showSelectionBar: true,
					hidePointerLabels: true,
    				hideLimitLabels: true,
					floor: 0,
					ceil: 4095,
					step: 1,
					getPointerColor: getColor(channel.red, channel.green, channel.blue),
					getSelectionBarColor: getColor(channel.red, channel.green, channel.blue)
				};				
			}
			$scope.settings = response;
		});

	}
]);
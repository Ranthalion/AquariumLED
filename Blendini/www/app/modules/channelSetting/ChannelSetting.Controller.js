(function(){

	angular.module('blendiniApp').controller('channelSettingController', channelSettingController);
	
	channelSettingController.$inject = ['$scope', '$timeout', 'channelService'];

	function channelSettingController($scope, $timeout, channelService){
		$scope.getTextColor = function(r,g,b){
			var yiq = ((r*299)+(g*587)+(b*114))/1000;
			return (yiq >= 128) ? 'black' : 'white';
		};
		var timeout = null;
		var saveUpdates = function() {
			if ($scope['form_' + $scope.$id].$valid) {
				channelService.update($scope.setting);
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

})();
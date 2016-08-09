(function(){
	angular.module('channelSetting', []).directive('channelSetting', function(){
		
		return {
			restrict: 'EA',
			scope: {
				setting: '='
			},
			controller:  function($scope, $timeout, Channel){
				$scope.getTextColor = function(r,g,b){
					var yiq = ((r*299)+(g*587)+(b*114))/1000;
					return (yiq >= 128) ? 'black' : 'white';
				};
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
			},
			link: function(scope, element, attrs, controllers){

			},
			templateUrl: 'app/shared/channelSetting/ChannelSettingView.html'
		};
	});
}());
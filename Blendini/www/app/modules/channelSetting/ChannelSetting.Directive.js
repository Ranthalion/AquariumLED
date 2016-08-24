(function(){
	angular.module('channelSetting', []).directive('channelSetting', function(){
		
		return {
			restrict: 'EA',
			scope: {
				setting: '='
			},
			controller: 'channelSettingController',
			controllerAs: 'channelSetting',
			templateUrl: 'app/modules/channelSetting/ChannelSettingView.html'
		};
	});
}());
(function(){
	angular.module('blendiniApp').directive('channelSetting', function(){
		
		return {
			restrict: 'EA',
			scope: {
				setting: '='
			},
			controller: 'channelSettingController',
			controllerAs: 'channelSetting',
			templateUrl: 'app/modules/channelSetting/ChannelSetting.html',
			bindToController: true
		};
	});
}());
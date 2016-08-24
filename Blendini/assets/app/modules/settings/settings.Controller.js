(function(){

	angular.module('blendiniApp').controller('settingsController',settingsController);

	settingsController.$inject = ['channelService'];

	function settingsController(channelService){
		var settingsVm = this;
		settingsVm.settings = channelService.query();
	}

})();
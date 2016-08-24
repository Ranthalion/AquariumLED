(function(){

	angular.module('blendiniApp').controller('directController', directController);

	directController.$inject = ['$scope', 'channelService', 'systemStateService', '$http'];

	function directController($scope, channelService, systemStateService, $http){
		var directVm = this;
		directVm.scheduleEnabled = true;
		directVm.settings = [];
		directVm.state = {};

		//closure function to use in loop.
		var getColor = function(r, g, b){
			return function(){ return 'rgb(' + r + ',' + g + ',' + b + ')'; }
		} 

		systemStateService.query({}, function(state){
			
			if (state.length == 1){
				directVm.state = state[0];
				directVm.scheduleEnabled = (directVm.state.mode == 'schedule');	
			}			
		});

		channelService.query({}, function(response){
			console.log('Channels recieved.  Setting readonly to ' + directVm.scheduleEnabled);
			for(var i = 0; i <response.length; i++){
				var channel = response[i];
				var rgb = 'rgb(' + channel.red + ',' + channel.green + ',' + channel.blue + ')';
				response[i].sliderOptions = {
					id: channel.port,
					showSelectionBar: true,
					hidePointerLabels: true,
    				hideLimitLabels: true,
					floor: 0,
					ceil: 4095,
					readOnly: directVm.scheduleEnabled,
					step: 1,
					getPointerColor: getColor(channel.red, channel.green, channel.blue),
					getSelectionBarColor: getColor(channel.red, channel.green, channel.blue),
					onEnd: function(id, model, hi){ 
						$http.post('/setChannel', {channel: id, value: model})
						console.log('end: '+ id + ' ' + model + ' ' + hi);
					}
				};				
			}
			directVm.settings = response;
		});
		
		$http.get('/currentValues').then(function(response){
			for(var i = 0; i < response.data.length; i++){
				directVm.settings[i].value = response.data[i];
			}
		});


		$scope.$watch('directVm.scheduleEnabled', function(newVal, oldVal){ 
			if (newVal != oldVal){
				directVm.state.mode = (newVal ? 'schedule' : 'direct');
				console.log('Slider Readonly set to ' + newVal);
				directVm.settings.forEach(function(setting){ 
					setting.sliderOptions.readOnly=newVal; 
				});
				systemStateService.update(directVm.state);
				if (directVm.state.mode == 'schedule'){
					$http.get('/start');
				}
				else{
					$http.get('/clear');
				}
			}
		});

	}

})();
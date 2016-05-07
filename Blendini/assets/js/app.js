var blendiniApp = angular.module('blendiniApp', ['ngResource', 'rzModule', 'toggle-switch', 'channelSetting', 'ui.bootstrap']);

blendiniApp.constant("moment", moment);

blendiniApp.controller('SettingsCtrl', ['$scope', '$http', 'Channel',
	function($scope, $http, Channel){
		$scope.settings = Channel.query();
	}
]);

blendiniApp.factory('Channel', ['$resource',
	function($resource){
		return $resource('/channel/:id', {id: '@id'}, {
			'update': {method: 'PUT'}
		});
	}
]);

blendiniApp.factory('Schedule', ['$resource',
	function($resource){
		return $resource('/schedule/:id', {id: '@id'}, {
			'update': {method: 'PUT'},
			'query': {method: 'GET', isArray:true, params: {populate: 'transitions'} }
		});
	}
]);

blendiniApp.factory('SystemState', ['$resource',
	function($resource){
		return $resource('/systemstate/:id', {id: '@id'}, {
			'update': {method: 'PUT'}
		});
	}
]);


blendiniApp.controller('DirectCtrl', ['$scope', 'Channel', 'SystemState', '$http',
	function($scope, Channel, SystemState, $http){

		$scope.scheduleEnabled = true;
		$scope.settings = [];
		$scope.state = {};

		//closure function to use in loop.
		var getColor = function(r, g, b){
			return function(){ return 'rgb(' + r + ',' + g + ',' + b + ')'; }
		} 

		SystemState.query({}, function(state){
			
			if (state.length == 1){
				$scope.state = state[0];
				$scope.scheduleEnabled = ($scope.state.mode == 'schedule');	
			}			
		});

		Channel.query({}, function(response){
			console.log('Channels recieved.  Setting readonly to ' + $scope.scheduleEnabled);
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
					readOnly: $scope.scheduleEnabled,
					step: 1,
					getPointerColor: getColor(channel.red, channel.green, channel.blue),
					getSelectionBarColor: getColor(channel.red, channel.green, channel.blue),
					onEnd: function(id, model, hi){ 
						$http.post('/setChannel', {channel: id, value: model})
						console.log('end: '+ id + ' ' + model + ' ' + hi);
					}
				};				
			}
			$scope.settings = response;
		});
		
		$http.get('/currentValues').then(function(response){
			for(var i = 0; i < response.data.length; i++){
				$scope.settings[i].value = response.data[i];
			}
		});

		$scope.$watch('scheduleEnabled', function(newVal, oldVal){ 
			if (newVal != oldVal){
				$scope.state.mode = (newVal ? 'schedule' : 'direct');
				console.log('Slider Readonly set to ' + newVal);
				$scope.settings.forEach(function(setting){ 
					setting.sliderOptions.readOnly=newVal; 
				});
				SystemState.update($scope.state);
				if ($scope.state.mode == 'schedule'){
					$http.get('/start');
				}
				else{
					$http.get('/clear');
				}
			}
		});

	}
]);

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
		return $resource('/schedule/:id?populate=transitions', {id: '@id'}, {
			'update': {method: 'PUT'},
			'query': {method: 'GET', populate: 'transitions', isArray:true }
		});
	}
]);


blendiniApp.controller('DirectCtrl', ['$scope', 'Channel',
	function($scope, Channel){
		//TODO: [ML] Get the current light controller mode as scheduled or direct
		$scope.scheduleEnabled = true;
		$scope.settings = [];

		//closure function to use in loop.
		var getColor = function(r, g, b){
			return function(){ return 'rgb(' + r + ',' + g + ',' + b + ')'; }
		} 

		Channel.query({}, function(response){
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
					readOnly: true,
					step: 1,
					getPointerColor: getColor(channel.red, channel.green, channel.blue),
					getSelectionBarColor: getColor(channel.red, channel.green, channel.blue),
					onEnd: function(id, model, hi){ 
						//TODO: [ML] Call to serial service to set immediate
						//TODO: [ML] Add class to handle communication to and from serial port, including message formatting
						console.log('end: '+ id + ' ' + model + ' ' + hi);
					}
				};				
			}
			$scope.settings = response;
		});
		
		$scope.$watch('scheduleEnabled', function(newVal, oldVal){ 
			//TODO: [ML] Add something here to query current settings and periodically get new settings if set to scheduled
			$scope.settings.forEach(function(setting){ 
				setting.sliderOptions.readOnly=newVal; 
			});
		});

	}
]);

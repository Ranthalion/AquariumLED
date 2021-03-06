(function(){

	angular.module('blendiniApp').controller('scheduleController',scheduleController);
	
	scheduleController.$inject = ['$scope', 'moment', 'channelService', 'scheduleService', '$http'];

	function scheduleController($scope, moment, channelService, scheduleService, $http){
		$scope.schedule = {};
		$scope.settings = channelService.query();
		$scope.settingToAdd = {
			time: null,
			values: [0,0,0,0,0,0]
		};

		
		var schedules = scheduleService.query({}, function(schedules){
			if (schedules && schedules[0]){
				$scope.schedule = schedules[0]; 
			}
		});
		
		$scope.addSchedule = function(){
			if (!$scope.schedule.transitions){
				$scope.schedule.transitions = [];
			}
			$scope.schedule.transitions.push($scope.settingToAdd);
			$scope.settingToAdd = {
				time: null,
				values: [0,0,0,0,0,0]
			};
			$scope.scheduleForm.$setDirty();
		};

		$scope.remove = function(setting){
			var index = $scope.schedule.transitions.indexOf(setting);
  			$scope.schedule.transitions.splice(index, 1); 
  			$scope.scheduleForm.$setDirty();
		};

		$scope.save = function(){
			scheduleService.save($scope.schedule, function(){
				console.log('refresh now.');
				$http({
				  method: 'POST',
				  url: '/refresh'
				});
			});
			$scope.scheduleForm.$setPristine();	
		};

		$scope.timeComparator =  function(v1, v2) {

			if (v1 instanceof Date && v2 instanceof Date){
				if (v1.getHours() == v2.getHours()){
					return (v1.getMinutes() < v2.getMinutes()) ? -1 : 1;
				}
				else{
					return (v1.getHours() < v2.getHours()) ? -1 : 1;
				}

			}
			else{
      			return (v1 < v2) ? -1 : 1;
    		}
  		};

	}

})();

angular.module('blendiniApp').controller('ScheduleCtrl', ['$scope', 'moment', 'Channel', 'Schedule',
	function($scope, moment, Channel, Schedule){
		$scope.schedule = {};
		$scope.settings = Channel.query();
		
		var schedules = Schedule.query({}, function(schedules){
			if (schedules && schedules[0]){
				$scope.schedule = schedules[0]; 
			}
		});
		
		$scope.addSchedule = function(){
			if (!$scope.schedule.transitions){
				$scope.schedule.transitions = [];
			}
			$scope.schedule.transitions.push({time: moment(), values: [0,0,0,0,0,0]});
			$scope.scheduleForm.$setDirty();
		};

		$scope.remove = function(setting){
			var index = $scope.schedule.transitions.indexOf(setting);
  			$scope.schedule.transitions.splice(index, 1); 
  			$scope.scheduleForm.$setDirty();
		};

		$scope.save = function(){
			Schedule.save($scope.schedule);
			$scope.scheduleForm.$setPristine();	
		};

	}
]);


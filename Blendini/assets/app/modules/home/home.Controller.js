(function(){

	angular.module('blendiniApp').controller('homeController',homeController);
	
	homeController.$inject = ['scheduleService', 'channelService'];

	function homeController(scheduleService, channelService){
		
		var homeVm = this;
		homeVm.snapshotUrl = "snapshot/small";

		homeVm.refreshSnapshot = function(){
			homeVm.snapshotUrl = "snapshot/small?_ts=" + new Date().getTime();
		};

		homeVm.settings = channelService.query();
		var schedules = scheduleService.query({}, function(schedules){
			if (schedules && schedules[0]){
				homeVm.schedule = schedules[0]; 
			}
		});

		homeVm.timeComparator =  function(v1, v2) {
			console.log('comparing ' + v1 + ' to ' + v2);
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

	angular.module('blendiniApp').directive('backImg', function(){
	    return function(scope, element, attrs){
	    	console.log('back-img processing');
	        attrs.$observe('backImg', function(value) {
	        	console.log('value =' + value);
	            element.css({
	                'background-image': 'url(' + value +')',
	                'background-size' : 'cover'
	            });
	        });
	    };
	});
})();
(function(){
	angular.module('blendiniApp').factory('calibrationService',calibrationService);

	calibrationService.$inject = ['$http'];

	function calibrationService($http){

		var api = {
			clear: clear,
			calibrateLow: calibrateLow, 
			calibrateMid: calibrateMid,
			calibrateHigh: calibrateHigh
		};

		return api;

		function clear(){
			return $http.post("/calibration/clear");
		}

		function calibrateLow(){
			return $http.post("/calibration/setLow");
		}

		function calibrateMid(){
			return $http.post("/calibration/setMid");
		}

		function calibrateHigh(){
			return $http.post("/calibration/setHigh");
		}

		function temparature(temp){
			return $http.post('calibration/temperature');
		}

	}
})();
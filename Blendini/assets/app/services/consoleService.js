(function(){
	angular.module('blendiniApp').factory('consoleService', consoleService);

	consoleService.$inject = ['$http'];

	function consoleService($http){

		var api = {
			sendChar: sendChar,
			readAll: readAll, 
			sendCommand: sendCommand
		};

		return api;

		function sendChar(char){
			$http.post("/console/sendchar", {char: char});
		}

		function readAll(){
			return $http.get("/console/readAll");
		}

		function sendCommand(command){
			return $http.post("/console/sendchar", {char: command});
		}

	}
})();
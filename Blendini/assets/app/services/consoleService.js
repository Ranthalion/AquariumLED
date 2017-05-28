(function(){
	angular.module('blendiniApp').factory('consoleService', consoleService);

	consoleService.$inject = ['$http'];

	function consoleService($http){

		var api = {
			sendChar: sendChar,
			readAll: readAll, 
			sendCommand: sendCommand,
			readPhRegister: readPhRegister
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

		function readPhRegister(address){
			console.log(address);
			return $http.post("/console/readPhRegister", {address: address});
		}

	}
})();
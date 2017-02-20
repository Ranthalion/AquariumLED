(function(){

	angular.module('blendiniApp').controller('consoleController', consoleController);
	
	consoleController.$inject = ['consoleService'];

	function consoleController(consoleService){
		var consoleVm = this;

		consoleVm.sendChar = sendChar;
		consoleVm.readAll = readAll;
		consoleVm.sendCommand = sendCommand;

		consoleVm.output = "";

		function sendChar(char){
			consoleService.sendChar(char);
			consoleVm.output += "\n" + char;
		}

		function readAll(){
			consoleService.readAll().then(function(response){
				consoleVm.output += "\n" + response.data;				
			});			
		}

		function sendCommand(){
			consoleService.sendCommand(consoleVm.command);
			consoleVm.command = '';
		}

	}

})();
(function(){

	angular.module('blendiniApp').controller('calibrationController', calibrationController);

	calibrationController.$inject = ['calibrationService'];

	function calibrationController(calibrationService){
		var calibrationVm = this;
		
		calibrationVm.reset = reset;
		calibrationVm.setPh7 = setPh7;
		calibrationVm.setPh4 = setPh4;
		calibrationVm.setPh10 = setPh10;

		calibrationVm.disable7 = true;
		calibrationVm.disable4 = true;
		calibrationVm.disable10 = true;
		calibrationVm.resetChecked = false;
		calibrationVm.ph7Checked = false;
		calibrationVm.ph4Checked = false;
		calibrationVm.ph10Checked = false;

		calibrationVm.resetInProgress = false;
		calibrationVm.ph7InProgress = false;
		calibrationVm.ph4InProgress = false;
		calibrationVm.ph10InProgress = false;

		function reset(){
			calibrationVm.resetInProgress = true;
			calibrationService.clear().then(function(){
				calibrationVm.resetInProgress = false;
				calibrationVm.disable7 = false;
				calibrationVm.disable4 = true;
				calibrationVm.disable10 = true;
				calibrationVm.resetChecked = true;
				calibrationVm.ph7Checked = false;
				calibrationVm.ph4Checked = false;
				calibrationVm.ph10Checked = false;	
			})
			.catch(function(){
				alert('There was an error clearing calibration');
			});
		}

		function setPh7(){
			calibrationVm.ph7InProgress = true;
			calibrationService.calibrateMid().then(function(){
				calibrationVm.ph7InProgress = false;
				calibrationVm.disable4 = false;
				calibrationVm.ph7Checked = true;	
			})
			.catch(function(){
				alert('There was an error setting PH 7 calibration');
			});
		}

		function setPh4(){
			calibrationVm.ph4InProgress = true;
			calibrationService.calibrateLow().then(function(){
				calibrationVm.ph4InProgress = false;
				calibrationVm.disable10 = false;
				calibrationVm.ph4Checked = true;
			})
			.catch(function(){
				alert('There was an error setting PH 4 calibration');
			});
		}

		function setPh10(){
			calibrationVm.ph10InProgress = true;
			calibrationService.calibrateLow().then(function(){
				calibrationVm.ph10InProgress = false;
				calibrationVm.ph10Checked = true;
			})
			.catch(function(){
				alert('There was an error setting PH 10 calibration');
			});
		}
	}

})();
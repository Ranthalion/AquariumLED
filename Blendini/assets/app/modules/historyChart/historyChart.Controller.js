(function(){

	angular.module('blendiniApp').controller('historyChartController', historyChartController);
	
	historyChartController.$inject = ['moment', '$http', 'channelService'];

	function historyChartController(moment, $http, channelService){
		var historyChart = this;

		historyChart.currentTankTemperature = null;
		historyChart.currentPh = null;
		historyChart.airTemperatures = [];
		historyChart.tankTemperatures = [];
		historyChart.phReadings = [];

		historyChart.colors = [ '#46BFBD', '#FDB45C', '#949FB1'];
		historyChart.series = ['PH', 'Air', 'Water'];
		historyChart.data = [ [], [], [] ];

		historyChart.options = {
			//hover: {
			//	intersect: false
			//},
			scales: {
		      xAxes: [{
		        type: 'time',
		        position: 'bottom', 
		        beginAtZero: false,
		      }],
		      yAxes: [{
		      	id: 'temp',
		      	type: 'linear', 
		      	position: 'left',
		      	ticks: {min: 18, max: 24}
		      }, 
		      {
		      	id: 'ph',
		      	type: 'linear', 
		      	position: 'right',
		      	ticks: {min: 2, max: 6}
		      }
		      ]
		    }
		};

		historyChart.datasetOverride = [
			{yAxisID: 'ph', fill: false, label: 'PH'}, 
			{yAxisID: 'temp', fill: false, label: 'Air'}, 
			{yAxisID: 'temp', fill: false, label: 'Water'} 
		];

		var date = moment().subtract(2, 'days').format();
		
		$http.get('/temperatureReading?where={"probe":1,"time":{">": "' + date + '"}}&sort=time DESC')
		.then(function(response){
			historyChart.tankTemperatures = response.data;
			historyChart.currentTankTemperature = historyChart.tankTemperatures[0].celcius;
			historyChart.data[2] = historyChart.tankTemperatures.map(function(temp){ 
				return {x: new Date(temp.time), y: temp.celcius};
			});
		});

		$http.get('/temperatureReading?where={"probe":2,"time":{">": "' + date + '"}}&sort=time DESC')
		.then(function(response){
			historyChart.airTemperatures = response.data;
			historyChart.currentAirTemperature = historyChart.airTemperatures[0].celcius;
			historyChart.data[1] = historyChart.airTemperatures.map(function(temp){ 
				return {x: new Date(temp.time), y: temp.celcius};
			});
		});

		$http.get('/phReading?where={"time":{">": "' + date + '"}}&sort=time DESC')
		.then(function(response){
			historyChart.phReadings = response.data;
			historyChart.currentPh = historyChart.phReadings[0].ph;
			historyChart.data[0] = historyChart.phReadings.map(function(ph){ 
				return {x: new Date(ph.time), y: ph.ph};
			});
		});
		
	}

})();
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
			tooltips: {
				mode: 'x'
			},
			legend: {display: true},
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
		      	ticks: {min: 7.5, max: 9}
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
		
		$http.get('https://70dg60pln0.execute-api.us-east-1.amazonaws.com/prod/temperature?probe=1')
		.then(function(response){
			historyChart.tankTemperatures = response.data;
			if (historyChart.tankTemperatures.length > 0){
				historyChart.currentTankTemperature = historyChart.tankTemperatures[0].temperature;
				historyChart.data[2] = historyChart.tankTemperatures.map(function(temp){ 
					if (temp.temperature < historyChart.options.scales.yAxes[0].ticks.min){
						historyChart.options.scales.yAxes[0].ticks.min = Math.floor(temp.temperature); 
					}
					if (temp.temperature > historyChart.options.scales.yAxes[0].ticks.max){
						historyChart.options.scales.yAxes[0].ticks.max = Math.ceil(temp.temperature);
					}
					return {x: new Date(temp.timestamp), y: temp.temperature};
				});
			}
		});
		
		$http.get('https://70dg60pln0.execute-api.us-east-1.amazonaws.com/prod/temperature?probe=2')
		.then(function(response){
			historyChart.airTemperatures = response.data;
			if(historyChart.airTemperatures.length > 0){
				historyChart.currentAirTemperature = historyChart.airTemperatures[0].temperature;
				historyChart.data[1] = historyChart.airTemperatures.map(function(temp){
					if (temp.temperature < historyChart.options.scales.yAxes[0].ticks.min){
						historyChart.options.scales.yAxes[0].ticks.min = Math.floor(temp.temperature);
					}
					if (temp.temperature > historyChart.options.scales.yAxes[0].ticks.max){
						historyChart.options.scales.yAxes[0].ticks.max = Math.ceil(temp.temperature);
					} 
					return {x: new Date(temp.timestamp), y: temp.temperature};
				});
			}
		});
		
		$http.get('https://70dg60pln0.execute-api.us-east-1.amazonaws.com/prod/phReading')
		.then(function(response){
			historyChart.phReadings = response.data;
			if (historyChart.phReadings.length > 0){
				historyChart.currentPh = historyChart.phReadings[0].ph;
				historyChart.data[0] = historyChart.phReadings.map(function(ph){
					if (ph.ph < historyChart.options.scales.yAxes[1].ticks.min){
						historyChart.options.scales.yAxes[1].ticks.min = ph.ph;
					}
					if (ph.ph > historyChart.options.scales.yAxes[1].ticks.max){
						historyChart.options.scales.yAxes[1].ticks.max = ph.ph;
					} 
					return {x: new Date(ph.timestamp), y: ph.ph};
				});
			}
		});
		
	}

})();
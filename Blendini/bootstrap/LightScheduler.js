var Cron = require('cron');

// Private
var _jobs = [];

function fadeLights(channels){
	var buf = new Buffer(9);
	buf[0] = 'f'.charCodeAt();
	for(var i = 0; i < 6; i++){
		buf[i+1] = parseInt(channels[i]);
	}
	buf[7] = '\r'.charCodeAt();
	buf[8] = '\n'.charCodeAt();

	sails.log.debug('Executing Fade Lights');
	sails.log.debug(buf);

	SerialService.write(buf);
};

// Public
var self = module.exports = {

	start: function start(){
		
		Schedule.find({}).populate('transitions').exec(function findCB(err, schedules){
			if (err){
				console.log('Error getting schedules: ' + err);
				return;
			}
			if (schedules != null && schedules.length > 0){
				var transitions = schedules[0].transitions;

				if (transitions != null && transitions.length > 0){

					
					transitions.forEach(function(transition){
						
						var hour = transition.time.getHours();
						var minute = transition.time.getMinutes();
						var second = transition.time.getSeconds();
						var cronTime = second + " " + minute + " " + hour + " * * *";
						sails.log.debug('Loading ' + cronTime + ' ' + transition.values);
						
						var job = new Cron.CronJob(cronTime, function(){
							sails.log.debug('In CRON callback');
							fadeLights(transition.values);
						}, null, true, null);
						_jobs.push(job);
						});
					}
				}

			});			
	},
	
  	clear: function clear(){
  		for(var i = 0; i < _jobs.length; i++){
  			_jobs[i].stop();
  		}
  	}, 

  	getCurrentValues: function getCurrentValues(cb){

  		var data_cb = function(data){
  			sails.log.debug('data :' + data);
  			//port.removeListener('data', data_cb);
  			if (cb != null){
  				cb(data.splice(1,6));
  			}
  		};

  		sails.log.debug('Scheduler GetCurrentValues');
  		SerialService.writeLine('r', data_cb);
  		//port.on('data', data_cb);
  	},

  	setChannel: function setValue(pin, value){
  		sails.log.debug('s'+ pin  + 'v' + value);
  		var buf = new Buffer(3);
  		buf[0] = 's'.charCodeAt();
  		buf[1] = pin;
  		buf[2] = value;
  		SerialService.writeLine(buf);
  	}

};

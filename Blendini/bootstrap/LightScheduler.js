var Cron = require('cron');

// Private
var _jobs = [];

function fadeLights(channels){
	sails.log.debug('Executing Fade Lights');
	sails.log.debug(channels);
};

// Public
var self = module.exports = {

	start: function start(){
		
		Schedule.find({}).populate('transitions').exec(function findCB(err, schedules){
			if (err){
				console.log('Error getting schedules: ' + err);
				return;
			}
			var transitions = schedules[0].transitions;

			transitions.forEach(function(transition){
				var hour = transition.time.getHours();
				var minute = transition.time.getMinutes();
				var second = transition.time.getSeconds();
				var cronTime = second + " " + minute + " " + hour + " * * *";
				sails.log.debug('Loading ' + cronTime + ' ' + transition.values);
				
				var job = new Cron.CronJob(cronTime, function(){fadeLights(transition.values);}, null, true, null);
				_jobs.push(job);
			});
		});
		
	},
	
  	clear: function clear(){
  		for(var i = 0; i < _jobs.length; i++){
  			_jobs[i].stop();
  		}
  	}  

};

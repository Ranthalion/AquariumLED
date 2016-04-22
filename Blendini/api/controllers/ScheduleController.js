/**
 * ScheduleController
 *
 * @description :: Server-side logic for managing schedules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	refresh: function(req, res){
		console.log('Stop all the jobs from the controller')
		var scheduler = require('../../bootstrap/LightScheduler');
		scheduler.clear();
		scheduler.start();
		return res.ok();
	}

};

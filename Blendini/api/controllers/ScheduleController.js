/**
 * ScheduleController
 *
 * @description :: Server-side logic for managing schedules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	saveAll: function(req, res){
		console.log(req.body);
		return res.ok();
	}

};

var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , DAL = require('BLL/DAL');

var ScheduleController = new Controller();

ScheduleController.main = function() {
	var db = new DAL();
	var view = this;
	db.getSchedule(function(err, schedule){
		view.title = 'Schedule Visualizer';
		view.schedule = schedule;
		view.render();
	});
}

ScheduleController.read = function(){
	var db = new DAL();
	var view = this;
	db.getSchedule(function(err, schedule){
		if (err != null){
			view.res.json({error:err});
		}
		else{
			view.res.json({'schedule': schedule});
		}
	});
}

ScheduleController.saveSchedule = function(){
	var schedule = this.req.body.schedule;
	
	var db = new DAL();	  
	db.saveSchedule(schedule);
	
	this.res.json({result:'success', data:this.req.body.schedule});
}

module.exports = ScheduleController;

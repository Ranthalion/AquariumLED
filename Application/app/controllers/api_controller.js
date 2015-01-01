var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , DAL = require('BLL/DAL');

var ApiController = new Controller();

ApiController.getChannels = function(){
	
	var db = require('redis').createClient();
	var self = this;
	db.get('currentChannelSettings', function(err, reply){
		db.quit();
		 var currentChannelSettings = JSON.parse(reply);
		if (!(currentChannelSettings instanceof Array)){ 
			currentChannelSettings = [];
		}
		for(var i = currentChannelSettings.length; i <6; i++){
			currentChannelSettings[i] = {
			name:'undefined',
			r:0,g:0,b:0,value:0
			};
		}
		self.res.json(currentChannelSettings);
	});
};

ApiController.setChannels = function(){

	var settings = this.req.body;
	var channels = [];
	for(var i = 0; i < 6; i++){
		channels[i] = {};
		channels[i].name = settings.name[i];
		channels[i].r = settings.r[i];
		channels[i].g = settings.g[i];
		channels[i].b = settings.b[i];
		channels[i].value = settings.value[i];
	}
	
	var db = require('redis').createClient();
	db.set('currentChannelSettings', JSON.stringify(channels));
	db.quit();
	
	this.res.json({result:'success'});

};

ApiController.getMode = function(){
	var db = new DAL();
	var response = this;
  
	db.getCurrentMode(function(err, mode){
		response.res.json(mode);
	}
};

ApiController.setMode = function(){
	console.log(this.req.body);
	
	var dal = new DAL();
	var payload = this.req.body;
	dal.saveMode(payload.mode);
	dal.quit();
	
	var db = require('redis').createClient();
	db.publish('setting_change', payload.mode);
	db.quit();
};

ApiController.getSchedule = function(){
	var db = new DAL();
	var response = this;
  
	db.getSchedule(function(err, schedule){
		db.quit();
		response.res.json(schedule);
	});
};

ApiController.setSchedule = function(){
	var schedule = this.req.body.schedule;
	
	var db = new DAL();	  
	db.saveSchedule(schedule);
	
	this.res.json({result:'success', data:this.req.body.schedule});
};

module.exports = ApiController;
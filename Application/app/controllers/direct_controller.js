var locomotive = require('locomotive')
  , Controller = locomotive.Controller
  , DAL = require('BLL/DAL');

var DirectController = new Controller();

DirectController.index = function() {
  var db = new DAL();
  var view = this;
  //TODO: Also retrieve the current mode and send that out in the view.
  db.getCurrentMode(function(err, mode){
	  db.getCurrentSetting(function(err, setting){
		view.title = 'Direct Control';
		view.setting = setting;
		view.mode = mode;
		view.render();
	  });
  });
  
}

DirectController.setMode = function() {
	console.log(this.req.body);
	var db = require('redis').createClient();
	var dal = new DAL();
	var payload = this.req.body;
	dal.saveMode(payload.mode);
	dal.quit();
	db.publish('setting_change', payload.mode);
	db.quit();
}

DirectController.update = function() {
	
	var db = require('redis').createClient();
	db.publish('led_change', JSON.stringify(this.req.body));
	db.quit();
	var request = this.req.body;
	if (request.channels){
		var db = new DAL();
		db.getCurrentSetting(function currentSettingsCB(err, setting){
			if (err)
				throw new Error(err);
			
			for(var i = 0; i < request.channels.length; i++){
				setting[i].value = request.channels[i];
			}
			db.saveCurrentSetting(setting);
			db.quit();
		});
		this.res.json({result:'success'});
	}
	else{
		this.res.json({result:'failure'});
	}
}

module.exports = DirectController;

var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var SettingsController = new Controller();

SettingsController.channels= function() {
  this.title = 'Channel Settings';
  var db = require('redis').createClient();
  var self = this;
  db.get('currentChannelSettings', function(err, reply){
	db.quit();
	self.currentChannelSettings = JSON.parse(reply);
	if (!(self.currentChannelSettings instanceof Array)){ 
		self.currentChannelSettings = [];
	}
	for(var i = self.currentChannelSettings.length; i <6; i++){
		self.currentChannelSettings[i] = {
		name:'undefined',
		r:0,g:0,b:0,value:0
		};
	}
	self.title = 'Set up the Channels';
	console.log(self.currentChannelSettings);
	self.render();
  });
}

SettingsController.savechannels = function() {
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
}

module.exports = SettingsController;

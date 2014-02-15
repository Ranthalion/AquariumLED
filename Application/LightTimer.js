var DAL = require('BLL/DAL');
var moment = require('moment');
var redis = require('redis');

var db = redis.createClient();
var dal = new DAL():
var schedule = null;


//Check the mode to see if it is active or scheduled
var timeoutID = null;
var cb = function(){
	console.log('callback triggered');
	//TODO: Read the schedule and calculate the current slice...
	//TODO: Do something with this - db.publish('led_change', '{}');
};

dal.getCurrentMode(function(err, mode){
	if (mode == 'schedule'){
		dal.getSchedule(function(err, data){
			schedule = data;
			cb();
			timeoutID = setInterval(cb, 1000 * 30);
		}
	}
});

db.subscribe('schedule_change');
db.subscribe('setting_change');

db.on('message', function(channel, message){
	console.log('channel: ' + channel + '. message: ' + message);
	switch(channel)
	{
		case 'schedule_change': 
			scheduleChanged(message);
		break;
		case 'setting_change':
			settingChange(message);
		break;
		default: 
			console.log('Unknown channel received: ' + channel);
		break;
	}
});

function scheduleChanged(message){
	console.log('Recieved schedule_change: ' + message);
	schedule = message;
}

function settingChange(message){
	if (message == 'schedule'){
		clearInterval(timeoutID);
		cb();
		timeoutID = setInterval(cb, 1000* 30);
	}
	else{
		clearInterval(timeoutID);
	}
}

function mix(current, next, j, stepsInSlice){
	var result = {r:0,g:0,b:0};
	result.r = current.r + (((next.r - current.r)/stepsInSlice) * j);
	result.g = current.g + (((next.g - current.g)/stepsInSlice) * j);
	result.b = current.b + (((next.b - current.b)/stepsInSlice) * j);
	return result;
}

function createSlices(s){
	var r = new Array(360);
	
	for(var i = 0; i < 360; i++){
		r[i] = {r:0,g:0,b:0};
	}
	
	if (s.length == 1)
	{
		for(var i = 0; i < 360; i++){
			r[i] = s[0].toRGB();
		}
	}
	else if (s.length > 1)
	{		
		for(var i = 0; i < s.length; i++)
		{
			var startSlice = Math.floor((s[i].time.getMinutes() + s[i].time.getHours() * 60) / 4);
			var endSlice = i == s.length - 1 ? (s[0].time.getMinutes() + s[0].time.getHours() * 60) / 4 : (s[i+1].time.getMinutes() + s[i+1].time.getHours() * 60) / 4;
			endSlice = Math.floor(endSlice);
			
			var current = s[i].toRGB();
			var next = s[(i<s.length-1 ? i+1 : 0)].toRGB();
			var stepsInSlice = endSlice >= startSlice ? endSlice - startSlice : 360-startSlice + endSlice;
			
			for(var j = 0; j < stepsInSlice; j++)
			{
				r[(startSlice + j) % 360] = mix(current, next, j, stepsInSlice);
			}
		}
	}
	return r;
}
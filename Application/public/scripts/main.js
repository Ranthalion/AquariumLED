function Setting(t, c){
    this.time = t;
    this.channelSettings = c;    
}

Setting.prototype = {
	constructor : Setting
}

Setting.prototype.toRGB = function(){
	var colors = new Array();
	for(var i in this.channelSettings){
		colors.push(this.channelSettings[i].color);
	}
	return Color.Mix(colors);
}

function createSetting(time, v1, v2, v3, v4, v5, v6){
	var c = [
		{name:'Cool White', color:new Color(212,235,255, v1)},
		{name:'Red', color:new Color(255,0,0, v2)},
		{name:'Green', color:new Color(0,255,0, v3)},
		{name:'Blue', color:new Color(0,0,255, v4)},
		{name:'Royal Blue', color:new Color(65,105,225, v5)}
		{name:'UV', color:new Color(150,0,160, v6)}
	];
	return new Setting(new Date('1/1/2000 ' + time), c);
}

function hydrate(data){
	var time = new Date(data.time);
	var colors = data.channelSettings;
	var c = [
		{name:'Cool White', color:new Color(212,235,255, colors[0].color.a)},
		{name:'Red', color:new Color(255,0,0, colors[1].color.a)},
		{name:'Green', color:new Color(0,255,0, colors[2].color.a)},
		{name:'Blue', color:new Color(0,0,255, colors[3].color.a)},
		{name:'Royal Blue', color:new Color(65,105,225, colors[4].color.a)}
	];
	return new Setting(time, c);
}

var itemToEdit;
var settings;

var schedule = new Array();
var scheduleItem = {
	time: '12:00',
	ch1: 0,
	ch2: 0,
	ch3: 0,
	ch4: 0,
	ch5: 0,
	ch6: 0	
};

$(function(){	

	//Initialize the channel editor with channel settings
	//Then get the schedule and load it into the channel editor

	$.get('schedule/read', function(data){
		settings = new Array();
		if (data.schedule && data.schedule.length > 0)
		{
			for(var i =0; i < data.schedule.length; i++){
				settings.push(hydrate(data.schedule[i]));
			}
		}
		else{
			settings.push(createSetting('12:00', 0, 0, 0, 0, 0, 0));
			//Populate new fake ones
		}
		
		//settings.push(createSetting('5:00', 1, 1,1,1,1));
		//settings.push(createSetting('14:00', 1, 1,1,1,1));
		var editor = $('#editor').channelEditor({channels: settings[0].channelSettings});
		//initialize Raphael
		var paper = Raphael('visualPanel', 600, 600);
		viz = paper.visualizer(300, 300, 200, settings, function(item){ 
			itemToEdit = item;
			
			$('#startTime').val(moment(itemToEdit.time).format("h:mm a"));
			editor.channelEditor('channels', itemToEdit.channelSettings);
			$('#modalDialog').modal('show');
			setTimeout(function(){editor.channelEditor('resize');}, 100);
		});
		
		var clickCallback = function(){
			itemToEdit.time = new Date('1/1/2000 ' + $('#startTime').val());
			itemToEdit.channelSettings = editor.channelEditor('getValues');
			
			viz.drawChart();
		};
		
		$('#modalDialog .btn-primary').click(clickCallback);
		
		$('#modalDialog #delete').click(function(){
			var index = settings.indexOf(itemToEdit);

			if (index > -1) {
				settings.splice(index, 1);
			}
			viz.drawChart();
		});
		
		$('#Add').click(function(){
			var setting = createSetting(moment().format("h:mm a"), .5,.5,.5,.5,.5);
			itemToEdit = settings;
			settings.push(setting);
			viz.drawChart();
			//itemToEdit = setting;
			
			//editor.channelEditor('channels', setting.channelSettings);
			//clickCallback = createCallback;
			//$('#modalDialog').modal('show');
		});
		
		$('#Save').click(function(){
			$.post('schedule/save',
					{schedule: settings},
					function(){}
				);
		});
	});
});
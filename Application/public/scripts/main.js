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

Setting.prototype.toString = function SettingToString(){
	var m = moment(this.time);
	return m.format("h:mm a") + " [r: " + this.channelSettings.r 
		+ " g: " + this.channelSettings.g
		+ " b: " + this.channelSettings.b
		+ "]";
	
}

function createSetting(time, v1, v2, v3, v4, v5){
	var c = [
		{name:'Cool White', color:new Color(212,235,255, v1)},
		{name:'Red', color:new Color(255,0,0, v2)},
		{name:'Green', color:new Color(0,255,0, v3)},
		{name:'Blue', color:new Color(0,0,255, v4)},
		{name:'Royal Blue', color:new Color(65,105,225, v5)}
	];
	return new Setting(new Date('1/1/2000 ' + time), c);
}

function getLightSettings(){
	var Settings = new Array();
	Settings.push(createSetting('6:00 am', .1, .5, .2, .3, .01));
	Settings.push(createSetting('11:00 am', .1, .02, .02, .93, .01));
	Settings.push(createSetting('6:00 pm', .1, .05, .02, .03, .01));
    
	return Settings;
}
var itemToEdit;
var settings;

function refreshSwatch()
{
	var r = $( "#redSlider" ).slider( "value" ),
      g = $( "#greenSlider" ).slider( "value" ),
      b = $( "#blueSlider" ).slider( "value" );
    console.debug('rgb('+r+','+g+','+b+')');
	$('#swatch').css('background-color', 'rgb('+r+','+g+','+b+')');
	
}

$(function(){	
	//Mock DB Access
	settings = getLightSettings();
	var editor = $('#editor').channelEditor({channels: settings[0].channelSettings});
	//initialize Raphael
	var paper = Raphael('visualPanel', 600, 600);
	viz = paper.visualizer(300, 300, 200, settings, function(item){ 
		itemToEdit = item;
		
		$('#startTime').val(moment(itemToEdit.time).format("h:mm a"));
		editor.channelEditor('channels', itemToEdit.channelSettings);
		$('#modalDialog').modal('show');
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
});
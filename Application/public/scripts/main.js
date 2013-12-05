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

function getLightSettings(){
	var channels1 = [
		{name:'Cool White', color:new Color(212,235,255, 0.01)},
		{name:'Red', color:new Color(255,0,0, .8)},
		{name:'Green', color:new Color(0,255,0, .07)},
		{name:'Blue', color:new Color(0,0,255, .05)},
		{name:'Royal Blue', color:new Color(65,105,225, .05)}
	];
	var channels2 = [
		{name:'Cool White', color:new Color(212,235,255, 0.01)},
		{name:'Red', color:new Color(255,0,0, .8)},
		{name:'Green', color:new Color(0,255,0, .07)},
		{name:'Blue', color:new Color(0,0,255, .05)},
		{name:'Royal Blue', color:new Color(65,105,225, .05)}
	];
	var channels3 = [
		{name:'Cool White', color:new Color(212,235,255, 0.01)},
		{name:'Red', color:new Color(255,0,0, .8)},
		{name:'Green', color:new Color(0,255,0, .07)},
		{name:'Blue', color:new Color(0,0,255, .05)},
		{name:'Royal Blue', color:new Color(65,105,225, .05)}
	];
	var channels4 = [
		{name:'Cool White', color:new Color(212,235,255, 0.01)},
		{name:'Red', color:new Color(255,0,0, .8)},
		{name:'Green', color:new Color(0,255,0, .07)},
		{name:'Blue', color:new Color(0,0,255, .05)},
		{name:'Royal Blue', color:new Color(65,105,225, .05)}
	];
	var Settings = new Array();
	Settings.push(new Setting(new Date('1/1/2000 6:00 am'), channels1));
    Settings.push(new Setting(new Date('1/1/2000 12:00 pm'), channels2));
	Settings.push(new Setting(new Date('1/1/2000 6:00 pm'), channels3));
    Settings.push(new Setting(new Date('1/1/2000 9:00 pm'), channels4));
    
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
		$('#startTime').val(moment(item.time).format("h:mm a"));
		
		itemToEdit = item;
		editor.channelEditor('channels', itemToEdit.channelSettings);
		$('#modalDialog').modal('show');
	});
	
	$('#modalDialog .btn-primary').click(function(){
		itemToEdit.time = new Date('1/1/2000 ' + $('#startTime').val());
		itemToEdit.channelSettings = editor.channelEditor('getValues');
		
		viz.drawChart();
	});
	
	
	$('#modalDialog #delete').click(function(){
		var index = settings.indexOf(itemToEdit);

		if (index > -1) {
			settings.splice(index, 1);
		}
		viz.drawChart();
	});
	
	$('#Add').click(function(){
		settings.push(new Setting(new Date('1/1/2000 3:00 PM'), {r:255, g:255, b:255}));
		viz.drawChart();
	});
});
function Setting(t, c){
    this.time = t;
    this.channelSettings = c;    
}

Setting.prototype = {
	constructor : Setting
}

Setting.prototype.toString = function SettingToString(){
	var m = moment(this.time);
	return m.format("h:mm a") + " [r: " + this.channelSettings.r 
		+ " g: " + this.channelSettings.g
		+ " b: " + this.channelSettings.b
		+ "]";
	
}

function getLightSettings(){
	var Settings = new Array();
	Settings.push(new Setting(new Date('1/1/2000 6:00 am'), {r:255,g:0,b:0}));
    Settings.push(new Setting(new Date('1/1/2000 12:00 pm'), {r:255,g:55,b:255}));
	Settings.push(new Setting(new Date('1/1/2000 6:00 pm'), {r:0,g:0,b:255}));
    Settings.push(new Setting(new Date('1/1/2000 9:00 pm'), {r:255,g:0,b:255}));
    Settings.push(new Setting(new Date('1/1/2000 11:00 pm'), {r:215,g:255,b:0}));
	Settings.push(new Setting(new Date('1/1/2000 12:15 am'), {r:0,g:0,b:0}));
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
		
	//initialize Raphael
	var paper = Raphael('visualPanel', 600, 600);
	viz = paper.visualizer(300, 300, 200, settings, function(item){ 
		$('#startTime').val(moment(item.time).format("h:mm a"));
		$('#red').val(item.channelSettings.r);
		$('#green').val(item.channelSettings.g);
		$('#blue').val(item.channelSettings.b);
		
		$('#redSlider').slider("value", item.channelSettings.r);
		$('#greenSlider').slider("value", item.channelSettings.g);
		$('#blueSlider').slider("value", item.channelSettings.b);
		
		$('#redSlider').next().find('span').text(item.channelSettings.r);
		$('#greenSlider').next().find('span').text(item.channelSettings.g);
		$('#blueSlider').next().find('span').text(item.channelSettings.b);
		
		
		itemToEdit = item;
		$('#modalDialog').modal('show');
	});
	
	$('#modalDialog .btn-primary').click(function(){
	
		itemToEdit.time = new Date('1/1/2000 ' + $('#startTime').val());
		itemToEdit.channelSettings.r = $('#redSlider').slider('value');//Number($('#red').val());
		itemToEdit.channelSettings.g = $('#greenSlider').slider('value');//Number($('#green').val());
		itemToEdit.channelSettings.b = $('#blueSlider').slider('value');//Number($('#blue').val());
		
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
	
	$('#redSlider, #greenSlider, #blueSlider').slider({
		orientation: "horizontal",
		range: "min",
		max: 255,
		value: 127, 
		change: function(event, ui){
			$(this).next().find('input').val(ui.value);
			$(this).next().find('span').text(ui.value);
			refreshSwatch();
		},
		slide: refreshSwatch		
	});
});
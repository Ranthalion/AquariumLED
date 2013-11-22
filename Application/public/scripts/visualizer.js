Raphael.fn.visualizer = function(cx, cy, r, Settings, cbClick){
	var paper = this;
	var chart = this.set;
	var center = {x:cx, y:cy};
	
	function timeToAngle(time){
		var minutes = timeToMinutes(time);
		return ((minutes/4)-90);
	}
	
	function angleToTime(angle){
		angle -= 90;
		angle *= -4;
		var m = moment('1/1/2000').add('minutes', angle);
		m.month(0);
		m.date(1);
		m.year(2000);
		
		return m.toDate();
	}

	function timeToMinutes(time){
		return (time.getMinutes() + time.getHours() * 60) 
	}

	function getPointOnCircle(cx,cy,r, a){
		var x = cx + r * Math.cos(a);
		var y = cy + r * Math.sin(a);
		return {'x':x,'y':y};
	}
	
	function arcPath(cx, cy, r, startAngle, endAngle){
		var rad = Math.PI / 180;
		var x1 = cx + r * Math.cos(-startAngle * rad),
			x2 = cx + r * Math.cos(-endAngle * rad),
			y1 = cy + r * Math.sin(-startAngle * rad),
			y2 = cy + r * Math.sin(-endAngle * rad);
		return ["M",  x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2];
	}

	function mix(current, next, j, stepsInSlice){
		var result = {r:0,g:0,b:0};
		result.r = current.r + (((next.r - current.r)/stepsInSlice) * j);
		result.g = current.g + (((next.g - current.g)/stepsInSlice) * j);
		result.b = current.b + (((next.b - current.b)/stepsInSlice) * j);
		return result;
	}

	//TODO: There is still a bug if there are only 2 settings and they are both for the same time. The slices don't get built correctly.
	function createSlices(s){
		var r = new Array(360);
		
		for(var i = 0; i < 360; i++){
			r[i] = {r:0,g:0,b:0};
		}
		
		if (s.length == 1)
		{
			for(var i = 0; i < 360; i++){
				r[i] = s[0].channelSettings;
			}
		}
		else if (s.length > 1)
		{		
			for(var i = 0; i < s.length; i++)
			{
				var startSlice = Math.floor((s[i].time.getMinutes() + s[i].time.getHours() * 60) / 4);
				var endSlice = i == s.length - 1 ? (s[0].time.getMinutes() + s[0].time.getHours() * 60) / 4 : (s[i+1].time.getMinutes() + s[i+1].time.getHours() * 60) / 4;
				endSlice = Math.floor(endSlice);
				
				var current = s[i].channelSettings;
				var next = s[(i<s.length-1 ? i+1 : 0)].channelSettings;
				var stepsInSlice = endSlice >= startSlice ? endSlice - startSlice : 360-startSlice + endSlice;
				
				for(var j = 0; j < stepsInSlice; j++)
				{
					r[(startSlice + j) % 360] = mix(current, next, j, stepsInSlice);
				}
			}
		}
		return r;
	}

	function drawSlices(s){
		var slices = createSlices(s);
		for(var i = 0; i < slices.length; i++)
		{
			var rgb = 'rgb(' + slices[i].r + ',' + 
							slices[i].g + ',' + 
							slices[i].b + ')';
			paper.path(arcPath(cx,cy, r, (i-92)*-1, (i-90)*-1)).attr({'stroke-width':"10", 'stroke':rgb});
		}
	}

	function drawChannelSettings(s){
		for(var i = 0; i<s.length; i++)
		{
			var rgb = 'rgb(' + s[i].channelSettings.r + ',' + 
							s[i].channelSettings.g + ',' + 
							s[i].channelSettings.b + ')';
			var point = getPointOnCircle(cx,cy,r, Raphael.rad(timeToAngle(s[i].time)));
			paper.circle(point.x, point.y, 10).attr({'fill':rgb,'stroke':'black','stroke-width':'2'})
				.data('setting', s[i])
				.hover(function(){
						if (!this.isDragging)
							this.g = this.glow();
					}, function(){
						if (!this.isDragging)
							this.g.remove();
					}
				)
				.drag(function(dx,dy, x, y){
						//move
						if (this.isDragging || dx > 3 || dy > 3)
						{
							this.isDragging = true;
							var d = Raphael.angle(center.x, center.y, Number(this.ox) + Number(dx), Number(this.oy) + Number(dy))-180, 
								rd = Raphael.rad(d);
							var point = getPointOnCircle(center.x, center.y, r, rd);
							this.attr({cx: point.x, cy: point.y});
						}
					},
					function(){
						//start
						this.g.remove();
						this.isDragging = false;
						this.ox = this.attr("cx");
						this.oy = this.attr("cy");
						this.animate({r: 15, opacity: .45}, 250, ">");
					
					},
					function(){
						
						this.animate({r:10, opacity: 1}, 250, ">");
						
						
						if (this.isDragging == false)
						{
							cbClick(this.data('setting'));
						}
						else
						{
							//up
							this.isDragging = false;	
							var s = this.data('setting');
							var angle = Raphael.angle(center.x, center.y, this.attr('cx'), this.attr('cy'))-180;
							angle*=-1;
							s.time = angleToTime(angle);
							paper.drawChart();
						}
					
					}
				);
		}
	}

	function drawTimeMarker(time, label){
		//convert time to angle (is this degrees or radians?)
		
		var p1 = getPointOnCircle(cx, cy, r-15, Raphael.rad(timeToAngle(time)));
		var p2 = getPointOnCircle(cx, cy, r+15, Raphael.rad(timeToAngle(time)));
		paper.path("M" + p1.x + "," + p1.y + "L" + p2.x + ", " + p2.y).attr({'stroke-width':'3'});
		var xOffset = 0;
		if (p2.x > 300)
			xOffset = 20;
		if (p2.x < 200)
			xOffset = -20;
		var yOffset = 0;
		if (p2.y > 300)
			yOffset = 10;
		if (p2.y < 200)
			yOffset = -10;
		paper.text(p2.x,p2.y, label).translate(xOffset,yOffset);
	}
	
	this.drawChart = function(){
		paper.clear();	
		Settings.sort(function(a,b)
		{
			return moment(a.time) - moment(b.time);
		});
		drawSlices(Settings);
		
		paper.circle(cx,cy,r-5).attr('stroke-width','2');
		paper.circle(cx,cy,r+5).attr('stroke-width','2');
		
		//draw time markers
		drawTimeMarker(new Date('1/1/2000 12:00 AM'), 'Midnight');
		drawTimeMarker(new Date('1/1/2000 12:00 PM'), 'Noon');
		drawTimeMarker(new Date('1/1/2000 6:00 AM'), '6:00 AM');
		drawTimeMarker(new Date('1/1/2000 6:00 PM'), '6:00 PM');
		
		//draw channel settings
		drawChannelSettings(Settings);
	}
	paper.drawChart();
	return this;
};

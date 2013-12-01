function Color(r,g,b,a){
	this.r = r||0;
	this.g = g||0;
	this.b = b||0;
	this.a = a||1;
}

Color.prototype.toRGBString = function(){
	return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
}

Color.prototype.scale = function(factor){
	var r=0;
	var g=0;
	var b=0;
	r=Math.min(Math.floor(this.r * factor), 255);
	g=Math.min(Math.floor(this.g * factor), 255);
	b=Math.min(Math.floor(this.b * factor), 255);
	
	return new Color(r,g,b);
}

Color.Mix = function(colors){
	var newColor = new Color();
	
	for(var i = 0; i < colors.length; i++){
		var scaled = colors[i].scale(colors[i].a);
		//var scaled = scale(colors[i].color, colors[i].a)	
		newColor.r += scaled.r;
		newColor.g += scaled.g;
		newColor.b += scaled.b;
	}
	newColor.r=Math.min(newColor.r,255);
	newColor.g=Math.min(newColor.g,255);
	newColor.b=Math.min(newColor.b,255);
	return newColor;
}
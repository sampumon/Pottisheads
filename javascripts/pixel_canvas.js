var PixelCanvas = {
	target: null,
	targetCtx: null,
	drawMode: false,
	drawColor: "green",
	drawSize: 20,
	
	init: function(target) {
		this.target = target;
		this.targetCtx = target.getContext("2d");
		this.changeColor(this.drawColor);

		this.target.onmousedown = this.mouseDown;
		this.target.onmousemove = this.mouseMove;
		this.target.onmouseup = this.mouseUp;
	},
	
	clearCanvas: function() {
		this.targetCtx.clearRect(0,0,this.target.width,this.target.height);
	},
	
	mouseDown: function(e) {
		PixelCanvas.drawMode = true;

		var mouse = getMouseCoords(e, PixelCanvas.target);
		PixelCanvas.drawPixel(mouse.x, mouse.y);

		e.preventDefault();
	},
	
	mouseUp: function(e) {
		PixelCanvas.drawMode = false;
		e.preventDefault();
	},
	
	mouseMove: function(e) {
		var mouse = getMouseCoords(e, PixelCanvas.target);

		if (PixelCanvas.drawMode) PixelCanvas.drawPixel(mouse.x, mouse.y);

		e.preventDefault();
	},

	drawPixel: function(x, y) {
		this.targetCtx.fillRect (x - this.drawSize/2, y - this.drawSize/2, this.drawSize, this.drawSize);
	},
	
	changeColor: function(c) {
		this.drawColor = c;
		this.targetCtx.fillStyle = this.drawColor;
	},

	changeBrush: function(s) {
		this.drawSize = s;
	},
	
	drawImage: function(href, x, y) {
		var ctx = this.targetCtx;
		var img = new Image();
		img.src = href;

		img.onload = function() {
			// no need to set width&height
			ctx.drawImage(img, (x | 0), (y | 0));
		}
		
		img.onerror = function() {
			console.log("Can't draw image! Sorry!")
		}
	}
};

var PixelSVG = {
	svgNS: "http://www.w3.org/2000/svg",
	xlinkNS: "http://www.w3.org/1999/xlink",
	target: null,
	drawMode: false,
	drawColor: "green",
	drawSize: 20,
	
	init: function(target) {
		this.target = target;

		this.target.onmousedown = this.mouseDown;
		this.target.onmousemove = this.mouseMove;
		this.target.onmouseup = this.mouseUp;
	},
	
	clearCanvas: function() {
		while (target.children.length > 0)
			target.removeChild(target.children[0]);
	},

	mouseDown: function(e) {
		PixelSVG.drawMode = true;

		var mouse = getMouseCoords(e, PixelSVG.target);
		PixelSVG.drawPixel(mouse.x, mouse.y);

		// always do this
		e.preventDefault();
	},
	
	mouseUp: function(e) {
		PixelSVG.drawMode = false;
		e.preventDefault();
	},

	mouseMove: function(e) {
		var mouse = getMouseCoords(e, PixelSVG.target);

		if (PixelSVG.drawMode) PixelSVG.drawPixel(mouse.x, mouse.y);

		e.preventDefault();
	},

	drawPixel: function(x, y) {
		var pixel = document.createElementNS(this.svgNS, "rect");
		pixel.setAttribute('style', "fill:" + this.drawColor);
		pixel.setAttribute('x', x - this.drawSize/2);
		pixel.setAttribute('y', y - this.drawSize/2);
		pixel.setAttribute('width', this.drawSize);
		pixel.setAttribute('height', this.drawSize);
		this.target.appendChild(pixel);
	},

	changeColor: function(c) {
		this.drawColor = c;
	},

	changeBrush: function(s) {
		this.drawSize = s;
	},
}

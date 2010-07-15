var VectorSVG = {
	svgNS: "http://www.w3.org/2000/svg",
	xlinkNS: "http://www.w3.org/1999/xlink",
	target: null,
	dragTarget: null,
	prevMouse: null,
	draggin: false,
	zoomin: false,
	
	init: function(target) {
		this.target = target;

		this.target.onmousedown = this.mouseDown;
		this.target.onmousemove = this.mouseMove;
		this.target.onmouseup = this.mouseUp;
	},

	clearCanvas: function() {
		while (this.target.children.length > 0)
			this.target.removeChild(this.target.children[0]);
	},

	mouseDown: function(e) {
		if (e.target != VectorSVG.target) {
			VectorSVG.dragTarget = e.target;
			if (e.button == 0) VectorSVG.draggin = true;
			if (e.button == 2) VectorSVG.zoomin = true;
			
			// initialize transforms
			if (!VectorSVG.dragTarget._translateX) VectorSVG.dragTarget._translateX = 0;
			if (!VectorSVG.dragTarget._translateY) VectorSVG.dragTarget._translateY = 0;
			if (!VectorSVG.dragTarget._scale) VectorSVG.dragTarget._scale = 1;

			VectorSVG.prevMouse = getMouseCoords(e, VectorSVG.target);

			// also move it on top (that's to the end of DOM)
			VectorSVG.moveOnTop(e.target);
		}

		// always do this
		e.preventDefault();
	},
	
	mouseUp: function(e) {
		if (e.button == 0) VectorSVG.draggin = false;
		if (e.button == 2) VectorSVG.zoomin = false;
		if (!(VectorSVG.draggin || VectorSVG.zoomin)) VectorSVG.dragTarget = null;
		e.preventDefault();
	},

	mouseMove: function(e) {
		var mouse = getMouseCoords(e, VectorSVG.target);

		if (VectorSVG.draggin) {
			VectorSVG.dragTarget._translateX += mouse.x - VectorSVG.prevMouse.x;
			VectorSVG.dragTarget._translateY += mouse.y - VectorSVG.prevMouse.y;
		}

		if (VectorSVG.zoomin) {
			VectorSVG.dragTarget._scale -= (mouse.y - VectorSVG.prevMouse.y) / 10;
		}

		if (VectorSVG.dragTarget) VectorSVG.applyTransforms(VectorSVG.dragTarget);

		VectorSVG.prevMouse = mouse;
		e.preventDefault();
	},

	moveOnTop: function(elem) {
		this.target.appendChild(elem);
	},
	
	applyTransforms: function(elem) {
		elem.setAttribute('transform',
			'translate(' + elem._translateX + ',' + elem._translateY + ')' +
			'scale(' + elem._scale + ')'
		);
	},

	addCircle: function(x, y) {
		//var r = Math.floor(Math.random() * 90) + 10;
		var r = 40;
		
		var circle = document.createElementNS(this.svgNS, "circle");
		circle.setAttribute('style', "fill:" + randomRGB());
		circle.setAttribute('cx', (x || r) - r/2);
		circle.setAttribute('cy', (y || r) - r/2);
		circle.setAttribute('r', r);

		this.target.appendChild(circle);
	},
}

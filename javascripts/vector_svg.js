var VectorSVG = {
	svgNS: "http://www.w3.org/2000/svg",
	xlinkNS: "http://www.w3.org/1999/xlink",
	idCounter: 0,
	target: null,
	dragTarget: null,
	prevMouse: null,
	draggin: false,
	zoomin: false,
	
	init: function(target) {
		this.target = target;
		
		// var backdrop = document.createElementNS(this.svgNS, "rect");
		// backdrop.setAttribute('fill', "white");
		// backdrop.setAttribute('x1', 0);
		// backdrop.setAttribute('y1', 0);
		// backdrop.setAttribute('width', this.target.width.baseVal.value);
		// backdrop.setAttribute('height', this.target.height.baseVal.value);
		// this.target.appendChild(backdrop);
		
		this.target.onmousedown = this.mouseDown;
		this.target.onmouseup = this.mouseUp;
		this.target.onmousemove = this.mouseMove;

		// as a neat trick, we add onclick to parent (div) of our svg element;
		// thus, even safari captures events for empty svg areas!
		// a 'backdrop' rectangle would be better, sorry about that.
		this.target.parentNode.onclick = this.mouseClick;
		
		// second one is for FF
		this.target.onmousewheel = this.mouseWheel;
		this.target.addEventListener('DOMMouseScroll', this.mouseWheel, false);
	},
	
	clearCanvas: function() {
		// safari has no .children for svg, so we use childNodes
		while (this.target.childNodes.length > 0)
			this.target.removeChild(this.target.childNodes[0]);		
	},

	mouseClick: function(e) {
		var mouse = getMouseCoords(e, VectorSVG.target);
		// hackishly skip out-of-svg clicks
		if (mouse.x < 0 || mouse.y < 0) return;

		// if we were just draggin', skip circle plotting
		if (VectorSVG.draggin) VectorSVG.draggin = false;
		else VectorSVG.addCircle(mouse.x, mouse.y);
	},

	mouseDown: function(e) {
		if (e.target == VectorSVG.target || e.button != 0) return;

		VectorSVG.dragTarget = e.target;
		VectorSVG.prevMouse = getMouseCoords(e, VectorSVG.target);
		VectorSVG.moveOnTop(VectorSVG.dragTarget);

		e.preventDefault();
	},
	
	mouseUp: function(e) {
		if (e.button != 0) return;
		
		VectorSVG.dragTarget = null;

		e.preventDefault();
	},
	
	mouseMove: function(e) {
		var mouse = getMouseCoords(e, VectorSVG.target);

		// acnowledge that dragging has commenced
		if (VectorSVG.dragTarget) VectorSVG.draggin = true;

		if (VectorSVG.draggin) {
			VectorSVG.translate(VectorSVG.dragTarget,
				mouse.x - VectorSVG.prevMouse.x, 
				mouse.y - VectorSVG.prevMouse.y);
		}

		VectorSVG.prevMouse = mouse;
		
		e.preventDefault();
	},

	mouseWheel: function(e) {
		// allow page scrolling around circles
		if (e.target != VectorSVG.target) {
			var mouse = getMouseCoords(e, VectorSVG.target);
			var wheel = getMouseWheel(e);

			VectorSVG.scale(e.target, wheel / 10);

			e.preventDefault();
		}
	},

	translate: function(elem, x, y) {
		if (!elem._translateX) elem._translateX = 0;
		if (!elem._translateY) elem._translateY = 0;

		elem._translateX += x;
		elem._translateY += y;
		
		VectorSVG.applyTransforms(elem);
	},

	scale: function(elem, s, cx, cy) {
		if (!elem._scale) elem._scale = 1;
		elem._scale += elem._scale * s;

		// center scaling on mouse (or target element center)
		// TODO: centering on mouse don't work when mouse is moved after scaling
		var bb = elem.getBBox();
		elem._scaleTX = cx || (bb.x + bb.width / 2);
		elem._scaleTY = cy || (bb.y + bb.height / 2);
		
		VectorSVG.applyTransforms(elem);
	},

	applyTransforms: function(elem) {
		var tr = 'translate(' + (elem._translateX || 0) + ',' + (elem._translateY || 0) + ')';

		if (elem._scale) tr +=
			'translate(' + elem._scaleTX + ',' + elem._scaleTY + ')' +
			'scale(' + elem._scale + ')' +
			'translate(' + -elem._scaleTX + ',' + -elem._scaleTY + ')';

		elem.setAttribute('transform', tr);

		//console.log(elem.getAttribute('transform'));
		//var c = elem.getCTM();
		//console.log(c.a + " " + c.b + " " + c.c + " " + c.d + " " + c.e + " " + c.f);
	},

	moveOnTop: function(elem) {
		this.target.appendChild(elem);
	},
	
	addCircle: function(x, y, r) {
		// randomize r if not given
		if (!r) var r = randomInt(90) + 10;
		
		var circle = document.createElementNS(this.svgNS, "circle");
		circle.setAttribute('style', "fill:" + randomRGB());
		circle.setAttribute('cx', x);
		circle.setAttribute('cy', y);
		circle.setAttribute('r', r);

		this.target.appendChild(circle);
	},

	addRandomCircle: function() {
		var x = randomInt(this.target.width.baseVal.value);
		var y = randomInt(this.target.height.baseVal.value);

		this.addCircle(x, y)
	},
	
	addImage: function(href, x, y) {
		// must be careful with the namespaces
		svgimg = document.createElementNS(this.svgNS, "image");
		svgimg.setAttribute('id', 'image_' + this.idCounter++);
		svgimg.setAttributeNS(this.xlinkNS, 'xlink:href', href);

		svgimg.setAttribute('x', x ? x : 0);
		svgimg.setAttribute('y', y ? y : 0);

		// TODO: need prefetch or onload handler to get width&height?
		// DOESN'T WORK: svgimg.width.baseVal.valueAsString
		svgimg.setAttribute('width', '50%');
		svgimg.setAttribute('height', '50%');

		this.target.appendChild(svgimg);
	}
	
}

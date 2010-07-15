var CakeCanvas = {
	target: null,
	targetCanvas: null,
	globalzIndex: 0,
	
	init: function(holder) {
		//this.target = new Canvas(holder, holder.getAttribute("width"), holder.getAttribute("height"));
		this.targetCanvas = E.canvas(holder.clientWidth, holder.clientHeight);
		this.target = new Canvas(this.targetCanvas);
		holder.appendChild(this.targetCanvas);

		//this.target.when("mousedown", this.mouseDown);
		//this.target.when("mousemove", this.mouseMove);
		//this.target.when("mouseup", this.mouseUp);
	},
	
	mouseDown: function(e) {
		// now we have clicked element as this, because Cake doesn't give it as e.target
		if (this != CakeCanvas.target) {
			CakeCanvas.dragTarget = this;
			CakeCanvas.prevMouse = { x: this.mouseX, y: this.mouseY }
		}

		// always do this
		e.preventDefault();
	},
	
	mouseUp: function(e) {
		CakeCanvas.dragTarget = null;
		e.preventDefault();
	},

	mouseMove: function(e) {
		//var mouse = getMouseCoords(e, CakeCanvas.target);
		//console.log(mouse);
		var mouse = { x: this.mouseX, y: this.mouseY }

		if (CakeCanvas.dragTarget) {
			CakeCanvas.dragTarget.x = mouse.x;
			CakeCanvas.dragTarget.y = mouse.y;
		};

		e.preventDefault();
	},

	_addDragResizeBehaviour: function(element) {
		element._dragBeginMouseY = 0;
		element._dragBeginMouseX = 0;

		element.when("mousedown", function (e) {
			if (e.button == 2) {
				element.focused_left = true;
			}

			if (e.button == 0) {
	 			element.focused_right = true;
			}
		
			element._dragBeginMouseY = this.root.mouseY;
			element._dragBeginMouseX = this.root.mouseX;
		
			element.zIndex = CakeCanvas.globalzIndex++;
		
			e.preventDefault();
		})
	
		element.when("mouseup", function (e) {
			element.focused_left = false;
			element.focused_right = false;
			e.preventDefault();
	  	})

	  	element.when("mousemove", function (e) {
			if (element.focused_right) {
				element.x = this.root.mouseX;
				element.y = this.root.mouseY;
			}
		
			if (element.focused_left) {
				var amount = (element._dragBeginMouseY - this.root.mouseY);
				element.radius = element.radius + amount;
			}

			e.preventDefault();
	  	})
	},

	addCircle: function(x, y) {
		var r = 40;
		var circle = new Circle(r, { x: (x || r) - r/2, y: (y || r) - r/2, fill: randomRGB() })

		// make it draggable
		CakeCanvas._addDragResizeBehaviour(circle);
		
		this.target.append(circle);
	}
};
